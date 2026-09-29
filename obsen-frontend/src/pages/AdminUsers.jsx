import React, { useState, useEffect } from 'react';
import {
  getUsersApi,
  updateUserApi,
  toggleUserStatusApi,
  deleteUserApi,
  resetUserPasswordApi,
} from '../services/admin';

import EditUserModal from '../components/admin/EditUserModal';
import ResetPasswordModal from '../components/admin/ResetPasswordModal';

const DEFAULT_ROLES = [
  { id: 1, name: 'ROLE_USER', description: 'Utilisateur standard' },
  { id: 2, name: 'ROLE_ADMIN', description: 'Administrateur système' },
  { id: 3, name: 'ROLE_MANAGER', description: 'Gestionnaire de contenu' },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [loading, setLoading] = useState(true);

  const [newRoleName, setNewRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [roleStatus, setRoleStatus] = useState({ type: '', msg: '' });

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'ROLE_USER',
  });
  const [userStatus, setUserStatus] = useState({ type: '', msg: '' });

  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const usersRes = await getUsersApi();
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const formattedRoleName = newRoleName.startsWith('ROLE_')
      ? newRoleName.toUpperCase()
      : `ROLE_${newRoleName.toUpperCase()}`;

    setRoles((prev) => [...prev, { id: Date.now(), name: formattedRoleName, description: roleDescription }]);
    setRoleStatus({ type: 'success', msg: `Rôle "${formattedRoleName}" ajouté !` });
    setNewRoleName('');
    setRoleDescription('');
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.email || !newUser.password) return;

    try {
      setUserStatus({ type: 'success', msg: `Utilisateur "${newUser.email}" ajouté !` });
      setNewUser({ firstName: '', lastName: '', email: '', password: '', role: roles[0]?.name || 'ROLE_USER' });
      fetchData();
    } catch (err) {
      console.error('Erreur création utilisateur:', err);
    }
  };

  const handleEditUser = async (userId, updatedData) => {
    try {
      await updateUserApi(userId, updatedData);
      setIsEditModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Erreur modification utilisateur:', err);
    }
  };

  const handleResetPassword = async (userId, newPassword) => {
    try {
      await resetUserPasswordApi(userId, newPassword);
      setIsResetModalOpen(false);
    } catch (err) {
      console.error('Erreur réinitialisation mot de passe:', err);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await toggleUserStatusApi(userId, !currentStatus);
      fetchData();
    } catch (err) {
      console.error('Erreur statut:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await deleteUserApi(userId);
        fetchData();
      } catch (err) {
        console.error('Erreur suppression:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-slate-800 font-bold text-lg">Chargement de l'administration...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen text-slate-900">
      <div className="border-b border-slate-300 pb-4">
        <h1 className="text-2xl font-black text-slate-900">Administration des Utilisateurs & Rôles</h1>
        <p className="text-slate-600 text-sm mt-1">Gérez les accès et modifiez les permissions des comptes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ajouter Utilisateur */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Ajouter un Utilisateur</h2>
          {userStatus.msg && <div className="p-3 bg-emerald-100 text-emerald-900 rounded-lg text-sm mb-4">{userStatus.msg}</div>}
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Prénom"
                value={newUser.firstName}
                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                className="p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="Nom"
                value={newUser.lastName}
                onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                className="p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <input
              type="email"
              placeholder="Email *"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="password"
                placeholder="Mot de passe *"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                required
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold"
              >
                {roles.map((r, idx) => (
                  <option key={r.id || idx} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold text-sm rounded-lg hover:bg-indigo-700">
              + Créer l'Utilisateur
            </button>
          </form>
        </div>

        {/* Créer un Rôle */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Créer un Rôle (Local)</h2>
          {roleStatus.msg && <div className="p-3 bg-emerald-100 text-emerald-900 rounded-lg text-sm mb-4">{roleStatus.msg}</div>}
          <form onSubmit={handleCreateRole} className="space-y-4">
            <input
              type="text"
              placeholder="Ex: MANAGER (devient ROLE_MANAGER)"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
              required
            />
            <textarea
              rows="2"
              placeholder="Description des accès..."
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
            />
            <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold text-sm rounded-lg hover:bg-emerald-700">
              + Ajouter le Rôle
            </button>
          </form>
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
            {roles.map((r, idx) => (
              <span key={r.id || idx} className="px-3 py-1 bg-slate-100 text-slate-900 font-bold text-xs rounded-md border border-slate-300">
                {r.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-800 text-white font-bold">
          Liste des Utilisateurs ({users.length})
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 text-xs font-extrabold uppercase">
                <th className="p-4">Utilisateur</th>
                <th className="p-4">Email</th>
                <th className="p-4">Rôle</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold">{`${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Sans nom'}</td>
                    <td className="p-4 text-slate-700">{u.email}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-900 font-bold text-xs rounded-full">
                        {u.roles?.[0] || 'AUCUN'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(u.id, u.enabled)}
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          u.enabled ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'
                        }`}
                      >
                        {u.enabled ? '✓ Actif' : '✕ Inactif'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => { setSelectedUser(u); setIsEditModalOpen(true); }}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-md border border-indigo-200"
                      >
                        Éditer
                      </button>
                      <button
                        onClick={() => { setSelectedUser(u); setIsResetModalOpen(true); }}
                        className="px-3 py-1.5 bg-amber-50 text-amber-800 font-bold text-xs rounded-md border border-amber-200"
                      >
                        Mot de passe
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="px-3 py-1.5 bg-red-50 text-red-700 font-bold text-xs rounded-md border border-red-200"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-500 font-semibold">
                    Aucun utilisateur disponible.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
    </div>
  );
}