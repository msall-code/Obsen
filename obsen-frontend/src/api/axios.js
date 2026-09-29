import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Autorise le navigateur à envoyer/recevoir les cookies de session et jetons
});

// Intercepteur pour intercepter les erreurs d'authentification
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;
            if (status === 401) {
                console.error("❌ Session non authentifiée ou expirée. Redirection vers la connexion...");
            } else if (status === 403) {
                console.error("❌ Accès interdit : Vous n'avez pas le rôle requis (ADMIN).");
            }
        }
        return Promise.reject(error);
    }
);

export default API;