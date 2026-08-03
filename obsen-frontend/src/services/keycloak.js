import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:7089/auth", // URL matching issuer-uri in application.yaml
  realm: "Obsen",
  clientId: "obsen-frontend",       // Your frontend client ID configured in Keycloak
});

export default keycloak;