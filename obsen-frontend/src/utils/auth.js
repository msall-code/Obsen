import keycloak from '../services/keycloak';

/**
 * Fonction utilitaire pour décoder un token JWT sans bibliothèque externe
 */
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replaceAll('-', '+').replaceAll('_', '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.codePointAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    // Exception ignorée intentionnellement si le token est malformé ou absent
    console.warn('Erreur lors du décodage du JWT :', error.message);
    return null;
  }
}

/**
 * Vérifie si l'utilisateur connecté possède un rôle spécifique
 * @param {string} roleName Ex: 'ROLE_ADMIN' ou 'ADMIN'
 */
export function hasRole(roleName) {
  let tokenParsed = keycloak?.tokenParsed;

  if (!tokenParsed) {
    const storedToken = localStorage.getItem('kc_token');
    if (storedToken) {
      tokenParsed = parseJwt(storedToken);
    }
  }

  if (!tokenParsed) return false;

  const realmRoles = tokenParsed.realm_access?.roles || [];
  const clientAccess = tokenParsed.resource_access || {};
  const clientRoles = Object.values(clientAccess).flatMap((client) => client.roles || []);
  const rootRoles = tokenParsed.roles || [];

  const allRoles = [...realmRoles, ...clientRoles, ...rootRoles];

  return allRoles.some(
    (r) => r.toUpperCase() === roleName.toUpperCase() || r.toUpperCase() === `ROLE_${roleName.toUpperCase()}`
  );
}