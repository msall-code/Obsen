import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/admin';

// Helper pour récupérer le header d'authentification
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // ou la clé sous laquelle vous stockez le JWT
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getUsers = async () => {
  // Ajout du 2ème argument contenant les headers
  const response = await axios.get(`${API_URL}/users`, getAuthHeaders());
  return response.data;
};

export const getRoles = async () => {
  // Ajout du 2ème argument contenant les headers
  const response = await axios.get(`${API_URL}/roles`, getAuthHeaders());
  return response.data;
};