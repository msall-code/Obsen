import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/admin';

const adminApi = axios.create({
    baseURL: API_BASE_URL,
});

// Intercepteur de requête : injecte le jeton JWT
adminApi.interceptors.request.use(
    (config) => {
        // Vérifiez le nom exact de votre clé dans localStorage ('token', 'jwt', ou 'accessToken')
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn('Aucun jeton JWT trouvé dans le localStorage !');
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur de réponse : gère la déconnexion automatique sur 401
adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Session expirée ou non autorisée. Redirection vers la connexion...');
            localStorage.removeItem('token');
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const getUsersApi = () => adminApi.get('/users');
export const updateUserApi = (userId, userData) => adminApi.put(`/users/${userId}`, userData);
export const toggleUserStatusApi = (userId, enabled) => adminApi.put(`/users/${userId}/status?enabled=${enabled}`);
export const deleteUserApi = (userId) => adminApi.delete(`/users/${userId}`);
export const resetUserPasswordApi = (userId, newPassword) =>
    adminApi.put(`/users/${userId}/password`, newPassword, {
        headers: { 'Content-Type': 'text/plain' },
    });

export const getRolesApi = () => adminApi.get('/roles');
export const createRoleApi = (roleData) => adminApi.post('/roles', roleData);
export const assignRoleToUserApi = (userId, roleName) =>
    adminApi.post(`/users/${userId}/roles/${roleName}`);

export default adminApi;