import axios from 'axios';
import keycloak from '../keycloak';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Intercepteur : Injection automatique du token JWT Bearer
api.interceptors.request.use(
  async (config) => {
    if (keycloak.authenticated) {
      // Mettre à jour le token si expiration imminente (< 30 secondes)
      try {
        await keycloak.updateToken(30);
      } catch (error) {
        console.error('Erreur lors du rafraîchissement du token', error);
        keycloak.login();
      }
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;