import keycloak from '../keycloak';

/**
 * Vérifie si l'utilisateur a un rôle spécifique dans le Realm.
 */
export const hasRole = (role) => {
    if (!keycloak.realmAccess) return false;
    return keycloak.realmAccess.roles.includes(role);
};

/**
 * Récupère le nom complet de l'utilisateur connecté.
 */
export const getUserFullName = () => {
    if (!keycloak.tokenParsed) return '';
    return keycloak.tokenParsed.name || `${keycloak.tokenParsed.given_name || ''} ${keycloak.tokenParsed.family_name || ''}`;
};

/**
 * Récupère le token JWT actuel.
 */
export const getToken = () => keycloak.token;