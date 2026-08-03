// src/services/authService.js
import axiosClient from '../api/axiosClient';

export const loginUser = async (credentials) => {
  try {
    // Adapter le endpoint selon votre backend (ex: /auth/login ou /v1/auth/login)
    const response = await axiosClient.post('/auth/login', credentials);
    
    // Vérifiez la structure de votre retour Keycloak/Spring
    if (response.data?.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    return response.data;
  } catch (error) {
    // CRUCIAL : On renvoie un message lisible, PAS l'objet error brut
    const errorMessage = 
      error.response?.data?.error_description || 
      error.response?.data?.message || 
      'Identifiants invalides ou serveur indisponible';
      
    throw new Error(errorMessage);
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('tenant_id');
  window.location.href = '/auth/login';
};