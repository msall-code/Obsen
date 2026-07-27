import axios from 'axios';
import keycloak from '../services/keycloak';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // URL de votre backend Spring Boot
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur : Ajoute automatiquement le token JWT avant chaque requête HTTP
axiosClient.interceptors.request.use(
  async (config) => {
    if (keycloak.authenticated) {
      // Met à jour le token s'il expire dans moins de 30 secondes
      try {
        await keycloak.updateToken(30);
      } catch (error) {
        console.error("Échec du rafraîchissement du token", error);
        keycloak.login();
      }
      
      // Injecte le token dans le header Authorization
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;