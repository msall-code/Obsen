import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import keycloak from './config/keycloak';

try {
  const authenticated = await keycloak.init({
    onLoad: 'login-required',
    pkceMethod: 'S256',
    checkLoginIframe: false,
  });

  if (authenticated) {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
} catch (error) {
  console.error("Erreur d'initialisation Keycloak :", error);
}