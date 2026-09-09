// src/services/keycloak.js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:7089/auth', // ⚠️ Vérifiez scrupuleusement la majuscule 'O' et 'R'
  realm: 'Obsen-Realm', // ⚠️ Vérifiez scrupuleusement la majuscule 'O' et 'R'
  clientId: 'obsen-frontend',
});

export default keycloak;