import api from './axios';

export const getUsersApi = () => api.get('/admin/users');
export const updateUserStatusApi = (id, enabled) => api.patch(`/admin/users/${id}/status`, { enabled });
export const assignRoleToUserApi = (id, roleName) => api.post(`/admin/users/${id}/roles/${roleName}`);
export const deleteUserApi = (id) => api.delete(`/admin/users/${id}`);