import axiosClient from '../../../api/axiosInstance'; // Correction du chemin relatif
import type { UserProfile } from '../types';

export const getMyProfile = async (): Promise<UserProfile> => {
    const response = await axiosClient.get<UserProfile>('/identity/me');
    return response.data;
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
    const response = await axiosClient.get<UserProfile[]>('/identity/users');
    return response.data;
};

export const deleteUserById = async (keycloakId: string): Promise<void> => {
    await axiosClient.delete(`/identity/${keycloakId}`);
};
export interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
}

// Récupérer les statistiques globales pour le Dashboard
export const getDashboardStats = async (): Promise<DashboardStats> => {
    const response = await axiosClient.get<DashboardStats>('/identity/stats');
    return response.data;
};
// Récupérer les rôles d'un utilisateur spécifique
export const getUserRoles = async (keycloakId: string): Promise<string[]> => {
    const response = await axiosClient.get<string[]>(`/identity/${keycloakId}/roles`);
    return response.data;
};

// Mettre à jour les rôles d'un utilisateur (ex: assigner ou retirer le rôle ADMIN)
export const updateUserRoles = async (keycloakId: string, roles: string[]): Promise<void> => {
    await axiosClient.put(`/identity/${keycloakId}/roles`, { roles });
};