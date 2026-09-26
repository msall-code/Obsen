import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

// Injection automatique du token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // ou via AuthContext
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;