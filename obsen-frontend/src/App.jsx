import React, { useState, useEffect } from 'react';
import keycloak from './keycloak';
import api from './api/axios';
import { 
  ShieldCheck, LogIn, LogOut, Users, 
  UserCheck, UserX, Activity, LayoutDashboard, 
  Shield, Plus, Trash2, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';

export default function App({ authenticated }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState('');

  // Rôles extraits du token Keycloak
  const roles = keycloak.tokenParsed?.realm_access?.roles || [];
  const isAdmin = roles.includes('ADMIN') || roles.includes('realm-admin');
  const username = keycloak.tokenParsed?.preferred_username || 'Utilisateur';

  useEffect(() => {
    if (authenticated && activeTab === 'admin' && isAdmin) {
      fetchUsers();
    }
  }, [authenticated, activeTab]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des utilisateurs", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Basculer le statut Actif / Inactif
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { enabled: !currentStatus });
      showNotification(`Statut du compte mis à jour avec succès.`);
      fetchUsers();
    } catch (err) {
      showNotification(`Erreur lors du changement de statut.`, true);
    }
  };

  // Ajouter un rôle Keycloak à un utilisateur
  const handleAddRole = async (userId) => {
    if (!newRoleName.trim()) return;
    try {
      await api.post(`/admin/users/${userId}/roles/${newRoleName.trim().toUpperCase()}`);
      showNotification(`Rôle ${newRoleName.toUpperCase()} attribué avec succès.`);
      setNewRoleName('');
      setSelectedUserForRole(null);
      fetchUsers();
    } catch (err) {
      showNotification(`Impossible d'attribuer le rôle.`, true);
    }
  };

  // Supprimer un utilisateur Keycloak
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur de Keycloak ?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      showNotification(`Utilisateur supprimé de Keycloak.`);
      fetchUsers();
    } catch (err) {
      showNotification(`Erreur lors de la suppression.`, true);
    }
  };

  const showNotification = (msg, isError = false) => {
    setActionMessage({ text: msg, isError });
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleLogin = () => keycloak.login();
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    keycloak.logout({ redirectUri: window.location.origin });
  };

  // Ecran d'accueil avant connexion SSO
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between items-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <header className="w-full max-w-6xl flex justify-between items-center py-4 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <span className="text-2xl font-black tracking-wider text-white">OBSEN</span>
          </div>
          <button 
            onClick={handleLogin}
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20"
          >
            <LogIn className="w-4 h-4" />
            <span>Connexion SSO</span>
          </button>
        </header>

        <main className="text-center max-w-2xl space-y-6 my-auto z-10">
          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs uppercase font-bold px-4 py-1.5 rounded-full tracking-wider">
            Plateforme d'Observation & SRE
          </span>
          <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
            Supervision Centralisée <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              Obsen Core System
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Accédez à l'administration des utilisateurs Keycloak et préparez la visualisation géolocalisée de vos données d'observation.
          </p>
          <div className="pt-2">
            <button 
              onClick={handleLogin}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-4 rounded-xl text-lg shadow-xl shadow-emerald-500/20 transition transform hover:-translate-y-0.5 inline-flex items-center space-x-3"
            >
              <LogIn className="w-5 h-5" />
              <span>Se Connecter via Keycloak</span>
            </button>
          </div>
        </main>

        <footer className="text-slate-500 text-xs z-10">
          &copy; {new Date().getFullYear()} Obsen Core System &bull; OpenID Connect / PKCE S256
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between">
        <div>
          <div className="p-6 flex items-center space-x-3 border-b border-slate-800/80">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-bold text-white tracking-wider text-lg">OBSEN</h2>
              <p className="text-[11px] text-slate-500 font-mono">v1.0.0-BETA</p>
            </div>
          </div>

          <nav className="p-4 space-y-1.5">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition ${activeTab === 'dashboard' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Vue D'ensemble</span>
            </button>

            {isAdmin && (
              <button 
                onClick={() => setActiveTab('admin')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition ${activeTab === 'admin' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}
              >
                <Users className="w-5 h-5" />
                <span>Gestion Utilisateurs</span>
              </button>
            )}

            <button 
              onClick={() => setActiveTab('observations')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition ${activeTab === 'observations' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}
            >
              <Activity className="w-5 h-5" />
              <span>Observations</span>
            </button>
          </nav>
        </div>

        {/* Profil de session bas de sidebar */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{username}</p>
              <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide mt-0.5 ${isAdmin ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-400'}`}>
                {isAdmin ? 'ADMINISTRATEUR' : 'UTILISATEUR'}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
              title="Déconnexion SSO"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Zone de Contenu Principal */}
      <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
        {actionMessage && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center space-x-3 transition ${actionMessage.isError ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
            {actionMessage.isError ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            <span className="text-sm font-medium">{actionMessage.text}</span>
          </div>
        )}

        {/* ONGLET 1 : Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Tableau de Bord Central</h1>
              <p className="text-slate-400 text-sm">Aperçu du système et de la session SSO Keycloak.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Realm Sécurité</p>
                <p className="text-2xl font-black text-emerald-400 mt-2">Obsen-Realm</p>
                <p className="text-xs text-slate-400 mt-2">&bull; OpenID Connect Active</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Backend Status</p>
                <p className="text-2xl font-black text-emerald-400 mt-2">200 OK</p>
                <p className="text-xs text-slate-400 mt-2">&bull; Spring Boot 3.4.3</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Privilèges</p>
                <p className="text-2xl font-black text-amber-400 mt-2">{isAdmin ? 'ADMIN' : 'USER'}</p>
                <p className="text-xs text-slate-400 mt-2">&bull; Roles Keycloak Validated</p>
              </div>
            </div>
          </div>
        )}

        {/* ONGLET 2 : Administration des Utilisateurs et Rôles */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">Gestion des Utilisateurs Keycloak</h1>
                <p className="text-slate-400 text-sm">Gérez les comptes, les statuts et attribuez les rôles pour Obsen-Realm.</p>
              </div>
              <button 
                onClick={fetchUsers}
                className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-800 transition shadow-lg"
              >
                <RefreshCw className={`w-4 h-4 ${loadingUsers ? 'animate-spin' : ''}`} />
                <span>Rafraîchir</span>
              </button>
            </div>

            <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead className="bg-slate-900/90 text-slate-400 text-xs font-bold uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-4">Utilisateur</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4">Rôles Attribués</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {loadingUsers ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500">Chargement de la liste des utilisateurs...</td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500">Aucun utilisateur trouvé dans le realm.</td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-850/40 transition">
                        <td className="p-4 font-bold text-white">{u.username}</td>
                        <td className="p-4 text-slate-400">{u.email || 'Non renseigné'}</td>
                        <td className="p-4">
                          {u.enabled ? (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-1 rounded-full">Actif</span>
                          ) : (
                            <span className="bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-bold px-2.5 py-1 rounded-full">Inactif</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {(u.roles || ['USER']).map((r, i) => (
                              <span key={i} className="bg-slate-800 text-slate-300 border border-slate-700/80 text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center space-x-1">
                                <Shield className="w-3 h-3 text-emerald-400" />
                                <span>{r}</span>
                              </span>
                            ))}
                            <button 
                              onClick={() => setSelectedUserForRole(selectedUserForRole === u.id ? null : u.id)}
                              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 rounded-md transition"
                              title="Attribuer un rôle"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Petit formulaire inline d'ajout de rôle */}
                          {selectedUserForRole === u.id && (
                            <div className="mt-2 flex items-center space-x-2">
                              <input 
                                type="text"
                                placeholder="ex: ADMIN"
                                value={newRoleName}
                                onChange={(e) => setNewRoleName(e.target.value)}
                                className="bg-slate-950 border border-slate-700 text-xs px-2 py-1 rounded text-white focus:outline-none focus:border-emerald-400"
                              />
                              <button 
                                onClick={() => handleAddRole(u.id)}
                                className="bg-emerald-500 text-slate-950 font-bold text-xs px-2.5 py-1 rounded hover:bg-emerald-400 transition"
                              >
                                Ajouter
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => toggleUserStatus(u.id, u.enabled)}
                              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
                              title={u.enabled ? "Désactiver le compte" : "Activer le compte"}
                            >
                              {u.enabled ? <UserX className="w-4 h-4 text-amber-400" /> : <UserCheck className="w-4 h-4 text-emerald-400" />}
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition hover:text-red-400"
                              title="Supprimer l'utilisateur"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ONGLET 3 : Module Observations (Prêt pour la suite) */}
        {activeTab === 'observations' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Module Observation</h1>
              <p className="text-slate-400 text-sm">Gestion des observations géolocalisées et intégration Grafana.</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl text-center space-y-4">
              <Activity className="w-12 h-12 text-emerald-400 mx-auto" />
              <h2 className="text-xl font-bold text-white">Espace Prêt pour le Module Observation</h2>
              <p className="text-slate-400 max-w-md mx-auto text-sm">
                La gestion d'identité (Keycloak, SSO, Admin Users & Roles) est 100% opérationnelle. Nous sommes prêts à attaquer les endpoints `/api/v1/observations`.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}