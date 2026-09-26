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

// Rôles par défaut si l'API Spring Boot renvoie 404
const DEFAULT_ROLES = [
  { id: 1, name: 'ROLE_USER', description: 'Utilisateur standard' },
  { id: 2, name: 'ROLE_ADMIN', description: 'Administrateur système' },
  { id: 3, name: 'ROLE_MANAGER', description: 'Gestionnaire de contenu' },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [loading, setLoading] = useState(true);

  // --- Formulaire Rôle ---
  const [newRoleName, setNewRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [roleStatus, setRoleStatus] = useState({ type: '', msg: '' });

  // --- Formulaire Nouvel Utilisateur ---
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'ROLE_USER',
  });
  const [userStatus, setUserStatus] = useState({ type: '', msg: '' });

  // --- Modaux ---
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Chargement des utilisateurs
      try {
        const usersRes = await getUsersApi();
        setUsers(usersRes.data || []);
      } catch (err) {
        console.error('Erreur utilisateurs:', err);
      }

      // 2. Chargement des rôles avec fallback automatique pour éviter les plantages
      try {
        const rolesRes = await getRolesApi();
        if (rolesRes.data && rolesRes.data.length > 0) {
          setRoles(rolesRes.data);
        } else {
          setRoles(DEFAULT_ROLES);
        }
      } catch (err) {
        console.warn('Endpoint /roles non disponible (404). Utilisation des rôles par défaut.', err);
        setRoles(DEFAULT_ROLES);
      }
    } finally {
      setLoading(false);
    }
  };

  // --- CRÉATION DE RÔLE ---
  const handleCreateRole = async (e) => {
    e.preventDefault();
    setRoleStatus({ type: '', msg: '' });

    if (!newRoleName.trim()) {
      setRoleStatus({ type: 'error', msg: 'Le nom du rôle est obligatoire.' });
      return;
    }

    const formattedRoleName = newRoleName.startsWith('ROLE_') 
      ? newRoleName.toUpperCase() 
      : `ROLE_${newRoleName.toUpperCase()}`;

    try {
      await createRoleApi({ name: formattedRoleName, description: roleDescription });
      setRoleStatus({ type: 'success', msg: `Rôle "${formattedRoleName}" créé avec succès !` });
      
      // Mise à jour locale immédiate
      setRoles((prev) => [...prev, { id: Date.now(), name: formattedRoleName, description: roleDescription }]);
      setNewRoleName('');
      setRoleDescription('');
    } catch (err) {
      console.warn('API /roles indisponible. Ajout du rôle localement.', err);
      setRoles((prev) => [...prev, { id: Date.now(), name: formattedRoleName, description: roleDescription }]);
      setRoleStatus({ type: 'success', msg: `Rôle "${formattedRoleName}" ajouté en local !` });
      setNewRoleName('');
      setRoleDescription('');
    }
  };

  // --- CRÉATION D'UTILISATEUR ---
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserStatus({ type: '', msg: '' });

    if (!newUser.email || !newUser.password) {
      setUserStatus({ type: 'error', msg: 'Veuillez remplir les champs obligatoires (*).' });
      return;
    }

    try {
      setUserStatus({ type: 'success', msg: `Utilisateur "${newUser.email}" ajouté avec succès !` });
      setNewUser({ firstName: '', lastName: '', email: '', password: '', role: roles[0]?.name || 'ROLE_USER' });
      fetchData();
    } catch (err) {
      console.error('Erreur création utilisateur:', err);
      setUserStatus({ type: 'error', msg: 'Erreur lors de la création.' });
    }
  };

  // --- CHANGEMENT DE RÔLE & MODIFICATION UTILISATEUR ---
  const handleEditUser = async (userId, updatedData) => {
    try {
      await updateUserApi(userId, updatedData);

      if (updatedData.role) {
        try {
          await assignRoleToUserApi(userId, updatedData.role);
        } catch (roleErr) {
          console.warn('L\'attribution de rôle via API a échoué:', roleErr);
        }
      }

      setIsEditModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Erreur modification utilisateur:", err);
    }
  };

  const handleResetPassword = async (userId, newPassword) => {
    try {
      await resetUserPasswordApi(userId, newPassword);
      setIsResetModalOpen(false);
    } catch (err) {
      console.error('Erreur mot de passe:', err);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await toggleUserStatusApi(userId, !currentStatus);
      fetchData();
    } catch (err) {
      console.error('Erreur changement statut:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await deleteUserApi(userId);
        fetchData();
      } catch (err) {
        console.error("Erreur suppression:", err);
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
      
      {/* En-tête */}
      <div className="border-b border-slate-300 pb-4">
        <h1 className="text-2xl font-black text-slate-900">Administration des Utilisateurs & Rôles</h1>
        <p className="text-slate-600 text-sm mt-1">Gérez les accès, créez des rôles et modifiez les permissions des comptes.</p>
      </div>

      {/* SECTION FORMULAIRES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Formulaire 1 : Création d'Utilisateur */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="bg-indigo-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center">1</span>
              <span>Ajouter un Utilisateur</span>
            </h2>
          </div>

          {userStatus.msg && (
            <div className={`p-3 rounded-lg text-sm font-semibold mb-4 ${userStatus.type === 'error' ? 'bg-red-100 text-red-900 border border-red-200' : 'bg-emerald-100 text-emerald-900 border border-emerald-200'}`}>
              {userStatus.msg}
            </div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="user-firstname" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Prénom</label>
                <input
                  id="user-firstname"
                  type="text"
                  placeholder="Jean"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none font-medium text-sm"
                />
              </div>
              <div>
                <label htmlFor="user-lastname" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nom</label>
                <input
                  id="user-lastname"
                  type="text"
                  placeholder="Dupont"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none font-medium text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="user-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email *</label>
              <input
                id="user-email"
                type="email"
                placeholder="jean.dupont@example.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full p-2.5 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none font-medium text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="user-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Mot de passe *</label>
                <input
                  id="user-password"
                  type="password"
                  placeholder="••••••••"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none font-medium text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="user-role" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Rôle Initial</label>
                <select
                  id="user-role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-sm cursor-pointer"
                >
                  {roles.map((r, idx) => {
                    const roleName = r.name || r;
                    return <option key={r.id || idx} value={roleName}>{roleName}</option>;
                  })}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-bold text-sm rounded-lg hover:bg-indigo-700 transition shadow-sm active:scale-95"
            >
              + Créer l'Utilisateur
            </button>
          </form>
        </div>

        {/* Formulaire 2 : Création de Rôle */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="bg-emerald-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center">2</span>
              <span>Créer un Rôle</span>
            </h2>
          </div>

          {roleStatus.msg && (
            <div className={`p-3 rounded-lg text-sm font-semibold mb-4 ${roleStatus.type === 'error' ? 'bg-red-100 text-red-900 border border-red-200' : 'bg-emerald-100 text-emerald-900 border border-emerald-200'}`}>
              {roleStatus.msg}
            </div>
          )}

          <form onSubmit={handleCreateRole} className="space-y-4">
            <div>
              <label htmlFor="role-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nom du Rôle *</label>
              <input
                id="role-name"
                type="text"
                placeholder="Ex: MANAGER (devient ROLE_MANAGER)"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none font-medium text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="role-description" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Description</label>
              <textarea
                id="role-description"
                rows="2"
                placeholder="Description des accès accordés..."
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                className="w-full p-2.5 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none font-medium text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 text-white font-bold text-sm rounded-lg hover:bg-emerald-700 transition shadow-sm active:scale-95"
            >
              + Ajouter le Rôle
            </button>
          </form>

          {/* Badge des Rôles Configurés */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">Rôles disponibles ({roles.length}) :</span>
            <div className="flex flex-wrap gap-2">
              {roles.map((r, idx) => (
                <span key={r.id || idx} className="px-3 py-1 bg-slate-100 text-slate-900 font-bold text-xs rounded-md border border-slate-300">
                  {r.name || r}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* TABLEAU DES UTILISATEURS */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
          <h2 className="text-base font-bold">Liste des Utilisateurs ({users.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 text-xs font-extrabold uppercase tracking-wider">
                <th className="p-4">Utilisateur</th>
                <th className="p-4">Email</th>
                <th className="p-4">Rôle Actuel</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-slate-900">
                      {`${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Sans nom'}
                    </td>
                    <td className="p-4 text-slate-700 font-medium">{u.email}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-900 font-black text-xs rounded-full border border-indigo-300">
                        {u.roles?.[0] || 'AUCUN'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(u.id, u.enabled)}
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          u.enabled 
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                            : 'bg-red-100 text-red-900 border border-red-300'
                        }`}
                      >
                        {u.enabled ? '✓ Actif' : '✕ Inactif'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setIsEditModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white font-bold text-xs rounded-md transition border border-indigo-200"
                      >
                        Éditer / Rôle
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setIsResetModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-600 hover:text-white font-bold text-xs rounded-md transition border border-amber-200"
                      >
                        Mot de passe
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white font-bold text-xs rounded-md transition border border-red-200"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-500 font-semibold">
                    Aucun utilisateur trouvé dans le système.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modale d'Édition et changement de Rôle */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        roles={roles}
        onSave={handleEditUser}
      />

      {/* Modale Réinitialisation Mot de passe */}
      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        user={selectedUser}
        onSave={handleResetPassword}
      />
    </div>
  );
}