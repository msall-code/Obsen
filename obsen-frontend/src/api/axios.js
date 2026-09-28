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
        // Adaptez 'token' selon la clé utilisée lors du localStorage.setItem('token', ...)
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur pour intercepter les erreurs 403 / 401
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.error("Accès refusé ou session expirée. Vérifiez vos rôles ou reconnectez-vous.");
        }
        return Promise.reject(error);
    }
);

export default API;