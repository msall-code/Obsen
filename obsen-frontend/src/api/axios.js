import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour injecter automatiquement le Token JWT
API.interceptors.request.use(
    (config) => {
        // Récupère 'accessToken' (ou 'token' en secours)
        const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('✅ [Axios] Token JWT envoyé avec succès');
        } else {
            console.warn('⚠️ [Axios] Aucun Token trouvé dans le localStorage !');
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs d'authentification / rôles
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;
            if (status === 401) {
                console.error('❌ [401 Unauthorized] Le token est absent, invalide ou expiré.');
            } else if (status === 403) {
                console.error("❌ [403 Forbidden] Le token est valide mais l'utilisateur n'a pas les privilèges (ex: rôle ADMIN).");
            }
        }
        return Promise.reject(error);
    }
);

export default API;