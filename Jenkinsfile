pipeline {
  agent any                                   // run on this Jenkins server

  options {
    timestamps()                              // time prefix on every log line
    disableConcurrentBuilds()                 // never two pipelines at once (RAM!)
    timeout(time: 60, unit: 'MINUTES')        // kill a stuck build
    buildDiscarder(logRotator(numToKeepStr: '10'))   // keep only the last 10 build records
  }

  triggers { pollSCM('H/5 * * * *') }         // check Git every ~5 min (H = spread the load)

  parameters {
    choice(name: 'ONLY_SERVICE',
           choices: ['all', 'frontend', 'api-gateway', 'employee-service', 'department-service', 'leave-service'],
           description: 'Which service to build and deploy')
    booleanParam(name: 'RUN_TESTS', defaultValue: true,
                 description: 'Run Maven unit tests (untick if your tests need a database)')
  }

  environment {
    AWS_REGION = 'ap-south-1'
    APP_URL    = 'http://WORKER_PRIVATE_IP:30080'   // EDIT: private_ip of k8s-worker-1 from your inventory.ini
  }

  stages {
    stage('Prepare') {
      steps {
        script {
          def account = sh(script: 'aws sts get-caller-identity --query Account --output text', returnStdout: true).trim()
          def sha     = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
          env.REGISTRY = "${account}.dkr.ecr.${AWS_REGION}.amazonaws.com"
          env.TAG      = "${BUILD_NUMBER}-${sha}"           // e.g. 12-a1b2c3d : unique and traceable to the commit
          env.SERVICES = (params.ONLY_SERVICE == null || params.ONLY_SERVICE == 'all') ?
                         'frontend api-gateway employee-service department-service leave-service' : params.ONLY_SERVICE
          echo "Registry=${env.REGISTRY} Tag=${env.TAG} Services=${env.SERVICES}"
        }
      }
    }

    stage('Unit tests') {
      when { expression { params.RUN_TESTS == null || params.RUN_TESTS } }
      steps {
        script {
          env.SERVICES.tokenize(' ').findAll { it != 'frontend' }.each { svc ->
            withEnv(["SVC=${svc}"]) {
              sh '''
                mkdir -p $HOME/.m2
                docker run --rm --user "$(id -u):$(id -g)" \
                  -v "$PWD/$SVC":/app -v "$HOME/.m2":/m2 -w /app \
                  maven:3.9-eclipse-temurin-17 \
                  mvn -B -q -Dmaven.repo.local=/m2/repository test
              '''
            }
          }
        }
      }
    }

    stage('Build and push images') {
      steps {
        sh 'aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $REGISTRY'
        script {
          env.SERVICES.tokenize(' ').each { svc ->
            withEnv(["SVC=${svc}"]) {
              sh '''
                docker build -t "$REGISTRY/emp/$SVC:$TAG" "$SVC"
                docker push "$REGISTRY/emp/$SVC:$TAG"
              '''
            }
          }
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        withCredentials([file(credentialsId: 'kubeconfig-emp', variable: 'KUBECONFIG')]) {
          script {
            env.SERVICES.tokenize(' ').each { svc ->
              withEnv(["SVC=${svc}"]) {
                sh '''
                  kubectl set image deployment/$SVC $SVC=$REGISTRY/emp/$SVC:$TAG
                  if ! kubectl rollout status deployment/$SVC --timeout=300s; then
                    echo "Rollout failed, rolling back $SVC"
                    kubectl rollout undo deployment/$SVC
                    exit 1
                  fi
                '''
              }
            }
          }
        }
      }
    }

    stage('Smoke test') {
      steps {
        sh '''
          for i in $(seq 1 12); do
            if curl -fsS "$APP_URL/api/employees" > /dev/null; then echo "App is healthy"; exit 0; fi
            echo "Waiting for app ($i/12)..."; sleep 10
          done
          echo "Smoke test failed"; exit 1
        '''
      }
    }
  }

  post {
    always {
      sh 'docker image prune -f || true'      // remove dangling images so the 30 GB disk never fills
      deleteDir()                             // clean the workspace
    }
    success { echo "Deployed ${env.TAG}" }
    failure { echo "Pipeline failed. Check the stage that is red." }
  }
}