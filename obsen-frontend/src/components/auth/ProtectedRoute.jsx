import React from 'react';
import { Navigate } from 'react-router-dom';
import keycloak from '../keycloak';
import { hasRole } from '../utils/keycloakUtils';

const ProtectedRoute = ({ children, requiredRole }) => {
  if (!keycloak.authenticated) {
    keycloak.login();
    return null;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;