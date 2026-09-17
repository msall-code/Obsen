import React from 'react';
import { Navigate } from 'react-router-dom';
import keycloak from '../config/keycloak';

interface PrivateRouteProps {
    children: React.ReactElement;
    requiredRole?: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
    // 1. Vérifier si l'utilisateur est authentifié
    if (!keycloak.authenticated) {
        keycloak.login();
        return null;
    }

    // 2. Vérifier si un rôle particulier est exigé
    if (requiredRole) {
        const roles = keycloak.realmAccess?.roles || [];
        const hasRole = roles.includes(requiredRole);

        if (!hasRole) {
            // Redirection si l'utilisateur n'a pas le rôle
            return <Navigate to="/" replace />;
        }
    }

    return children;
};