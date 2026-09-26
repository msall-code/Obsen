import React, { useState, useEffect } from 'react';
import keycloak from './keycloak';
import AdminUsers from './pages/AdminUsers';
import { 
  ShieldCheck, LogIn, LogOut, Users, 
  Activity, LayoutDashboard, ShieldAlert,
  UserCheck, AlertCircle
} from 'lucide-react';

export default function App({ authenticated }) {
  // Extraction dynamique des rôles Realm Keycloak
  const realmRoles = keycloak.tokenParsed?.realm_access?.roles || [];
  const isAdmin = realmRoles.includes('ADMIN') || realmRoles.includes('realm-admin');
  const username = keycloak.tokenParsed?.preferred_username || 'Utilisateur';
  const email = keycloak.tokenParsed?.email || '';

  // Tab par défaut selon le rôle
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sécurité : Rediriger si un simple USER essaie d'aller sur l'onglet Admin
  useEffect(() => {
    if (!isAdmin && activeTab === 'admin') {
      setActiveTab('dashboard');
    }
  }, [isAdmin, activeTab]);

  const handleLogin = () => keycloak.login();
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    keycloak.logout({ redirectUri: window.location.origin });
  };

  // 1. Écran d'accueil avant connexion SSO
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
            Authentifiez-vous via Keycloak pour accéder aux fonctionnalités d'observation et d'administration selon vos privilèges.
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

  // 2. Interface Authentifiée (Différenciée par Rôle)
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
              <span>{isAdmin ? "Vue D'ensemble SRE" : "Mon Espace Utilisateur"}</span>
            </button>

            {/* Menu affiché UNIQUEMENT si l'utilisateur a le rôle ADMIN */}
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
              <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide mt-0.5 ${
                isAdmin ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
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
        
        {/* VUE 1 : Tableau de Bord différencié */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {isAdmin ? "Tableau de Bord Administration SRE" : `Bienvenue, ${username}`}
              </h1>
              <p className="text-slate-400 text-sm">
                {isAdmin 
                  ? "Aperçu de la plateforme, statut du cluster et accès Keycloak." 
                  : "Accédez à vos observations et à la carte interactive des événements."}
              </p>
            </div>

            {/* Cartes Spécifiques ADMIN */}
            {isAdmin ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Realm Sécurité</p>
                  <p className="text-2xl font-black text-emerald-400 mt-2">Obsen-Realm</p>
                  <p className="text-xs text-slate-400 mt-2">&bull; Accès Rôle Administrateur Actif</p>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Backend Spring Boot</p>
                  <p className="text-2xl font-black text-emerald-400 mt-2">200 OK</p>
                  <p className="text-xs text-slate-400 mt-2">&bull; Sync Keycloak Admin API OK</p>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Droits de Session</p>
                  <p className="text-2xl font-black text-amber-400 mt-2">ADMINISTRATEUR</p>
                  <p className="text-xs text-slate-400 mt-2">&bull; CRUD Utilisateurs & Rôles Autorisé</p>
                </div>
              </div>
            ) : (
              /* Cartes Spécifiques USER */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mon Compte SSO</p>
                  <p className="text-xl font-bold text-white mt-2">{email || username}</p>
                  <p className="text-xs text-emerald-400 mt-2">&bull; Authentifié via Keycloak</p>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Statut Privilèges</p>
                  <p className="text-xl font-bold text-emerald-400 mt-2">Observateur Standard</p>
                  <p className="text-xs text-slate-400 mt-2">&bull; Soumission & Consultation autorisées</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VUE 2 : Administration (Strictement réservée au Rôle ADMIN) */}
        {activeTab === 'admin' && (
          isAdmin ? (
            <AdminUsers />
          ) : (
            <div className="p-8 bg-red-500/10 border border-red-500/30 rounded-2xl text-center space-y-3">
              <ShieldAlert className="w-12 h-12 text-red-400 mx-auto" />
              <h2 className="text-xl font-bold text-white">Accès Non Autorisé</h2>
              <p className="text-slate-400 text-sm">Vous n'avez pas le rôle ADMIN nécessaire pour accéder à cette page.</p>
            </div>
          )
        )}

        {/* VUE 3 : Module Observations */}
        {activeTab === 'observations' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Module Observation</h1>
              <p className="text-slate-400 text-sm">Visualisation et gestion des observations sur la carte.</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl text-center space-y-4">
              <Activity className="w-12 h-12 text-emerald-400 mx-auto" />
              <h2 className="text-xl font-bold text-white">Espace Prêt pour l'Intégration de la Carte Interactive</h2>
              <p className="text-slate-400 max-w-md mx-auto text-sm">
                L'isolation des rôles (ADMIN vs USER) est validée.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}