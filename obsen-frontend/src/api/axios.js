import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Injection automatique du Token JWT pour chaque requête
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs globales de sécurité
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status } = error.response;

            if (status === 401) {
                console.error('[Sécurité] Session expirée ou jeton invalide (401). Redirection vers le login...');
                // Éventuelle redirection ou nettoyage de session ici
            } else if (status === 403) {
                console.error('[Sécurité] Accès refusé (403) : Droits insuffisants (Rôle ADMIN requis).');
            }
        }
        return Promise.reject(error);
    }
);

export default API;