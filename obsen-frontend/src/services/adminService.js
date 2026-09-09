import axiosClient from '../api/axiosClient';

// URL de l'API d'administration du Realm Keycloak
const KEYCLOAK_ADMIN_URL = 'http://localhost:7089/auth/admin/realms/Obsen-Realm';

export const adminService = {
    // Récupérer la liste de tous les utilisateurs Keycloak
    getUsers: async () => {
        const response = await axiosClient.get(`${KEYCLOAK_ADMIN_URL}/users`);
        return response.data;
    },

    // Récupérer tous les rôles du Realm
    getRealmRoles: async () => {
        const response = await axiosClient.get(`${KEYCLOAK_ADMIN_URL}/roles`);
        return response.data;
    },

    // Créer un nouveau rôle dans le Realm
    createRole: async (roleName, description = '') => {
        const response = await axiosClient.post(`${KEYCLOAK_ADMIN_URL}/roles`, {
            name: roleName,
            description: description,
        });
        return response.data;
    },

    // Récupérer les rôles actuellement attribués à un utilisateur
    getUserRoles: async (userId) => {
        const response = await axiosClient.get(`${KEYCLOAK_ADMIN_URL}/users/${userId}/role-mappings/realm`);
        return response.data;
    },

    // Attribuer un ou plusieurs rôles à un utilisateur
    assignRoleToUser: async (userId, rolesArray) => {
        // rolesArray doit être un tableau d'objets : [{ id: '...', name: '...' }]
        const response = await axiosClient.post(
            `${KEYCLOAK_ADMIN_URL}/users/${userId}/role-mappings/realm`,
            rolesArray
        );
        return response.data;
    },

    // Retirer un rôle à un utilisateur
    removeRoleFromUser: async (userId, rolesArray) => {
        const response = await axiosClient.delete(
            `${KEYCLOAK_ADMIN_URL}/users/${userId}/role-mappings/realm`,
            { data: rolesArray }
        );
        return response.data;
    }
};