import axios from 'axios';
import keycloak from '../config/keycloak';

const axiosInstance = axios.create({
  baseURL: '', // Utilise le proxy Vite ('/api')
});

axiosInstance.interceptors.request.use(
  async (config) => {
    // Si l'utilisateur est authentifié dans Keycloak
    if (keycloak.token) {
      // Optionnel : rafraîchit le token s'il expire dans moins de 30 secondes
      try {
        await keycloak.updateToken(30);
      } catch (error) {
        console.error("Erreur lors du rafraîchissement du token", error);
      }

      // Ajout du header Authorization avec le JWT
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;