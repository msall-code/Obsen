import React from 'react';
import { Navigate } from 'react-router-dom';
import keycloak from '../config/keycloak';

interface PrivateRouteProps {
    children: React.ReactElement;
    requiredRole?: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
    if (!keycloak.authenticated) {
        keycloak.login();
        return null;
    }

    if (requiredRole) {
        const roles = (keycloak.realmAccess?.roles || []).map(r => r.toUpperCase());
        const hasRole = roles.includes(requiredRole.toUpperCase());

        if (!hasRole) {
            return <Navigate to="/" replace />;
        }
    }

    return children;
};