// src/api/axiosClient.js
import axios from 'axios';
import { logout } from '../services/authService';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour CHAQUE requête
// src/api/axiosClient.js
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  const tenantId = localStorage.getItem('tenant_id');

  // NE PAS envoyer de token si on appelle le login !
  const isLoginRequest = config.url?.includes('/auth/login');

  if (token && !isLoginRequest) {
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
    // Ne PAS exécuter logout() si la requête échouée est la tentative d'authentification
    const url = error.config?.url || '';
    const isLoginRequest = url.includes('/auth/login');

    if (error.response && (error.response.status === 401 || error.response.status === 403) && !isLoginRequest) {
      logout();
    }
    return Promise.reject(error);
  }
);

export default axiosClient;