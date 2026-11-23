import axios from 'axios';

const API_GATEWAY_URL = `${import.meta.env.PROD ? '' : 'http://localhost:8080'}/api`;

export const employeeApi = {
  getAll: () => axios.get(`${API_GATEWAY_URL}/employees`),
  create: (data) => axios.post(`${API_GATEWAY_URL}/employees`, data),
  delete: (id) => axios.delete(`${API_GATEWAY_URL}/employees/${id}`),
};

export const departmentApi = {
  getAll: () => axios.get(`${API_GATEWAY_URL}/departments`),
  create: (data) => axios.post(`${API_GATEWAY_URL}/departments`, data),
  delete: (id) => axios.delete(`${API_GATEWAY_URL}/departments/${id}`),
};

export const leaveApi = {
  getAll: () => axios.get(`${API_GATEWAY_URL}/leaves`),
  apply: (data) => axios.post(`${API_GATEWAY_URL}/leaves`, data),
  updateStatus: (id, status) =>
    axios.put(`${API_GATEWAY_URL}/leaves/${id}/status?status=${status}`),
};