import React, { useEffect } from 'react';
import keycloak from '../services/keycloak';

const INACTIVITY_LIMIT_MS = 10 * 60 * 1000; // 10 minutes d'inactivité
const TOKEN_REFRESH_INTERVAL_MS = 30 * 1000; // Vérification toutes les 30 sec

export default function AutoLogout({ children }) {
    useEffect(() => {
        if (!keycloak.authenticated) return;

        let inactivityTimer;

        const resetInactivityTimer = () => {
            if (inactivityTimer) clearTimeout(inactivityTimer);

            inactivityTimer = setTimeout(() => {
                console.warn('⚠️ Inactivité détectée (10 min). Déconnexion...');
                keycloak.logout();
            }, INACTIVITY_LIMIT_MS);
        };

        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
        events.forEach((event) => window.addEventListener(event, resetInactivityTimer));
        resetInactivityTimer();

        // Rafraîchissement périodique préventif du token en arrière-plan
        const tokenInterval = setInterval(() => {
            if (keycloak.authenticated) {
                keycloak.updateToken(70).catch((err) => {
                    console.error('❌ Échec du rafraîchissement périodique. Déconnexion...', err);
                    keycloak.logout();
                });
            }
        }, TOKEN_REFRESH_INTERVAL_MS);

        return () => {
            if (inactivityTimer) clearTimeout(inactivityTimer);
            clearInterval(tokenInterval);
            events.forEach((event) => window.removeEventListener(event, resetInactivityTimer));
        };
    }, []);

    return children;
}