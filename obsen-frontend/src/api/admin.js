import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/admin';

const adminApi = axios.create({
  baseURL: API_BASE_URL,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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