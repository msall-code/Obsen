import React from 'react';
import keycloak from '../../services/keycloak';
import logoObsen from "../../assets/obsen.jpg";

export default function LandingPage() {
    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col justify-between py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

            {/* 🚀 SECTION HERO */}
            <section className="text-center space-y-8 pt-4 relative">

                {/* Glow d'arrière-plan */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

                {/* Visuel Logo avec effet d'élévation */}
                <div className="flex justify-center">
                    <div className="p-4 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-2xl shadow-cyan-500/10 hover:scale-105 transition-transform duration-300">
                        <img
                            src={logoObsen}
                            alt="Logo OBSEN"
                            className="w-40 h-40 sm:w-48 sm:h-48 object-contain rounded-2xl"
                        />
                    </div>
                </div>

                {/* Titres & Slogan */}
                <div className="space-y-4 max-w-3xl mx-auto">
                    

                    <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">
                        OBSEN
                    </h1>

                    <p className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug">
                        Observabilité et Supervision des Environnements Numériques
                    </p>

                    <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Une solution unifiée pour la métrologie en temps réel, la cartographie globale de votre parc et la détection d'anomalies assistée par IA.
                    </p>
                </div>

                {/* Boutons d'accès principaux */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 max-w-md mx-auto sm:max-w-none">
                    <button
                        onClick={() => keycloak.login()}
                        className="w-full sm:w-auto px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl shadow-lg shadow-cyan-600/30 hover:shadow-cyan-600/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
                    >
                        <span>🔐</span> Se connecter au portail
                    </button>

                    <button
                        onClick={() => keycloak.register()}
                        className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-300 shadow-sm transition hover:border-slate-400"
                    >
                        Créer un compte
                    </button>
                </div>
            </section>

            {/* 📊 SECTION MODULES FONCTIONNELS */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Module 1 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-110 transition-transform">
                        📈
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mb-2">Supervision & Métriques</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Suivi continu de la charge système, de la consommation des ressources et de la disponibilité des équipements critiques.
                    </p>
                </div>

                {/* Module 2 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-110 transition-transform">
                        🌐
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mb-2">Topologie du Parc</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Cartographie interactive et dynamique des nœuds réseau pour une détection proactive et une résolution rapide des incidents.
                    </p>
                </div>

                {/* Module 3 - Intelligence Artificielle & Analyse Prédictive */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-110 transition-transform">
                        🤖
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mb-2">Intelligence Artificielle</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Analyse prédictive des pannes, détection d'anomalies sur les flux et recommandations automatiques pour l'optimisation des performances SRE.
                    </p>
                </div>

            </section>

            {/* ⚡ FOOTER */}
            <footer className="border-t border-slate-200/80 pt-8 text-center text-xs text-slate-500">
                <p>OBSEN — Plateforme d'Observabilité & SRE Centralisée</p>
            </footer>

        </div>
    );
}