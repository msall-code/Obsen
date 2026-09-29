import API from './axios';

// --- UTILISATEURS ---
export const getUsersApi = () => API.get('/admin/users');

export const createUserApi = (userData) => API.post('/admin/users', userData);

export const updateUserApi = (userId, updatedData) => API.put(`/admin/users/${userId}`, updatedData);

// Envoi via Paramètre d'URL ( query parameter ?enabled=... )
export const toggleUserStatusApi = (userId, enabled) => API.put(`/admin/users/${userId}/status?enabled=${enabled}`);

export const deleteUserApi = (userId) => API.delete(`/admin/users/${userId}`);

export const resetUserPasswordApi = (userId, newPassword) => API.put(`/admin/users/${userId}/password`, { password: newPassword });

// --- RÔLES ---
export const getRolesApi = () => API.get('/admin/roles');

export const createRoleApi = (roleData) => API.post('/admin/roles', roleData);

export const deleteRoleApi = (roleName) => API.delete(`/admin/roles/${roleName}`);

export const assignRoleToUserApi = (userId, roleName) => API.post(`/admin/users/${userId}/roles/${roleName}`);