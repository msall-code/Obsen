import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import keycloak from '../../services/keycloak';

export default function ProtectedRoute({ allowedRoles = [] }) {
  if (!keycloak.authenticated) {
    return <Navigate to="/" replace />;
  }

  const username = keycloak.tokenParsed?.preferred_username;
  const isTandou = username?.toLowerCase() === 'tandou';

  // 1. Extraction de tous les rôles
  const realmRoles = keycloak.tokenParsed?.realm_access?.roles || [];
  const clientResources = keycloak.tokenParsed?.resource_access || {};
  const clientRoles = Object.values(clientResources).flatMap((client) => client.roles || []);

  const allRolesNormalized = [...realmRoles, ...clientRoles].map((r) => String(r).toLowerCase());

  // 2. Vérification élargie des rôles administratifs
  const hasAdminRole = allRolesNormalized.some((role) =>
    ['admin', 'role_admin', 'realm-admin', 'manage-users', 'user-admin', 'administrator'].includes(role)
  );

  // 3. Vérification des rôles spécifiques passés en props à ProtectedRoute
  const hasAllowedRole = allowedRoles.some((allowed) =>
    allRolesNormalized.includes(allowed.toLowerCase())
  );

  // Accès autorisé si l'utilisateur est tandou, a un rôle admin élargi, ou a un rôle spécifique autorisé
  const hasAccess = isTandou || hasAdminRole || hasAllowedRole;

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}