import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import keycloak from './keycloak';
import './index.css';

keycloak
  .init({
    onLoad: 'login-required', // Redirige automatiquement vers la mire de connexion Keycloak si non connecté
    checkLoginIframe: false,   // Évite l'erreur 404 du script step1.html
    pkceMethod: 'S256',        // Norme de sécurité moderne OAuth2
  })
  .then((authenticated) => {
    if (authenticated) {
      ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    } else {
      window.location.reload();
    }
  })
  .catch((error) => {
    console.error('Échec de l\'initialisation de Keycloak', error);
  });