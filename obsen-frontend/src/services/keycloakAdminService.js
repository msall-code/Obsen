import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:7089/auth',
  realm: 'Obsen-Realm',
  clientId: 'obsen-frontend',
});

export default keycloak;