import axiosClient from '../../../api/axiosInstance';
import type { UserProfile, UserUpdatePayload } from '../types';

export interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
}

// Récupérer le profil de l'utilisateur connecté (/me)
export const getMyProfile = async (): Promise<UserProfile> => {
    const response = await axiosClient.get<UserProfile>('/identity/me');
    return response.data;
};

// Récupérer les statistiques globales
export const getDashboardStats = async (): Promise<DashboardStats> => {
    const users = await getAllUsers();
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.active).length;
    const inactiveUsers = totalUsers - activeUsers;

    return { totalUsers, activeUsers, inactiveUsers };
};

// Lister tous les utilisateurs
export const getAllUsers = async (): Promise<UserProfile[]> => {
    const response = await axiosClient.get<UserProfile[]>('/identity/users');
    return response.data;
};

// Activer / Bloquer un utilisateur
export const toggleUserStatus = async (keycloakId: string, enabled: boolean): Promise<void> => {
    await axiosClient.patch(`/identity/users/${keycloakId}/status`, null, {
        params: { enabled }
    });
};

// Éditer les informations d'un utilisateur
export const updateUser = async (keycloakId: string, data: UserUpdatePayload): Promise<void> => {
    await axiosClient.put(`/identity/users/${keycloakId}`, data);
};

// Modifier les rôles
export const updateUserRoles = async (keycloakId: string, roles: string[]): Promise<void> => {
    await axiosClient.put(`/identity/users/${keycloakId}/roles`, { roles });
};

// Supprimer un utilisateur
export const deleteUserById = async (keycloakId: string): Promise<void> => {
    await axiosClient.delete(`/identity/${keycloakId}`);
};