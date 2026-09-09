import React, { useState, useEffect } from 'react';
import { userService } from '../../../services/userService';

export default function UserEditModal({ user, isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
    });

    const [roles, setRoles] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [selectedRoleId, setSelectedRoleId] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                username: user.username || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
            });

            const loadRoleData = async () => {
                setLoading(true);
                try {
                    const [allRoles, currentRoles] = await Promise.all([
                        userService.getAvailableRoles(),
                        userService.getUserRoles(user.id),
                    ]);

                    const filteredAll = allRoles.filter(
                        (r) => !['default-roles-obsen-realm', 'offline_access', 'uma_authorization'].includes(r.name)
                    );

                    setRoles(filteredAll);
                    setUserRoles(currentRoles);

                    const currentCustomRole = currentRoles.find((r) =>
                        filteredAll.some((fa) => fa.id === r.id)
                    );

                    if (currentCustomRole) {
                        setSelectedRoleId(currentCustomRole.id);
                    } else {
                        setSelectedRoleId('');
                    }
                } catch (err) {
                    console.error('Erreur lors du chargement des rôles:', err);
                } finally {
                    setLoading(false);
                }
            };

            loadRoleData();
        }
    }, [user, isOpen]);

    if (!isOpen || !user) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const cleanUsername = formData.username.trim() || formData.email.trim();

        try {
            const targetRole = roles.find((r) => r.id === selectedRoleId);

            await onSave(
                user.id,
                {
                    ...user,
                    username: cleanUsername,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                },
                targetRole,
                userRoles
            );

            onClose();
        } catch (err) {
            alert(err.message || "Erreur lors de l'enregistrement des modifications.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-800">
                        ✏️ Modifier @{formData.username || user.username}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 font-bold"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label htmlFor="edit-username" className="text-xs font-semibold text-slate-500 uppercase">
                            Nom d'utilisateur (Username) *
                        </label>
                        <input
                            id="edit-username"
                            type="text"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full mt-1 p-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-firstName" className="text-xs font-semibold text-slate-500 uppercase">
                            Prénom
                        </label>
                        <input
                            id="edit-firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full mt-1 p-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-lastName" className="text-xs font-semibold text-slate-500 uppercase">
                            Nom
                        </label>
                        <input
                            id="edit-lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full mt-1 p-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-email" className="text-xs font-semibold text-slate-500 uppercase">
                            Email *
                        </label>
                        <input
                            id="edit-email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full mt-1 p-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-role" className="text-xs font-semibold text-slate-500 uppercase">
                            Rôle Keycloak
                        </label>
                        {loading ? (
                            <p className="text-xs text-slate-400 mt-1">Chargement des rôles Keycloak...</p>
                        ) : (
                            <select
                                id="edit-role"
                                value={selectedRoleId}
                                onChange={(e) => setSelectedRoleId(e.target.value)}
                                className="w-full mt-1 p-2.5 border border-slate-300 rounded-xl text-sm outline-none bg-white focus:border-blue-500"
                            >
                                <option value="">-- Sans rôle --</option>
                                {roles.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition disabled:opacity-50"
                        >
                            {saving ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}