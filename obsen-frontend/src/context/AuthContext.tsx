import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import API, { setAccessToken } from '../api/axios';

interface AuthContextType {
    user: any;
    login: (credentials: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('token');
    }, []);

    const login = async (credentials: any) => {
        const response = await API.post('/auth/login', credentials);
        const { token, user: userData } = response.data;

        setAccessToken(token);
        setUser(userData);
    };

    const logout = () => {
        setAccessToken(null);
        setUser(null);
        API.post('/auth/logout').catch(() => { });
    };

    // Correctif S6481: Utilisation de useMemo pour stabiliser l'objet de valeur du contexte
    const authContextValue = useMemo(() => ({
        user,
        login,
        logout,
        isAuthenticated: !!user
    }), [user]);

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth doit être utilisé dans un AuthProvider");
    return context;
};