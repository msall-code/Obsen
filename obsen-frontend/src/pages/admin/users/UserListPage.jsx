import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../../services/userService';
import CreateRoleModal from './CreateRoleModal';
import UserEditModal from './UserEditModal';

export default function UserListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userRolesMap, setUserRolesMap] = useState({});
  const [loading, setLoading] = useState(true);

  // État Modaux
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Édition directe des Rôles
  const [editingRoleName, setEditingRoleName] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedUsers, fetchedRoles] = await Promise.all([
        userService.getUsers(),
        userService.getAvailableRoles(),
      ]);

      setUsers(fetchedUsers);
      setRoles(fetchedRoles);

      const rolesMap = {};
      await Promise.all(
        fetchedUsers.map(async (u) => {
          try {
            const userRoles = await userService.getUserRoles(u.id);
            const currentRole = userRoles.find(
              (r) => !['default-roles-obsen-realm', 'offline_access', 'uma_authorization'].includes(r.name)
            );
            rolesMap[u.id] = currentRole || null;
          } catch (e) {
            console.error(`Erreur rôle pour ${u.id}:`, e);
          }
        })
      );
      setUserRolesMap(rolesMap);
    } catch (err) {
      alert(`Erreur de chargement: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchAll = async () => {
      if (isMounted) await loadData();
    };
    fetchAll();
    return () => { isMounted = false; };
  }, []);

  // --- HANDLERS UTILISATEURS ---
  const handleRoleChange = async (userId, newRoleId) => {
    const oldRole = userRolesMap[userId];
    const newRole = roles.find((r) => r.id === newRoleId);

    try {
      await userService.updateUserRole(userId, oldRole, newRole);
      setUserRolesMap((prev) => ({ ...prev, [userId]: newRole || null }));
    } catch (err) {
      alert(`Impossible de modifier le rôle: ${err.message}`);
    }
  };

  const handleSaveUserEdit = async (userId, updatedUserData, targetRole) => {
    try {
      if (userService.updateUser) {
        await userService.updateUser(userId, {
          username: updatedUserData.username,
          firstName: updatedUserData.firstName,
          lastName: updatedUserData.lastName,
          email: updatedUserData.email,
        });
      }

      const oldRole = userRolesMap[userId];
      if (targetRole?.id !== oldRole?.id) {
        await userService.updateUserRole(userId, oldRole, targetRole);
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...updatedUserData } : u))
      );
      setUserRolesMap((prev) => ({ ...prev, [userId]: targetRole || null }));
    } catch (err) {
      throw new Error(`Erreur lors de la mise à jour : ${err.message}`, { cause: err });
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await userService.toggleUserEnabled(userId, currentStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, enabled: !currentStatus } : u))
      );
    } catch (err) {
      alert(`Erreur changement de statut: ${err.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    try {
      await userService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      alert(`Erreur de suppression: ${err.message}`);
    }
  };

  // --- HANDLERS RÔLES ---
  const handleStartRename = (role) => {
    setEditingRoleName(role.name);
    setFormData({
      name: role.name,
      description: role.description || '',
    });
  };

  const handleSaveRename = async (role) => {
    if (!formData.name.trim()) {
      alert('Le nom du rôle ne peut pas être vide.');
      return;
    }

    try {
      await userService.updateRole(role.name, {
        id: role.id,
        name: formData.name.trim(),
        description: formData.description.trim(),
      });

      setEditingRoleName(null);
      await loadData();
    } catch (err) {
      alert(`Erreur lors de la modification du rôle: ${err.message}`);
    }
  };

  const handleDeleteRole = async (roleName) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer le rôle "${roleName}" ?`)) return;
    try {
      await userService.deleteRole(roleName);
      setRoles((prev) => prev.filter((r) => r.name !== roleName));
    } catch (err) {
      alert(`Erreur de suppression du rôle: ${err.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">⚙️ Gestion des Accès</h1>
          <p className="text-xs text-slate-500 mt-1">
            Gérez les utilisateurs du Realm Keycloak et attribuez leurs rôles.
          </p>
        </div>

        {activeTab === 'users' ? (
          <button
            onClick={() => navigate('/admin/users/create')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md transition flex items-center gap-2"
          >
            <span>➕</span> Créer un Utilisateur
          </button>
        ) : (
          <button
            onClick={() => setIsCreateRoleOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md transition flex items-center gap-2"
          >
            <span>🛡️</span> Créer un Rôle
          </button>
        )}
      </div>

      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 font-semibold text-sm transition border-b-2 ${
            activeTab === 'users'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          👤 Utilisateurs ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`pb-3 px-4 font-semibold text-sm transition border-b-2 ${
            activeTab === 'roles'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          🛡️ Rôles ({roles.length})
        </button>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500">
          Chargement des données Keycloak...
        </div>
      ) : (
        <>
          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">
                  <tr>
                    <th className="p-4">Utilisateur</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4">Rôle</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        Aucun utilisateur trouvé.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => {
                      const currentRole = userRolesMap[u.id];
                      return (
                        <tr key={u.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 font-medium text-slate-800">
                            {u.firstName || u.lastName
                              ? `${u.firstName || ''} ${u.lastName || ''}`
                              : u.username}
                            <div className="text-xs text-slate-400 font-normal">@{u.username}</div>
                          </td>
                          <td className="p-4">{u.email || '-'}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                u.enabled
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-600 border border-rose-200'
                              }`}
                            >
                              {u.enabled ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                          <td className="p-4">
                            <select
                              value={currentRole?.id || ''}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              className="p-1.5 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:border-blue-500"
                            >
                              <option value="">-- Sans rôle --</option>
                              {roles.map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setEditingUser(u)}
                              className="px-3 py-1 text-xs border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg transition"
                            >
                              Éditer
                            </button>
                            <button
                              onClick={() => handleToggleStatus(u.id, u.enabled)}
                              className="px-3 py-1 text-xs border border-slate-200 hover:bg-slate-100 rounded-lg transition"
                            >
                              {u.enabled ? 'Désactiver' : 'Activer'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="px-3 py-1 text-xs border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">
                  <tr>
                    <th className="p-4">Nom du Rôle</th>
                    <th className="p-4">Description</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {roles.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-slate-400">
                        Aucun rôle personnalisé configuré.
                      </td>
                    </tr>
                  ) : (
                    roles.map((r) => {
                      const isEditing = editingRoleName === r.name;
                      return (
                        <tr key={r.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 font-semibold text-slate-800">
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <span>🛡️</span>
                                <input
                                  type="text"
                                  value={formData.name}
                                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                  className="px-2 py-1 border border-indigo-400 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                                  placeholder="Nom du rôle"
                                  autoFocus
                                />
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span>🛡️</span> {r.name}
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-slate-500">
                            {isEditing ? (
                              <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-2 py-1 border border-indigo-400 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                                placeholder="Description (optionnelle)"
                              />
                            ) : (
                              r.description || 'Aucune description'
                            )}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleSaveRename(r)}
                                  className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
                                >
                                  Enregistrer
                                </button>
                                <button
                                  onClick={() => setEditingRoleName(null)}
                                  className="px-3 py-1 text-xs border border-slate-200 hover:bg-slate-100 rounded-lg transition"
                                >
                                  Annuler
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleStartRename(r)}
                                  className="px-3 py-1 text-xs border border-slate-200 hover:bg-slate-100 rounded-lg transition"
                                >
                                  Éditer
                                </button>
                                <button
                                  onClick={() => handleDeleteRole(r.name)}
                                  className="px-3 py-1 text-xs border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                >
                                  Supprimer
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modaux */}
      <CreateRoleModal
        isOpen={isCreateRoleOpen}
        onClose={() => setIsCreateRoleOpen(false)}
        onCreated={loadData}
      />

      <UserEditModal
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveUserEdit}
      />
    </div>
  );
}