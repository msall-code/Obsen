import React, { useState } from 'react';
import { userService } from '../../../services/userService';

export default function CreateRoleModal({ isOpen, onClose, onRoleCreated }) {
    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!roleName.trim()) return;

        setLoading(true);
        try {
            await userService.createRole({ name: roleName.trim(), description });
            setRoleName('');
            setDescription('');
            onRoleCreated();
            onClose();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span>🛡️</span> Créer un nouveau Rôle Keycloak
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="role-name" className="text-xs font-semibold text-slate-500 uppercase">
                            Nom du Rôle (Ex: ROLE_MANAGER)
                        </label>
                        <input
                            id="role-name"
                            type="text"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            placeholder="ROLE_EXEMPLE"
                            required
                            className="w-full mt-1 p-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="role-description" className="text-xs font-semibold text-slate-500 uppercase">
                            Description
                        </label>
                        <textarea
                            id="role-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description des accès autorisés..."
                            rows={3}
                            className="w-full mt-1 p-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500 resize-none"
                        />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition disabled:opacity-50"
                        >
                            {loading ? 'Création...' : 'Créer le rôle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}