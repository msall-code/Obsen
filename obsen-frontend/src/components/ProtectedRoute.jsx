import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';

/**
 * Composant de protection de route selon l'authentification et les rôles
 * @param {Array} allowedRoles - Liste des rôles autorisés (ex: ['admin', 'manager'])
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const token = authService.getToken();
  const userRoles = authService.getUserRoles();

  // 1. Si pas connecté -> Redirection vers la page Login React
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si des rôles spécifiques sont requis, vérifier la présence d'au moins un rôle
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.some((role) => userRoles.includes(role));
    if (!hasRole) {
      return <Navigate to="/unauthorized" replace />; // Page Accès Refusé
    }
  }

  // 3. Tout est OK -> Affiche la page demandée
  return <Outlet />;
};

export default ProtectedRoute;