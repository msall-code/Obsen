import React, { useState, useEffect } from 'react';
import {
  getUsersApi, createUserApi, toggleUserStatusApi,
  resetUserPasswordApi, deleteUserApi, createRoleApi,
  getRolesApi, deleteRoleApi, assignRoleToUserApi
} from '../api/admin';
import { UserPlus, Shield, KeyRound, UserX, UserCheck, Trash2, RefreshCw, UserCog } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Formulaires
  const [newUser, setNewUser] = useState({ username: '', email: '', firstName: '', lastName: '' });
  const [newRole, setNewRole] = useState({ name: '', description: '' });
  const [selectedUserForReset, setSelectedUserForReset] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  // Attribution de rôle
  const [selectedUserForRole, setSelectedUserForRole] = useState('');
  const [selectedRoleToAssign, setSelectedRoleToAssign] = useState('');

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

  useEffect(() => { loadData(); }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUserApi(newUser);
      setNewUser({ username: '', email: '', firstName: '', lastName: '' });
      loadData();
    } catch (err) {
      console.error("Erreur lors de la création d'utilisateur :", err);
      alert("Erreur lors de la création de l'utilisateur.");
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    try {
      await createRoleApi(newRole);
      setNewRole({ name: '', description: '' });
      loadData();
    } catch (err) {
      console.error("Erreur lors de la création du rôle :", err);
      alert("Erreur lors de la création du rôle.");
    }
  };

  const handleDeleteRole = async (roleName) => {
    if (window.confirm(`Voulez-vous vraiment supprimer le rôle "${roleName}" ?`)) {
      try {
        await deleteRoleApi(roleName);
        loadData();
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
      loadData();
    } catch (err) {
      console.error("Erreur lors de l'attribution du rôle :", err);
      alert("Erreur lors de l'attribution du rôle.");
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await toggleUserStatusApi(userId, !currentStatus);
      loadData();
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
        loadData();
      } catch (err) {
        console.error("Erreur lors de la suppression de l'utilisateur :", err);
        alert("Erreur lors de la suppression.");
      }
    }
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

      {/* SECTION FORMULAIRES DE CRÉATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Création Utilisateur */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <UserPlus className="text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Créer un Nouvel Utilisateur</h2>
          </div>
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              type="text" placeholder="Prénom"
              value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text" placeholder="Nom"
              value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <button type="submit" className="sm:col-span-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold p-3 rounded-xl transition">
              Ajouter l'Utilisateur
            </button>
          </form>
        </div>

        {/* Création de Rôle */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Nouveau Rôle</h2>
          </div>
          <form onSubmit={handleCreateRole} className="space-y-4">
            <input
              type="text" placeholder="Nom du rôle (ex: ADMIN)" required
              value={newRole.name} onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text" placeholder="Description"
              value={newRole.description} onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold p-3 rounded-xl border border-slate-700 transition">
              Créer Rôle
            </button>
          </form>
        </div>
      </div>

      {/* SECTION ADMINISTRATION DES RÔLES ET ATTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attribuer un rôle à un utilisateur */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <UserCog className="text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Attribuer un Rôle</h2>
          </div>
          <form onSubmit={handleAssignRole} className="space-y-4">
            <div>
              <label htmlFor="user-select" className="block text-xs font-semibold text-slate-400 mb-1">
                Sélectionner l'Utilisateur
              </label>
              <select
                id="user-select"
                value={selectedUserForRole}
                onChange={(e) => setSelectedUserForRole(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Sélectionner un utilisateur --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.username} ({u.email || u.id})</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="role-select" className="block text-xs font-semibold text-slate-400 mb-1">
                Sélectionner le Rôle
              </label>
              <select
                id="role-select"
                value={selectedRoleToAssign}
                onChange={(e) => setSelectedRoleToAssign(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Sélectionner un rôle --</option>
                {roles.map((r) => (
                  <option key={r.name || r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold p-3 rounded-xl transition">
              Affecter le Rôle
            </button>
          </form>
        </div>

        {/* Liste et suppression des Rôles Existants */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Shield className="text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Rôles Existants ({roles.length})</h2>
            </div>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {roles.length === 0 ? (
              <p className="text-slate-500 text-sm">Aucun rôle enregistré.</p>
            ) : (
              roles.map((r) => (
                <div key={r.name || r.id} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div>
                    <span className="font-semibold text-emerald-400 text-sm">{r.name}</span>
                    {r.description && <p className="text-xs text-slate-400 mt-0.5">{r.description}</p>}
                  </div>
                  <button
                    onClick={() => handleDeleteRole(r.name)}
                    title="Supprimer ce rôle"
                    className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* TABLEAU DES UTILISATEURS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white">Utilisateurs Enregistrés ({users.length})</h2>
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
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${u.enabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                      {u.enabled ? <UserCheck className="w-3.5 h-3.5 mr-1" /> : <UserX className="w-3.5 h-3.5 mr-1" />}
                      {u.enabled ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleStatus(u.id, u.enabled)}
                      title={u.enabled ? "Désactiver" : "Activer"}
                      className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                    >
                      {u.enabled ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setSelectedUserForReset(u)}
                      title="Changer le mot de passe"
                      className="p-2 text-slate-400 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
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

      {/* MODAL RÉINITIALISATION DE MOT DE PASSE */}
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