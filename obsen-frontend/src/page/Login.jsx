import React, { useEffect } from 'react';
import keycloak from '../keycloak';

const Login = () => {
    useEffect(() => {
        if (!keycloak.authenticated) {
            keycloak.login();
        } else {
            window.location.href = '/dashboard';
        }
    }, []);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="p-6 bg-white rounded shadow-md text-center">
                <h2 className="text-lg font-bold mb-2">Redirection vers la connexion...</h2>
                <p className="text-gray-600">Veuillez patienter.</p>
            </div>
        </div>
    );
};

export default Login;