import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/admin';

// Configuration de l'instance Axios avec intercepteur pour injecter le token Keycloak
const adminApi = axios.create({
  baseURL: API_BASE_URL,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // ou via votre context Keycloak
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getUsers = () => adminApi.get('/users');
export const updateUser = (userId, userData) => adminApi.put(`/users/${userId}`, userData);
export const toggleUserStatus = (userId, enabled) => adminApi.put(`/users/${userId}/status?enabled=${enabled}`);
export const deleteUser = (userId) => adminApi.delete(`/users/${userId}`);
export const resetUserPassword = (userId, newPassword) => adminApi.put(`/users/${userId}/password`, newPassword, {
  headers: { 'Content-Type': 'text/plain' }
});

export const getRoles = () => adminApi.get('/roles');
export const createRole = (roleData) => adminApi.post('/roles', roleData);
export const assignRoleToUser = (userId, roleName) => adminApi.post(`/users/${userId}/roles/${roleName}`);

export default adminApi;