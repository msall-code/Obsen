// src/services/authService.js
import axiosClient from '../api/axiosClient';

export const loginUser = async (credentials) => {
  try {
    const response = await axiosClient.post('/auth/login', credentials);
    
    if (response.data?.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    return response.data;
  } catch (error) {
    const errorMessage = 
      error.response?.data?.error_description || 
      error.response?.data?.message || 
      'Identifiants invalides ou serveur indisponible';
      
    throw new Error(errorMessage);
  }
};

// --- AJOUTEZ OU CORRIGEZ CET EXPORT ---
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('tenant_id');
  window.location.href = '/auth/login';
};