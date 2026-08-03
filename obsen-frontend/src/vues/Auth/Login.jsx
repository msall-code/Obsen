// src/pages/auth/Login.jsx (ou votre composant Login)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // 1. Bloquer le rechargement par défaut du navigateur
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser({ username, password });
      navigate('/dashboard');
    } catch (err) {
      // 2. Extraire la CHAÎNE DE CARACTÈRES du message
      setError(err.message || 'Impossible de se connecter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-extrabold tracking-wider text-white">OBSEN</h1>
        </div>

        {/* Affichage sécurisé de l'erreur */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs text-center">
            {String(error)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
              Nom d'utilisateur / Email
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ex: msall"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-200"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1b82a4] hover:bg-[#166b87] text-white font-semibold py-3 px-4 rounded-lg transition text-sm disabled:opacity-50"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}