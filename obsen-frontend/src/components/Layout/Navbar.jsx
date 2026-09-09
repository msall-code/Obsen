import React from 'react';
import keycloak from '../../services/keycloak';
import obsenLogo from '../../assets/obsen.jpg';

export default function Navbar() {
  const handleLogout = () => {
    keycloak.logout();
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img 
          src={obsenLogo} 
          alt="OBSEN Logo" 
          className="h-10 w-auto object-contain rounded-md"
        />
        <h1 className="text-xl font-bold tracking-wide">OBSEN</h1>
      </div>

      {keycloak.authenticated && (
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
        >
          Déconnexion
        </button>
      )}
    </header>
  );
}