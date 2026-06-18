import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const unwrapList = (response) => {
  const payload = response.data;
  if (Array.isArray(payload)) return payload;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  return [];
};

export const getApiError = (error, fallback = 'Terjadi kesalahan. Coba lagi.') =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  (typeof error.response?.data === 'string' ? error.response.data : null) ||
  fallback;

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

// ─── Employees ───────────────────────────────────────────────────────────────

export const getEmployees = () => api.get('/employees/');

export const createEmployee = (data) => api.post('/employees/', data);

export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);

export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

// ─── Criteria ────────────────────────────────────────────────────────────────

export const getCriteria = () => api.get('/criteria/');

export const createCriteria = (data) => api.post('/criteria/', data);

export const updateCriteria = (id, data) => api.put(`/criteria/${id}`, data);

export const deleteCriteria = (id) => api.delete(`/criteria/${id}`);

export default api;
