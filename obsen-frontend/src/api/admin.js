import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

// Injection automatique du token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // ou via AuthContext
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
export const assignRoleToUserApi = async (userId, role) => {
  // Remplacez '/admin/users/' et la structure par ce qu'attend votre backend
  return await api.put(`/admin/users/${userId}/role`, { role });
};