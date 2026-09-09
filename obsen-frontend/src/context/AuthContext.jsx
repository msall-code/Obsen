import React, { createContext, useContext, useState, useMemo } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user] = useState({
        username: 'admin_obsen',
        email: 'admin@obsen.sn',
        roles: ['ROLE_ADMIN', 'ROLE_USER'],
    });

    const value = useMemo(() => {
        const hasRole = (requiredRoles) => {
            if (!requiredRoles || requiredRoles.length === 0) return true;
            return requiredRoles.some((role) => user?.roles?.includes(role));
        };

        return { user, hasRole };
    }, [user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);