import React, { createContext, useContext, useState, useEffect } from 'react';
import keycloak from '../keycloak';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(keycloak.token);

    useEffect(() => {
        if (keycloak.authenticated) {
            keycloak.loadUserProfile().then((profile) => {
                setUser({
                    ...profile,
                    roles: keycloak.realmAccess ? keycloak.realmAccess.roles : [],
                });
            });
        }
    }, []);

    const logout = () => {
        keycloak.logout({ redirectUri: window.location.origin });
    };

    return (
        <AuthContext.Provider value={{ user, token, logout, keycloak }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);