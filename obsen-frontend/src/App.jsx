import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import keycloak from './services/keycloak';

import MainLayout from './components/layout/MainLayout';
import LandingPage from './pages/vues/LandingPage';
import Dashboard from './pages/vues/Dashboard';
import UserListPage from './pages/admin/users/UserListPage';
import UserCreatePage from './pages/admin/users/UserCreatePage';
import ProtectedRoute from './components/auth/ProtectedRoute';

export default function App() {
  const isAuthenticated = keycloak.authenticated;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <LandingPage />} />

          {/* Section Administration */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'ROLE_ADMIN']} />}>
            <Route path="/admin/users" element={<UserListPage />} />
            <Route path="/admin/users/create" element={<UserCreatePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}