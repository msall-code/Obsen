import React, { useState, useEffect } from 'react';
import {
  getUsersApi,
  updateUserApi,
  toggleUserStatusApi,
  deleteUserApi,
  resetUserPasswordApi,
  getRolesApi,
  createRoleApi,
  assignRoleToUserApi,
} from '../api/admin';

import EditUserModal from '../components/admin/EditUserModal';
import ResetPasswordModal from '../components/admin/ResetPasswordModal';
import CreateRoleModal from '../components/admin/CreateRoleModal';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gestion des modaux
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, rolesRes] = await Promise.all([getUsersApi(), getRolesApi()]);
      setUsers(usersRes.data || []);
      setRoles(rolesRes.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
    } finally {
      setLoading(false);
    }
  };

  // Actions Utilisateurs
  const handleEditUser = async (userId, updatedData) => {
    try {
      await updateUserApi(userId, updatedData);
      if (updatedData.role) {
        await assignRoleToUserApi(userId, updatedData.role);
      }
      setIsEditModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", err);
    }
  };

  const handleResetPassword = async (userId, newPassword) => {
    try {
      await resetUserPasswordApi(userId, newPassword);
      setIsResetModalOpen(false);
    } catch (err) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', err);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await toggleUserStatusApi(userId, !currentStatus);
      fetchData();
    } catch (err) {
      console.error('Erreur de changement de statut:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      try {
        await deleteUserApi(userId);
        fetchData();
      } catch (err) {
        console.error("Erreur lors de la suppression de l'utilisateur:", err);
      }
    }
  };

  // Actions Rôles
  const handleCreateRole = async (roleData) => {
    try {
      await createRoleApi(roleData);
      setIsCreateRoleModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Erreur lors de la création du rôle:', err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Chargement des données...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs & Rôles</h1>
        <button
          onClick={() => setIsCreateRoleModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
        >
          + Nouveau Rôle
        </button>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-sm font-semibold text-gray-700">Nom complet</th>
              <th className="p-3 text-sm font-semibold text-gray-700">Email</th>
              <th className="p-3 text-sm font-semibold text-gray-700">Rôle</th>
              <th className="p-3 text-sm font-semibold text-gray-700">Statut</th>
              <th className="p-3 text-sm font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm font-medium text-gray-800">{`${u.firstName || ''} ${
                  u.lastName || ''
                }`}</td>
                <td className="p-3 text-sm text-gray-600">{u.email}</td>
                <td className="p-3 text-sm">
                  <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                    {u.roles?.[0] || 'AUCUN'}
                  </span>
                </td>
                <td className="p-3 text-sm">
                  <button
                    onClick={() => handleToggleStatus(u.id, u.enabled)}
                    className={`px-2 py-1 text-xs rounded font-medium ${
                      u.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {u.enabled ? 'Actif' : 'Inactif'}
                  </button>
                </td>
                <td className="p-3 text-sm text-right space-x-2">
                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setIsEditModalOpen(true);
                    }}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Éditer
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setIsResetModalOpen(true);
                    }}
                    className="text-yellow-600 hover:underline font-medium"
                  >
                    Mot de passe
                  </button>
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="text-red-600 hover:underline font-medium"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modaux */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        roles={roles}
        onSave={handleEditUser}
      />

      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        user={selectedUser}
        onSave={handleResetPassword}
      />

      <CreateRoleModal
        isOpen={isCreateRoleModalOpen}
        onClose={() => setIsCreateRoleModalOpen(false)}
        onSave={handleCreateRole}
      />
    </div>
  );
}