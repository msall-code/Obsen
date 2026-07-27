import axios from 'axios';

const KEYCLOAK_URL = 'http://localhost:7089/auth';
const REALM = 'Obsen';
const CLIENT_ID = 'obsen-client';

export const authService = {
  /**
   * Connexion via API Keycloak (Direct Access Grants)
   */
  login: async (username, password) => {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', CLIENT_ID);
    params.append('username', username);
    params.append('password', password);

    try {
      const response = await axios.post(
        `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      // Stockage des jetons dans le localStorage
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);

      return response.data;
    } catch (error) {
      console.error('Erreur de connexion:', error.response?.data || error.message);
      throw new Error('Identifiants incorrects ou serveur indisponible');
    }
  },

  /**
   * Déconnexion
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  },

  /**
   * Récupérer le jeton actuel
   */
  getToken: () => localStorage.getItem('token'),

  /**
   * Extraire les rôles du jeton JWT
   */
  getUserRoles: () => {
    const token = localStorage.getItem('token');
    if (!token) return [];
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.realm_access?.roles || [];
    } catch (e) {
      return [];
    }
  }
};