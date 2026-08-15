import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});
api.interceptors.response.use(response => response, error => {
  if (error?.response?.status === 401) {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  }
  const message = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Request failed';
  return Promise.reject(new Error(message));
});
export default api;
