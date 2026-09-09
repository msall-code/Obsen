import axios from 'axios';
import keycloak from './keycloak';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête : Rafraîchit l'access token s'il expire dans les 30s
axiosClient.interceptors.request.use(
  async (config) => {
    if (keycloak?.authenticated) {
      try {
        // Tente de rafraîchir le token s'il expire sous 30 secondes
        await keycloak.updateToken(30);
        config.headers.Authorization = `Bearer ${keycloak.token}`;
      } catch (err) {
        console.error('❌ Refresh Token expiré ou invalide. Déconnexion automatique...', err);
        keycloak.logout();
        return Promise.reject(err);
      }
    } else {
      console.warn("⚠️ Client non authentifié sur Keycloak.");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse : Redirige vers logout en cas de 401
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("⚠️ Session invalide ou expirée (401). Déconnexion...");
      if (keycloak?.authenticated) {
        keycloak.logout();
      }
    }

    if (status === 403) {
      console.error("⛔ [403 Forbidden] Rôle insuffisant ou mal extrait par le backend.");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;