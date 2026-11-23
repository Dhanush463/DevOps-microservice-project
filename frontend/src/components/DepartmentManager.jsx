import React, { useState, useEffect } from 'react';
import { departmentApi } from '../services/api';

export default function DepartmentManager() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: '', location: '', managerName: '' });

  const loadDepartments = async () => {
    const res = await departmentApi.getAll();
    setDepartments(res.data);
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await departmentApi.create(form);
    setForm({ name: '', location: '', managerName: '' });
    loadDepartments();
  };

  const handleDelete = async (id) => {
    await departmentApi.delete(id);
    loadDepartments();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Departments</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          placeholder="Department Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        />
        <input
          placeholder="Manager Name"
          value={form.managerName}
          onChange={(e) => setForm({ ...form, managerName: e.target.value })}
          required
        />
        <button type="submit">Add Department</button>
      </form>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Manager</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.id}>
              <td>{dept.id}</td>
              <td>{dept.name}</td>
              <td>{dept.location}</td>
              <td>{dept.managerName}</td>
              <td>
                <button onClick={() => handleDelete(dept.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}