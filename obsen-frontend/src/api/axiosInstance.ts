import axios from 'axios';
import keycloak from '../config/keycloak';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
});

api.interceptors.request.use(
    async (config) => {
        if (keycloak.authenticated) {
            await keycloak.updateToken(30).catch(() => keycloak.login());
            config.headers.Authorization = `Bearer ${keycloak.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;