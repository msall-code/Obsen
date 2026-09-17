import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import keycloak from './config/keycloak';
import './index.css';

try {
  const authenticated = await keycloak.init({
    onLoad: 'login-required',
    checkLoginIframe: false, // Évite le blocage d'écran noir lié aux cookies/iframes
    pkceMethod: 'S256'
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
  document.body.innerHTML = `<div style="color:red;padding:20px;">
    <h2>Erreur de connexion Keycloak</h2>
    <pre>${JSON.stringify(error, null, 2)}</pre>
  </div>`;
}