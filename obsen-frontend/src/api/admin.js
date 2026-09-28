import API from './axios'; // Ajustez l'import selon la configuration de votre instance axios

// --- GESTION DES UTILISATEURS ---

export const getUsersApi = async () => {
  return await API.get('/admin/users');
};

export const updateUserApi = async (userId, updatedData) => {
  return await API.put(`/admin/users/${userId}`, updatedData);
};

export const toggleUserStatusApi = async (userId, enabled) => {
  return await API.patch(`/admin/users/${userId}/status`, { enabled });
};

export const deleteUserApi = async (userId) => {
  return await API.delete(`/admin/users/${userId}`);
};

export const resetUserPasswordApi = async (userId, newPassword) => {
  return await API.post(`/admin/users/${userId}/reset-password`, { password: newPassword });
};

// --- GESTION DES RÔLES ---

export const getRolesApi = async () => {
  return await API.get('/admin/roles');
};

export const createRoleApi = async (roleData) => {
  return await API.post('/admin/roles', roleData);
};

export const assignRoleToUserApi = async (userId, roleName) => {
  return await API.put(`/admin/users/${userId}/role`, { role: roleName });
};