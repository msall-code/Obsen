import API from './axios';

// --- OBSERVATIONS ---

// Récupérer toutes les observations
export const getObservationsApi = () => API.get('/observations');

// Récupérer une observation par son ID
export const getObservationByIdApi = (id) => API.get(`/observations/${id}`);

// Créer une nouvelle observation
export const createObservationApi = (observationData) => API.post('/observations', observationData);

// Mettre à jour une observation existante
export const updateObservationApi = (id, updatedData) => API.put(`/observations/${id}`, updatedData);

// Changer le statut d'une observation (ex: VALIDEE, REJETEE, EN_ATTENTE)
export const updateObservationStatusApi = (id, status) => API.patch(`/observations/${id}/status`, { status });

// Supprimer une observation
export const deleteObservationApi = (id) => API.delete(`/observations/${id}`);