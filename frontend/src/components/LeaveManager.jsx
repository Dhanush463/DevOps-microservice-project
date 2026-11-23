import React, { useState, useEffect } from 'react';
import { leaveApi, employeeApi } from '../services/api';

export default function LeaveManager() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ employeeId: '', startDate: '', endDate: '', reason: '' });

  const loadData = async () => {
    const [leaveRes, empRes] = await Promise.all([leaveApi.getAll(), employeeApi.getAll()]);
    setLeaves(leaveRes.data);
    setEmployees(empRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await leaveApi.apply(form);
    setForm({ employeeId: '', startDate: '', endDate: '', reason: '' });
    loadData();
  };

  const handleStatusChange = async (id, status) => {
    await leaveApi.updateStatus(id, status);
    loadData();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Leave Management</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <select
          value={form.employeeId}
          onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
          required
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.firstName} {emp.lastName} (ID: {emp.id})
            </option>
          ))}
        </select>
        <input
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          required
        />
        <input
          type="date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          required
        />
        <input
          placeholder="Reason"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          required
        />
        <button type="submit">Apply Leave</button>
      </form>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Dates</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((l) => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.employeeName} (ID: {l.employeeId})</td>
              <td>{l.startDate} to {l.endDate}</td>
              <td>{l.reason}</td>
              <td>{l.status}</td>
              <td>
                <button onClick={() => handleStatusChange(l.id, 'APPROVED')}>Approve</button>
                <button onClick={() => handleStatusChange(l.id, 'REJECTED')} style={{ marginLeft: '5px' }}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}