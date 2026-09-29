import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import keycloak from './keycloak';
import { setAccessToken } from './api/axios'; // Permet d'alimenter votre instance Axios
import './index.css';

// Purge préventive de sécurité (élimine les traces d'anciennes versions)
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
localStorage.removeItem('token');

try {
  const authenticated = await keycloak.init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    checkLoginIframe: false
  });

  if (authenticated && keycloak.token) {
    // SÉCURITÉ MAXIMALE : On injecte le token uniquement en MÉMOIRE
    setAccessToken(keycloak.token);

    // Configuration de la mise à jour automatique du token avant expiration (Silent Refresh)
    setInterval(() => {
      keycloak.updateToken(70).then((refreshed) => {
        if (refreshed) {
          setAccessToken(keycloak.token);
        }
      }).catch(() => {
        console.error("Échec du rafraîchissement automatique de la session.");
      });
    }, 60000); // Vérification toutes les minutes
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App authenticated={authenticated} />
    </React.StrictMode>
  );
} catch (err) {
  console.error("Erreur lors de l'initialisation de Keycloak :", err);
}