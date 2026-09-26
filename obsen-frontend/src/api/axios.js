import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
});

// Intercepteur pour injecter automatiquement le token JWT
api.interceptors.request.use(
    (config) => {
        // Remplacez 'token' par la clé exacte sous laquelle vous enregistrez le JWT
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;