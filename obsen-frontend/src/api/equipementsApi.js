import axios from 'axios';
import { authService } from '../services/authService';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        config.headers['X-Tenant-ID'] = 'default-startup-tenant';

        // 🔑 Injection du jeton Bearer depuis localStorage
        const token = authService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;