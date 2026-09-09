import React from 'react';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
            <h1 className="text-6xl font-extrabold text-red-600 mb-2">403</h1>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Accès non autorisé</h2>
            <p className="text-gray-600 mb-6">
                Vous n'avez pas les privilèges nécessaires pour accéder à cette page.
            </p>
            <Link
                to="/"
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
            >
                Retour au tableau de bord
            </Link>
        </div>
    );
}