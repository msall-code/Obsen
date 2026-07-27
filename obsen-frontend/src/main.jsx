import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import keycloak from './services/keycloak';

// 🔑 Initialisation de Keycloak
keycloak.init({
  onLoad: 'login-required', // Redirige automatiquement vers la page de connexion si l'utilisateur n'est pas connecté
  checkLoginIframe: false   // Désactive la vérification par iframe (évite certains problèmes en local)
}).then((authenticated) => {
  if (authenticated) {
    console.log("Utilisateur authentifié avec succès ! 🚀");
  }
  
  // ⚛️ On ne monte l'application React qu'une fois Keycloak prêt
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch((error) => {
  console.error("Erreur d'initialisation de Keycloak ❌", error);
});