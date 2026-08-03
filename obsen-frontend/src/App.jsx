// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // <-- PAS de BrowserRouter ici !
import Login from './vues/Auth/Login';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* Route publique */}
      <Route path="/auth/login" element={<Login />} />

      {/* Routes protégées */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<div>Dashboard OBSEN</div>} />
      </Route>

      {/* Redirection par défaut */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}