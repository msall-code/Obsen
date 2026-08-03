// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/auth';

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user || {}));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Identifiants invalides ou serveur indisponible.";
  }
};