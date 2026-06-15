import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tambahkan token ke setiap request jika ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ────────────────────────────────────────────────────────────────────

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const register = (name, email, password, role = 'user') =>
  api.post('/auth/register', { name, email, password, role });

export const getMe = () => api.get('/auth/me');

// ─── Users ───────────────────────────────────────────────────────────────────

export const getUsers = () => api.get('/auth/users');

export const getUserById = (id) => api.get(`/auth/users/${id}`);

export const updateUser = (id, data) => api.put(`/auth/users/${id}`, data);

export const updatePassword = (id, password) =>
  api.put(`/auth/users/${id}/password`, { password });

export const deleteUser = (id) => api.delete(`/auth/users/${id}`);

export default api;
