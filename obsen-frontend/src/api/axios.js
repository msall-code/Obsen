import axios from 'axios';
import keycloak from '../keycloak'; // S'assure de pointer vers src/keycloak.js

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur : injection dynamique du token JWT avant chaque requête
api.interceptors.request.use(async (config) => {
    if (keycloak.authenticated) {
        try {
            // Rafraîchit le token S'IL expire dans moins de 30 secondes
            await keycloak.updateToken(30);
            config.headers.Authorization = `Bearer ${keycloak.token}`;
        } catch (error) {
            console.warn("Session expirée, redirection vers login.ftl...", error);
            keycloak.login();
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;  