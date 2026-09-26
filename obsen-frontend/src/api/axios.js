import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

// Injection automatique du token Bearer avant chaque appel HTTP
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Ajustez selon votre gestion de session/token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;