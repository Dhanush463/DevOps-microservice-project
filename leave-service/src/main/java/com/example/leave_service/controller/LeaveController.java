package com.example.leave_service.controller;

import com.example.leave_service.dto.EmployeeDTO;
import com.example.leave_service.model.LeaveRequest;
import com.example.leave_service.repository.LeaveRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    private final LeaveRepository repository;
    private final RestClient restClient;

    public LeaveController(LeaveRepository repository,
                           @Value("${employee.service.url}") String employeeServiceUrl) {
        this.repository = repository;
        this.restClient = RestClient.builder()
                .baseUrl(employeeServiceUrl)
                .build();
    }

    @GetMapping
    public List<LeaveRequest> getAllLeaves() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> applyLeave(@RequestBody LeaveRequest request) {
        try {
            // Inter-service call to employee-service
            EmployeeDTO employee = restClient.get()
                    .uri("/{id}", request.getEmployeeId())
                    .retrieve()
                    .body(EmployeeDTO.class);

            if (employee == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found");
            }

            request.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
            request.setStatus("PENDING");
            return ResponseEntity.ok(repository.save(request));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Could not verify Employee ID: " + request.getEmployeeId());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<LeaveRequest> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return repository.findById(id)
                .map(leave -> {
                    leave.setStatus(status.toUpperCase());
                    return ResponseEntity.ok(repository.save(leave));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}