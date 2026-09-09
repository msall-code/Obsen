import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import keycloak from '../../services/keycloak';

export default function Sidebar() {
  const location = useLocation();
  const username = keycloak.tokenParsed?.preferred_username;

  // 1. Extraction et normalisation des rôles
  const realmRoles = keycloak.tokenParsed?.realm_access?.roles || [];
  const clientResources = keycloak.tokenParsed?.resource_access || {};
  const clientRoles = Object.values(clientResources).flatMap((client) => client.roles || []);

  const allRolesNormalized = [...realmRoles, ...clientRoles].map((role) => role.toLowerCase());

  // 2. Détection Admin (Bypass tandou + rôles admin)
  const isTandou = username?.toLowerCase() === 'tandou';
  const hasAdminRole = allRolesNormalized.some((role) =>
    ['admin', 'role_admin', 'realm-admin', 'manage-users', 'user-admin', 'administrator'].includes(role)
  );

  const isAdmin = isTandou || hasAdminRole;

  // 3. RÈGLES D'AFFICHAGE DU MENU ADMIN
  const isDashboardPage = location.pathname === '/';
  const isAccessManagementPage = location.pathname.startsWith('/admin/users');

  // Afficher la section d'administration si Admin ET ni sur l'accueil NI sur la gestion des accès
  const showAdminMenu = isAdmin && !isDashboardPage && !isAccessManagementPage;

  const navLinkStyle = ({ isActive }) =>
    `flex items-center justify-between px-3.5 py-2 rounded-xl font-medium text-sm transition-all duration-150 ${
      isActive
        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 font-semibold'
        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 p-4 flex flex-col justify-between min-h-[calc(100vh-65px)] select-none">
      <div className="space-y-5 overflow-y-auto pr-1">

        {/* CAS 1 : BOUTON RETOUR SI VOUS ÊTES SUR LA PAGE "GESTION DES ACCÈS" */}
        {isAccessManagementPage && (
          <div className="pb-3 border-b border-slate-100">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-all"
            >
              <span>←</span>
              <span>Retour au Tableau de bord</span>
            </Link>
          </div>
        )}

        {/* CAS 2 : MENU ADMINISTRATION (SUR TOUTES LES AUTRES PAGES POUR LES ADMINS) */}
        {showAdminMenu && (
          <div className="space-y-1.5 pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between px-2">
              <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                <span>🛡️</span> Administration
              </p>
              <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-blue-200">
                Admin
              </span>
            </div>

            <nav className="space-y-1">
              {/* 1ER ÉLÉMENT : UTILISATEURS */}
              <NavLink to="/admin/users" className={navLinkStyle}>
                <div className="flex items-center gap-2.5">
                  <span className="text-base">👤</span>
                  <span>Utilisateurs</span>
                </div>
              </NavLink>

              {/* 2ÈME ÉLÉMENT : PARAMÈTRES / TABLEAU DE BORD ADMIN */}
              <NavLink to="/admin/settings" className={navLinkStyle}>
                <div className="flex items-center gap-2.5">
                  <span className="text-base">⚙️</span>
                  <span>Paramètres Système</span>
                </div>
              </NavLink>
            </nav>
          </div>
        )}

        {/* SECTION 2 : OBSERVABILITÉ & SRE */}
        <div className="space-y-1.5">
          <p className="px-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Observabilité & SRE
          </p>
          <nav className="space-y-1">
            <NavLink to="/" end className={navLinkStyle}>
              <div className="flex items-center gap-2.5">
                <span className="text-base">📊</span>
                <span>Vue d'ensemble</span>
              </div>
            </NavLink>
            <NavLink to="/sre/slo-error-budget" className={navLinkStyle}>
              <div className="flex items-center gap-2.5">
                <span className="text-base">🎯</span>
                <span>SLO & Error Budgets</span>
              </div>
            </NavLink>
            <NavLink to="/sre/incidents" className={navLinkStyle}>
              <div className="flex items-center gap-2.5">
                <span className="text-base">🚨</span>
                <span>Incidents & Alertes</span>
              </div>
            </NavLink>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">📈</span>
                <span>Metrics Grafana</span>
              </div>
              <span className="text-xs text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-transform">
                ↗
              </span>
            </a>
          </nav>
        </div>

        {/* SECTION 3 : PROVISIONING & IA */}
        <div className="space-y-1.5 pt-3 border-t border-slate-100">
          <p className="px-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Provisioning & IA
          </p>
          <nav className="space-y-1">
            <NavLink to="/automation/provisioning" className={navLinkStyle}>
              <div className="flex items-center gap-2.5">
                <span className="text-base">🚀</span>
                <span>Déploiement & Playbooks</span>
              </div>
            </NavLink>
            <NavLink to="/automation/ai-ops" className={navLinkStyle}>
              <div className="flex items-center gap-2.5">
                <span className="text-base">🤖</span>
                <span>AIOps & Anomaly Ops</span>
              </div>
            </NavLink>
            <NavLink to="/automation/remediation" className={navLinkStyle}>
              <div className="flex items-center gap-2.5">
                <span className="text-base">⚡</span>
                <span>Auto-Remédiation</span>
              </div>
            </NavLink>
          </nav>
        </div>

        {/* SECTION 4 : INFRASTRUCTURE & PARC */}
        <div className="space-y-1.5 pt-3 border-t border-slate-100">
          <p className="px-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Infrastructure & Parc
          </p>
          <nav className="space-y-1">
            <NavLink to="/equipements" className={navLinkStyle}>
              <div className="flex items-center gap-2.5">
                <span className="text-base">💻</span>
                <span>Équipements</span>
              </div>
            </NavLink>
            <NavLink to="/topologie" className={navLinkStyle}>
              <div className="flex items-center gap-2.5">
                <span className="text-base">🌐</span>
                <span>Cartographie Parc</span>
              </div>
            </NavLink>
          </nav>
        </div>

      </div>

      {/* PIED DE PAGE : IDENTITÉ & ROLE */}
      <div className="p-3 bg-slate-50/80 border border-slate-200/60 rounded-xl text-xs space-y-1.5 mt-4">
        <div className="flex items-center justify-between text-slate-500">
          <span>Compte :</span>
          <span className="font-semibold text-slate-800 truncate max-w-[110px]" title={username}>
            @{username || 'Anonyme'}
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-500">
          <span>Rôle :</span>
          <span
            className={`font-semibold px-1.5 py-0.5 rounded text-[11px] ${
              isAdmin
                ? 'bg-blue-100/70 text-blue-700'
                : 'bg-slate-200/60 text-slate-700'
            }`}
          >
            {isAdmin ? 'Administrateur' : 'Opérateur SRE'}
          </span>
        </div>
      </div>
    </aside>
  );
}