import React, { useState } from 'react';
import { adminService } from '../../services/adminService';

export default function CreateRole({ onRoleCreated }) {
    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!roleName.trim()) return;

        setLoading(true);
        setMessage(null);

        try {
            await adminService.createRole(roleName.trim(), description.trim());
            setMessage({ type: 'success', text: `Rôle "${roleName}" créé avec succès !` });
            setRoleName('');
            setDescription('');
            if (onRoleCreated) onRoleCreated();
        } catch (err) {
            console.error('Erreur lors de la création du rôle :', err);
            setMessage({ type: 'error', text: 'Impossible de créer le rôle (vérifiez si le rôle existe déjà ou vos droits).' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-800">➕ Créer un nouveau rôle</h2>

            {message && (
                <div className={`p-3 mb-4 text-sm rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du rôle
                    </label>
                    <input
                        id="roleName"
                        type="text"
                        required
                        placeholder="ex: ROLE_MANAGER"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div>
                    <label htmlFor="roleDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        Description (optionnelle)
                    </label>
                    <textarea
                        id="roleDescription"
                        placeholder="Description des permissions..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        rows="3"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Création en cours...' : 'Créer le rôle'}
                </button>
            </form>
        </div>
    );
}