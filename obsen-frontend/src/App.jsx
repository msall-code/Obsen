import React, { useState, useEffect } from 'react';
import keycloak from './keycloak';
import { setAccessToken } from './api/axios';
import AdminUsers from './pages/AdminUsers';
import EquipmentPage from './pages/EquipmentPage';
import DashboardPage from './pages/DashboardPage';
import { 
  ShieldCheck, LogOut, Users, 
  Activity, LayoutDashboard, Server
} from 'lucide-react';

export default function App({ authenticated }) {
  // Conversion en Set de majuscules pour optimiser la recherche d'existence (SonarLint S7776)
  const realmRoles = new Set(
    (keycloak.tokenParsed?.realm_access?.roles || []).map(r => r.toUpperCase())
  );
  const isAdmin = realmRoles.has('ADMIN') || realmRoles.has('REALM-ADMIN');
  
  const username = keycloak.tokenParsed?.preferred_username || 'Utilisateur';

  const [activeTab, setActiveTab] = useState('telemetry');

  useEffect(() => {
    if (!isAdmin && activeTab === 'admin') {
      setActiveTab('telemetry');
    }
  }, [isAdmin, activeTab]);

  const handleLogin = () => keycloak.login();
  
  const handleLogout = () => {
    // 1. Vidage immédiat de la mémoire locale JS
    setAccessToken(null);
    localStorage.clear();
    
    // 2. Déconnexion globale Keycloak
    keycloak.logout({ redirectUri: window.location.origin });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between items-center p-6 relative font-sans">
        <header className="w-full max-w-6xl flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
            <span className="text-2xl font-black text-white">OBSEN</span>
          </div>
        </header>

        <main className="text-center max-w-2xl my-auto space-y-6">
          <h1 className="text-5xl font-black text-white">Plateforme Obsen</h1>
          <p className="text-slate-400">Observabilité et Supervision des Environnements Numériques.</p>
          <button onClick={handleLogin} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-4 rounded-xl text-lg transition">
            Se Connecter 
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="font-bold text-white text-lg">OBSEN</h2>
          </div>

          <nav className="p-4 space-y-1.5">
            {/* Télémétrie / Dashboard */}
            <button 
              onClick={() => setActiveTab('telemetry')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition ${activeTab === 'telemetry' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <Activity className="w-5 h-5" />
              <span>Supervision Télémétrie</span>
            </button>

            {/* Inventaire Équipements */}
            <button 
              onClick={() => setActiveTab('equipment')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition ${activeTab === 'equipment' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <Server className="w-5 h-5" />
              <span>Inventaire Équipements</span>
            </button>

            {/* Admin Utilisateurs (Rôle Admin requis) */}
            {isAdmin && (
              <button 
                onClick={() => setActiveTab('admin')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition ${activeTab === 'admin' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Users className="w-5 h-5" />
                <span>Gestion Utilisateurs</span>
              </button>
            )}

            {/* Module Observations */}
            <button 
              onClick={() => setActiveTab('observations')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition ${activeTab === 'observations' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Observations</span>
            </button>
          </nav>
        </div>

        {/* Pied de sidebar - Profil */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between">
            <div className="overflow-hidden pr-2">
              <p className="text-sm font-semibold text-white truncate">{username}</p>
              <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold uppercase mt-0.5 ${
                isAdmin ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {isAdmin ? 'ADMINISTRATEUR' : 'UTILISATEUR'}
              </span>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-400 transition" title="Déconnexion">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Zone de contenu principal */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'telemetry' && <DashboardPage />}

        {activeTab === 'equipment' && <EquipmentPage />}

        {activeTab === 'admin' && (
          isAdmin ? <AdminUsers /> : <div className="p-8 text-red-400 font-bold">Accès interdit.</div>
        )}

        {activeTab === 'observations' && (
          <div className="p-8 text-white font-bold">
            <h1 className="text-2xl font-bold mb-2">Module Observations</h1>
            <p className="text-slate-400 text-sm">Gestion des journaux, événements et métriques d'observation de la plateforme.</p>
          </div>
        )}
      </main>
    </div>
  );
}