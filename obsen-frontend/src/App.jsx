import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./vues/Auth/Login";
import MainLayout from "./components/Layout/MainLayout";
import VueGestionUsers from "./vues/Users/VueGestionUsers";
import ProtectedRoute from "./components/ProtectedRoute";

const DashboardHome = () => <h1 className="text-2xl font-bold">Tableau de Bord SRE</h1>;
const VueEquipements = () => <h1 className="text-2xl font-bold">Gestion des Équipements</h1>;
const VueTopologieParc = () => <h1 className="text-2xl font-bold">Topologie du Parc</h1>;
const VueGrafana = () => <h1 className="text-2xl font-bold">Métriques & Grafana</h1>;

export default function App() {
  return (
    <Routes>
      {/* Route Publique */}
      <Route path="/auth/login" element={<Login />} />

      {/* Routes Protégées sous le MainLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/equipements" element={<VueEquipements />} />
          <Route path="/topologie" element={<VueTopologieParc />} />
          <Route path="/grafana" element={<VueGrafana />} />
          <Route path="/users" element={<VueGestionUsers />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}