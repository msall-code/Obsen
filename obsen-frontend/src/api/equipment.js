import API from './axios';

/**
 * Récupère la liste complète de l'inventaire des équipements.
 * @param {Object} params - Filtres optionnels (ex: { category: 'COMPUTE', status: 'ACTIVE' })
 */
export const getAllEquipments = async (params = {}) => {
    const response = await API.get('/inventory/equipments', { params });
    return response.data;
};

/**
 * Récupère un équipement spécifique par son ID.
 * @param {string|number} id - Identifiant de l'équipement
 */
export const getEquipmentById = async (id) => {
    const response = await API.get(`/inventory/equipments/${id}`);
    return response.data;
};

/**
 * Crée un nouvel équipement dans l'inventaire.
 * @param {Object} equipmentData - Données saisies dans le formulaire d'initialisation
 */
export const createEquipment = async (equipmentData) => {
    const response = await API.post('/inventory/equipments', equipmentData);
    return response.data;
};

/**
 * Enregistre un lot d'équipements (initialisation d'un parc complet ou nœuds EVE-NG).
 * @param {Array} equipmentList - Liste d'équipements à créer
 */
export const batchCreateEquipments = async (equipmentList) => {
    const response = await API.post('/inventory/equipments/batch', equipmentList);
    return response.data;
};

/**
 * Met à jour un équipement existant.
 * @param {string|number} id - Identifiant de l'équipement
 * @param {Object} equipmentData - Nouvelles données de l'équipement
 */
export const updateEquipment = async (id, equipmentData) => {
    const response = await API.put(`/inventory/equipments/${id}`, equipmentData);
    return response.data;
};

/**
 * Supprime un équipement de l'inventaire.
 * @param {string|number} id - Identifiant de l'équipement
 */
export const deleteEquipment = async (id) => {
    const response = await API.delete(`/inventory/equipments/${id}`);
    return response.data;
};