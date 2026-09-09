// src/components/Layout/Navbar.jsx
import { useState, useEffect } from 'react';
import keycloak from '../../services/keycloak';
import obsenLogo from '../../assets/obsen.jpg';

export default function Navbar() {
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Calcule dynamiquement le temps restant du JWT émis par Keycloak
  useEffect(() => {
    if (!keycloak?.tokenParsed) return;

    const updateTimer = () => {
      const exp = keycloak.tokenParsed.exp;
      const now = Math.floor(Date.now() / 1000);
      setSecondsLeft(Math.max(0, exp - now));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    keycloak.logout();
  };

  const handleOpenKeycloakSessions = () => {
    // Redirige vers la console native Keycloak où l'utilisateur voit et ferme ses sessions actives
    const baseUrl = keycloak.authServerUrl.replace(/\/$/, '');
    window.open(`${baseUrl}/realms/${keycloak.realm}/account/#/security/device-activity`, '_blank');
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

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
        <div className="flex items-center gap-4">
          {/* Badge Temps Restant du Token */}
          <div className="text-xs font-mono bg-slate-800 text-emerald-400 px-3 py-1.5 rounded-md border border-slate-700 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Token: {minutes}m {seconds < 10 ? `0${seconds}` : seconds}s</span>
          </div>

          {/* Bouton de gestion des sessions Keycloak */}
          <button
            onClick={handleOpenKeycloakSessions}
            className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
            title="Consulter et fermer les sessions ouvertes"
          >
            💻 Mes Sessions
          </button>

          {/* Bouton de déconnexion */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition-colors border border-red-500/30 font-medium"
          >
            Déconnexion
          </button>
        </div>
      )}
    </header>
  );
}