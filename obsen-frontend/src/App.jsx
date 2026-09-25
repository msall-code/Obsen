import React from 'react';
import keycloak from './keycloak';
import { ShieldCheck, LogIn, UserPlus, LogOut, LayoutDashboard, Users } from 'lucide-react';

export default function App({ authenticated }) {

  // Redirection vers votre mire login.ftl (obsen-theme)
  const handleLogin = () => {
    keycloak.login();
  };

  // Redirection vers votre mire register.ftl (obsen-theme)
  const handleRegister = () => {
    keycloak.register();
  };

  // Déconnexion SSO
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    keycloak.logout({ redirectUri: window.location.origin });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* En-tête / Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="text-xl font-bold tracking-wider text-white">OBSEN</span>
        </div>

        <div>
          {authenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400">
                Connecté en tant que : <strong className="text-emerald-400">{keycloak.tokenParsed?.preferred_username || 'Utilisateur'}</strong>
              </span>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleRegister}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>Créer un compte</span>
              </button>
              <button 
                onClick={handleLogin}
                className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 py-2 rounded-lg text-sm transition shadow-lg shadow-emerald-500/10"
              >
                <LogIn className="w-4 h-4" />
                <span>Se connecter</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {!authenticated ? (
          <div className="max-w-md space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Plateforme d'Observation <span className="text-emerald-400">OBSEN</span>
            </h1>
            <p className="text-slate-400 text-lg">
              Accédez à vos données d'observation géolocalisées et gérez votre infrastructure de manière sécurisée grâce à Keycloak SSO.
            </p>
            <div className="pt-4 flex items-center justify-center space-x-4">
              <button 
                onClick={handleLogin}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg transition flex items-center space-x-2"
              >
                <LogIn className="w-5 h-5" />
                <span>Accéder à l'Espace Sécurisé</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl space-y-8 text-left">
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center space-x-2">
                <LayoutDashboard className="w-5 h-5 text-emerald-400" />
                <span>Session Keycloak Active</span>
              </h2>
              <p className="text-slate-400 text-sm mb-4">
                Votre jeton d'accès OIDC est validé. Vous pouvez maintenant interroger l'API Spring Boot et afficher les dashboards Grafana.
              </p>
              
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                <p className="text-emerald-400 mb-1">// Jeton JWT (Aperçu) :</p>
                <p className="break-all opacity-80">{keycloak.token}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}