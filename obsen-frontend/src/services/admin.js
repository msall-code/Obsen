import api from '../api/axios';

export const getUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const getRoles = async () => {
  const response = await api.get('/admin/roles');
  return response.data;
};