import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://localhost:7089/auth', // L'adresse de votre serveur Keycloak
  realm: 'Obsen',                     // Le nom de votre Realm
  clientId: 'obsen-client',          // L'identifiant du client React
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;