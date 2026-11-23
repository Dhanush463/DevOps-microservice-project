import React, { useState } from 'react';
import EmployeeManager from './components/EmployeeManager';
import DepartmentManager from './components/DepartmentManager';
import LeaveManager from './components/LeaveManager';

export default function App() {
  const [activeTab, setActiveTab] = useState('employees');

  return (
    <div>
      <nav style={{ padding: '15px', background: '#222', color: '#fff', display: 'flex', gap: '15px' }}>
        <button onClick={() => setActiveTab('employees')}>Employees</button>
        <button onClick={() => setActiveTab('departments')}>Departments</button>
        <button onClick={() => setActiveTab('leaves')}>Leave Requests</button>
      </nav>

      {activeTab === 'employees' && <EmployeeManager />}
      {activeTab === 'departments' && <DepartmentManager />}
      {activeTab === 'leaves' && <LeaveManager />}
    </div>
  );
}