import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import keycloak from './keycloak';
import './index.css';

try {
  const authenticated = await keycloak.init({ 
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    checkLoginIframe: false 
  });

  if (authenticated) {
    localStorage.setItem('accessToken', keycloak.token);
    localStorage.setItem('refreshToken', keycloak.refreshToken);
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App authenticated={authenticated} />
    </React.StrictMode>
  );
} catch (err) {
  console.error("Erreur lors de l'initialisation de Keycloak :", err);
}