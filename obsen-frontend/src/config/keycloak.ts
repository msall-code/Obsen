import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:7089/auth',
    realm: 'Obsen-Realm',
    clientId: 'obsen-frontend', // <-- Utiliser 'obsen-frontend' (et non 'obsen-backend-client')
});

export default keycloak;