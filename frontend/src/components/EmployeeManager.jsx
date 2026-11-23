import React, { useState, useEffect } from 'react';
import { employeeApi } from '../services/api';

export default function EmployeeManager() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', departmentId: '' });

  const loadEmployees = async () => {
    const res = await employeeApi.getAll();
    setEmployees(res.data);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await employeeApi.create(form);
    setForm({ firstName: '', lastName: '', email: '', departmentId: '' });
    loadEmployees();
  };

  const handleDelete = async (id) => {
    await employeeApi.delete(id);
    loadEmployees();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Employee Management</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          placeholder="First Name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          required
        />
        <input
          placeholder="Last Name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Department ID"
          type="number"
          value={form.departmentId}
          onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
        />
        <button type="submit">Add Employee</button>
      </form>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.firstName}</td>
              <td>{emp.lastName}</td>
              <td>{emp.email}</td>
              <td>{emp.departmentId || 'N/A'}</td>
              <td>
                <button onClick={() => handleDelete(emp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}