import axios from 'axios';

// Variable locale volatile en mémoire (effacée si on ferme l'onglet/navigateur)
let accessTokenInMemory = null;

export const setAccessToken = (token) => {
    accessTokenInMemory = token;
};

export const getAccessToken = () => accessTokenInMemory;

const API = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Autorise l'envoi et la réception de Cookies sécurisés
});

// Injection du jeton JWT uniquement s'il est présent dans la mémoire JS
API.interceptors.request.use(
    (config) => {
        if (accessTokenInMemory) {
            config.headers.Authorization = `Bearer ${accessTokenInMemory}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur global pour les erreurs de sécurité
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('[Sécurité] Session expirée ou jeton invalide. Nettoyage de la mémoire.');
            setAccessToken(null);
        }
        return Promise.reject(error);
    }
);

export default API;