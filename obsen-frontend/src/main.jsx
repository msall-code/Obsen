import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import keycloak from './services/keycloak.js';
import AutoLogout from './components/AutoLogout.jsx';
import './index.css';

try {
  const authenticated = await keycloak.init({
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    pkceMethod: 'S256',
    checkLoginIframe: false,
  });

  console.log(`🔐 Keycloak initialisé. Authentifié: ${authenticated}`);

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <AutoLogout>
        <App />
      </AutoLogout>
    </React.StrictMode>
  );
} catch (err) {
  console.error('❌ Échec de l\'initialisation de Keycloak', err);
}