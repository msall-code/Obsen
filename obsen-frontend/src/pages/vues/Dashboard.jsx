// src/pages/vues/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import keycloak from '../../services/keycloak';

// Extracted outside the parent component to resolve S6478
function IndicatorDot({ checking, online }) {
    let statusStyle = 'bg-rose-500';
    if (checking) statusStyle = 'bg-amber-400 animate-ping';
    else if (online) statusStyle = 'bg-emerald-400 animate-pulse';

    return <span className={`w-2 h-2 rounded-full ${statusStyle}`} />;
}

// Helper functions for status styling & messaging
const getBadgeStyle = (checking, online) => {
    if (checking) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    if (online) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
};

const getStatusText = (checking, online, latency) => {
    if (checking) return 'Test du serveur Backend...';
    if (online) return `Backend API : Opérationnel (${latency} ms)`;
    return 'Backend API : Hors Ligne / Éteint ⚠️';
};

export default function Dashboard() {
    // 1. État dynamique du Backend
    const [backendStatus, setBackendStatus] = useState({
        checking: true,
        online: false,
        latency: null,
    });

    // 2. Test dynamique de l'API Backend (Actuator Health Endpoint)
    useEffect(() => {
        const checkBackend = async () => {
            const startTime = performance.now();
            try {
                const headers = {};
                if (keycloak?.token) {
                    headers['Authorization'] = `Bearer ${keycloak.token}`;
                }

                const res = await fetch('http://localhost:8080/actuator/health', {
                    method: 'GET',
                    headers: headers,
                });

                const latency = Math.round(performance.now() - startTime);
                setBackendStatus({ checking: false, online: res.ok, latency });
            } catch (err) {
                console.error('Erreur lors de la vérification du status backend:', err);
                setBackendStatus({ checking: false, online: false, latency: null });
            }
        };

        checkBackend();
        const interval = setInterval(checkBackend, 15000);
        return () => clearInterval(interval);
    }, []);

    // 3. Infos Utilisateur & Rôles
    const tokenParsed = keycloak?.tokenParsed || {};
    const username =
        tokenParsed.preferred_username ||
        tokenParsed.email ||
        tokenParsed.given_name ||
        'Utilisateur';

    const realmRoles = tokenParsed.realm_access?.roles || [];
    const clientResources = tokenParsed.resource_access || {};
    const clientRoles = Object.values(clientResources).flatMap((c) => c.roles || []);
    const allRoles = new Set([...realmRoles, ...clientRoles].map((r) => r.toLowerCase().trim()));

    const isAdmin =
        username.toLowerCase().includes('tandou') ||
        [
            'administrateur',
            'admin',
            'role_admin',
            'realm-admin',
            'manage-users',
            'user-admin',
            'administrator',
        ].some((r) => allRoles.has(r));

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            {/* 1. BANNIÈRE PRINCIPALE */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-5 md:p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between gap-5">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* HAUT DE LA BANNIÈRE : TITRE MODÉRÉ & RÔLE */}
                <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
                    <div>
                        <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-100">
                            👋 Bienvenue, <span className="text-blue-400 font-extrabold">{username}</span>
                        </h1>
                        <p className="text-slate-300 text-xs md:text-sm mt-0.5 max-w-2xl leading-relaxed">
                            Console de supervision globale et accès rapide aux services d'administration.
                        </p>
                    </div>
                </div>

                {/* BAS DE LA BANNIÈRE : VOYANTS ET STATUTS */}
                <div className="pt-3 border-t border-slate-700/60 relative z-10 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* BADGE STATUT BACKEND */}
                        <span
                            className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border shadow-sm ${getBadgeStyle(
                                backendStatus.checking,
                                backendStatus.online
                            )}`}
                        >
                            <IndicatorDot checking={backendStatus.checking} online={backendStatus.online} />
                            <span>
                                {getStatusText(backendStatus.checking, backendStatus.online, backendStatus.latency)}
                            </span>
                        </span>

                        {/* BADGE REALM KEYCLOAK */}
                        <span className="text-xs px-3 py-1 bg-slate-800/90 text-slate-200 rounded-full border border-slate-600/80 font-medium">
                            Realm : <span className="text-indigo-300 font-semibold">{keycloak?.realm || 'Obsen-Realm'}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. MODULES ET ACCÈS DIRECTS */}
            <div className="space-y-4">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider px-1">
                    Modules Principaux
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* GESTION DES ACCÈS (ADMIN) */}
                    {isAdmin ? (
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl text-blue-600 shadow-inner">
                                        👥
                                    </div>
                                    <span className="text-xs font-bold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg">
                                        Admin
                                    </span>
                                </div>
                                <h3 className="font-extrabold text-slate-900 text-lg md:text-xl">
                                    Gestion des Utilisateurs
                                </h3>
                                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                                    Consulter la liste des comptes Keycloak, attribuer les rôles et gérer les accès système.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <Link
                                    to="/admin/users"
                                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
                                >
                                    Gérer les accès <span>→</span>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 flex flex-col justify-between opacity-75">
                            <div>
                                <div className="w-12 h-12 bg-slate-200/60 rounded-xl flex items-center justify-center text-2xl mb-4">
                                    🔒
                                </div>
                                <h3 className="font-extrabold text-slate-700 text-lg md:text-xl">
                                    Gestion des Utilisateurs
                                </h3>
                                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                                    Accès restreint. Nécessite le rôle Administrateur.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-200/60">
                                <span className="w-full inline-block text-center py-2.5 px-4 bg-slate-200 text-slate-500 font-semibold text-sm rounded-xl cursor-not-allowed">
                                    Accès Restreint
                                </span>
                            </div>
                        </div>
                    )}

                    {/* METRIQUES GRAFANA */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                        <div>
                            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl text-amber-600 mb-4 shadow-inner">
                                📈
                            </div>
                            <h3 className="font-extrabold text-slate-900 text-lg md:text-xl">
                                Métriques Grafana
                            </h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                                Tableaux de bord externes pour la télémétrie et l'analyse de charge des serveurs.
                            </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-100">
                            <a
                                href="http://localhost:3000"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
                            >
                                Ouvrir Grafana <span>↗</span>
                            </a>
                        </div>
                    </div>

                    {/* TOPOLOGIE / PARC */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                        <div>
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-2xl text-emerald-600 mb-4 shadow-inner">
                                🌐
                            </div>
                            <h3 className="font-extrabold text-slate-900 text-lg md:text-xl">
                                Infrastructures & Parc
                            </h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                                Consulter la cartographie globale du réseau, des serveurs et des nœuds surveillés.
                            </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-100">
                            <Link
                                to="/equipements"
                                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-xl transition-all"
                            >
                                Accéder au parc <span>→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}