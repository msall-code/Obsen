import React, { createContext, useContext, useState, useEffect } from 'react';
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
        // PURGE AUTOMATIQUE : On nettoie d'éventuels reliquats de jetons restés dans le localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('token');
    }, []);

    const login = async (credentials: any) => {
        // Appel API vers le Backend
        const response = await API.post('/auth/login', credentials);
        const { token, user: userData } = response.data;

        // SÉCURITÉ MAXIMALE : On garde le token uniquement dans la mémoire JS (Axios / State)
        setAccessToken(token);
        setUser(userData);
    };

    const logout = () => {
        setAccessToken(null);
        setUser(null);
        // Optionnel : Appel à l'endpoint de logout pour invalider le cookie côté serveur
        API.post('/auth/logout').catch(() => { });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth doit être utilisé dans un AuthProvider");
    return context;
};