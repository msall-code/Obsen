// src/api/axiosClient.js
import axios from 'axios';
import { logout } from '../services/authService';

const axiosClient = axios.create({
  // Port 8080 au lieu de 8081
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour CHAQUE requête
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  const tenantId = localStorage.getItem('tenant_id');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (tenantId) {
    config.headers['X-Tenant-ID'] = tenantId;
  }

  return config;
}, (error) => Promise.reject(error));

// Intercepteur pour gérer l'expiration du token (401/403)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Vérification sécurisée du path de login
    const url = error.config?.url || '';
    const isLoginRequest = url.includes('/login') || url.includes('/auth');

    // N'exécuter logout() QUE si l'erreur 401/403 NE VIENT PAS de la tentative de login
    if (error.response && (error.response.status === 401 || error.response.status === 403) && !isLoginRequest) {
      logout();
    }
    return Promise.reject(error);
  }
);
export default axiosClient;