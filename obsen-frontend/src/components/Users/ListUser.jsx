import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import UserRoles from './UserRoles';
import CreateRole from './CreateRole';

export default function ListUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs :', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs & Rôles</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne Gauche : Tableau des utilisateurs */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 font-semibold text-gray-700">
            Liste des utilisateurs Keycloak
          </div>
          {loading ? (
            <div className="p-6 text-center text-gray-500">Chargement...</div>
          ) : (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                <tr>
                  <th className="px-6 py-3">Nom d'utilisateur</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{user.username}</td>
                    <td className="px-6 py-4">{user.email || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.enabled ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowRoleModal(true);
                        }}
                        className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded border border-blue-200 hover:bg-blue-100"
                      >
                        Gérer les rôles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Colonne Droite : Formulaire de création de Rôle */}
        <div>
          <CreateRole onRoleCreated={fetchUsers} />
        </div>
      </div>

      {/* Popin / Section d'attribution des rôles */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setShowRoleModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 font-bold"
            >
              ✕
            </button>
            <UserRoles user={selectedUser} />
          </div>
        </div>
      )}
    </div>
  );
}