import React, { useState, useEffect } from 'react';
import {
  getUsersApi, createUserApi, toggleUserStatusApi,
  resetUserPasswordApi, deleteUserApi, createRoleApi,
  getRolesApi, deleteRoleApi, assignRoleToUserApi, updateUserApi
} from '../api/admin';
import { 
  UserPlus, Shield, KeyRound, UserX, UserCheck, Trash2, 
  RefreshCw, UserCog, Edit3, PlusCircle, Lock
} from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Onglets d'action
  const [activeTab, setActiveTab] = useState('user'); // 'user' | 'role' | 'assign'

  // Formulaires
  const [newUser, setNewUser] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    firstName: '', 
    lastName: '' 
  });
  const [newRole, setNewRole] = useState({ name: '', description: '' });
  const [selectedUserForReset, setSelectedUserForReset] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  // Modale d'édition
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [editUserData, setEditUserData] = useState({ firstName: '', lastName: '', email: '' });

  // Attribution de rôle
  const [selectedUserForRole, setSelectedUserForRole] = useState('');
  const [selectedRoleToAssign, setSelectedRoleToAssign] = useState('');

  // Vérification si un rôle est un rôle système Keycloak par défaut
  const isSystemRole = (roleName) => {
    if (!roleName) return false;
    const systemRoles = ['offline_access', 'uma_authorization'];
    return systemRoles.includes(roleName) || roleName.startsWith('default-roles-');
  };

  // Formate la description pour masquer les clés d'internationalisation Keycloak (${role_...})
  const formatRoleDescription = (role) => {
    if (!role.description || role.description.startsWith('${')) {
      if (role.name.startsWith('default-roles-')) return 'Rôle composite attribué par défaut aux nouveaux utilisateurs';
      if (role.name === 'offline_access') return 'Accès hors-ligne (tokens persistants)';
      if (role.name === 'uma_authorization') return 'Gestion des autorisations fines (UMA)';
      return 'Rôle système';
    }
    return role.description;
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [resUsers, resRoles] = await Promise.all([
        getUsersApi(),
        getRolesApi()
      ]);
      setUsers(resUsers.data || []);
      setRoles(resRoles.data || []);
      setError(null);
    } catch (err) {
      console.error("Erreur de chargement des données :", err);
      setError("Impossible de charger les données administrateur.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    void loadData(); 
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        credentials: newUser.password ? [{
          type: 'password',
          value: newUser.password,
          temporary: false
        }] : []
      };

      await createUserApi(payload);
      setNewUser({ username: '', email: '', password: '', firstName: '', lastName: '' });
      await loadData();
    } catch (err) {
      console.error("Erreur lors de la création d'utilisateur :", err);
      alert("Erreur lors de la création de l'utilisateur.");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await updateUserApi(selectedUserForEdit.id, editUserData);
      setSelectedUserForEdit(null);
      await loadData();
    } catch (err) {
      console.error("Erreur lors de la modification de l'utilisateur :", err);
      alert("Erreur lors de la mise à jour des informations.");
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    try {
      await createRoleApi(newRole);
      setNewRole({ name: '', description: '' });
      await loadData();
    } catch (err) {
      console.error("Erreur lors de la création du rôle :", err);
      alert("Erreur lors de la création du rôle.");
    }
  };

  const handleDeleteRole = async (roleName) => {
    if (isSystemRole(roleName)) {
      alert("Ce rôle est un rôle système Keycloak essentiel et ne peut pas être supprimé.");
      return;
    }

    if (window.confirm(`Voulez-vous vraiment supprimer le rôle "${roleName}" ?`)) {
      try {
        await deleteRoleApi(roleName);
        await loadData();
      } catch (err) {
        console.error("Erreur lors de la suppression du rôle :", err);
        alert("Erreur lors de la suppression du rôle.");
      }
    }
  };

  const handleAssignRole = async (e) => {
    e.preventDefault();
    if (!selectedUserForRole || !selectedRoleToAssign) {
      alert("Veuillez sélectionner un utilisateur et un rôle.");
      return;
    }
    try {
      await assignRoleToUserApi(selectedUserForRole, selectedRoleToAssign);
      alert("Rôle attribué avec succès !");
      setSelectedUserForRole('');
      setSelectedRoleToAssign('');
      await loadData();
    } catch (err) {
      console.error("Erreur lors de l'attribution du rôle :", err);
      alert("Erreur lors de l'attribution du rôle.");
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await toggleUserStatusApi(userId, !currentStatus);
      await loadData();
    } catch (err) {
      console.error("Erreur lors du changement de statut :", err);
      alert("Erreur de modification du statut.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await resetUserPasswordApi(selectedUserForReset.id, newPassword);
      setSelectedUserForReset(null);
      setNewPassword('');
      alert("Mot de passe réinitialisé avec succès.");
    } catch (err) {
      console.error("Erreur lors de la réinitialisation du mot de passe :", err);
      alert("Échec de réinitialisation du mot de passe.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Supprimer définitivement cet utilisateur ?")) {
      try {
        await deleteUserApi(userId);
        await loadData();
      } catch (err) {
        console.error("Erreur lors de la suppression de l'utilisateur :", err);
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const openEditModal = (user) => {
    setSelectedUserForEdit(user);
    setEditUserData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || ''
    });
  };

  if (loading) {
    return (
      <div className="text-center p-8 text-slate-400 flex items-center justify-center space-x-2">
        <RefreshCw className="animate-spin" />
        <span>Chargement de la console Admin...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl">{error}</div>}

      {/* TABS DE CRÉATION / ACTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex border-b border-slate-800 pb-4 mb-6 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('user')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'user' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Nouvel Utilisateur</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('role')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'role' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Nouveau Rôle</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('assign')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'assign' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <UserCog className="w-4 h-4" />
            <span>Affecter Rôle</span>
          </button>
        </div>

        {/* TAB 1: CRÉER UTILISATEUR */}
        {activeTab === 'user' && (
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text" placeholder="Nom d'utilisateur *" required
              value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <input
              type="email" placeholder="Email *" required
              value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <input
              type="password" placeholder="Mot de passe initial *" required
              value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text" placeholder="Prénom"
              value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text" placeholder="Nom"
              value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <button type="submit" className="sm:col-span-2 lg:col-span-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold p-3 rounded-xl transition flex items-center justify-center space-x-2">
              <PlusCircle className="w-4 h-4" />
              <span>Créer l'Utilisateur</span>
            </button>
          </form>
        )}

        {/* TAB 2: CRÉER RÔLE */}
        {activeTab === 'role' && (
          <form onSubmit={handleCreateRole} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text" placeholder="Nom du rôle (ex: ADMIN) *" required
              value={newRole.name} onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text" placeholder="Description"
              value={newRole.description} onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <button type="submit" className="sm:col-span-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold p-3 rounded-xl transition">
              Enregistrer le Rôle
            </button>
          </form>
        )}

        {/* TAB 3: ATTRIBUER UN RÔLE */}
        {activeTab === 'assign' && (
          <form onSubmit={handleAssignRole} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              value={selectedUserForRole}
              onChange={(e) => setSelectedUserForRole(e.target.value)}
              required
              className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">-- Sélectionner un utilisateur --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.username} ({u.email || u.id})</option>
              ))}
            </select>

            <select
              value={selectedRoleToAssign}
              onChange={(e) => setSelectedRoleToAssign(e.target.value)}
              required
              className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">-- Sélectionner un rôle --</option>
              {roles.map((r) => (
                <option key={r.name || r.id} value={r.name}>
                  {r.name} {isSystemRole(r.name) ? '(Système)' : ''}
                </option>
              ))}
            </select>

            <button type="submit" className="sm:col-span-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold p-3 rounded-xl transition">
              Attribuer le Rôle
            </button>
          </form>
        )}
      </div>

      {/* RÔLES ET LISTE DES UTILISATEURS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LISTE DES RÔLES */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="text-emerald-400 w-5 h-5" />
            <h2 className="text-base font-bold text-white">Rôles ({roles.length})</h2>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {roles.map((r) => {
              const sysRole = isSystemRole(r.name);
              const desc = formatRoleDescription(r);

              return (
                <div key={r.name || r.id} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="pr-2 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-emerald-400 text-sm truncate">{r.name}</span>
                      {sysRole && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          Système
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 break-words mt-0.5">{desc}</p>
                  </div>

                  {sysRole ? (
                    <button
                      type="button"
                      disabled
                      title="Les rôles système Keycloak ne peuvent pas être supprimés"
                      className="p-1.5 text-slate-600 bg-slate-900/50 rounded-lg cursor-not-allowed shrink-0"
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { void handleDeleteRole(r.name); }}
                      title="Supprimer ce rôle"
                      className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* LISTE DES UTILISATEURS */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Utilisateurs ({users.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase border-b border-slate-800">
                  <th className="p-4">Utilisateur</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30">
                    <td className="p-4 font-medium text-white">
                      {u.username}
                      <div className="text-xs text-slate-500">{u.firstName} {u.lastName}</div>
                    </td>
                    <td className="p-4 text-slate-300">{u.email || '-'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${u.enabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {u.enabled ? <UserCheck className="w-3.5 h-3.5 mr-1" /> : <UserX className="w-3.5 h-3.5 mr-1" />}
                        {u.enabled ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(u)}
                        title="Éditer l'utilisateur"
                        className="p-2 text-slate-400 hover:text-emerald-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => { void handleToggleStatus(u.id, u.enabled); }}
                        title={u.enabled ? "Désactiver" : "Activer"}
                        className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                      >
                        {u.enabled ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedUserForReset(u)}
                        title="Changer le mot de passe"
                        className="p-2 text-slate-400 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => { void handleDeleteUser(u.id); }}
                        title="Supprimer"
                        className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODALE ÉDITION DE L'UTILISATEUR */}
      {selectedUserForEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-white">Modifier l'utilisateur</h3>
            <p className="text-xs text-slate-400">Édition des informations de <span className="text-emerald-400 font-mono">{selectedUserForEdit.username}</span></p>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label htmlFor="edit-first-name" className="block text-xs font-semibold text-slate-400 mb-1">Prénom</label>
                <input
                  id="edit-first-name"
                  type="text"
                  value={editUserData.firstName}
                  onChange={(e) => setEditUserData({ ...editUserData, firstName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="edit-last-name" className="block text-xs font-semibold text-slate-400 mb-1">Nom</label>
                <input
                  id="edit-last-name"
                  type="text"
                  value={editUserData.lastName}
                  onChange={(e) => setEditUserData({ ...editUserData, lastName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="edit-email" className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
                <input
                  id="edit-email"
                  type="email"
                  value={editUserData.email}
                  onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button" onClick={() => setSelectedUserForEdit(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE RÉINITIALISATION DE MOT DE PASSE */}
      {selectedUserForReset && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-white">Réinitialiser le mot de passe</h3>
            <p className="text-xs text-slate-400">Changement de mot de passe pour <span className="text-emerald-400 font-mono">{selectedUserForReset.username}</span></p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="password" placeholder="Nouveau mot de passe" required
                value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button" onClick={() => setSelectedUserForReset(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl"
                >
                  Valider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}