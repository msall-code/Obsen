import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

export default function UserRoles({ user }) {
    const [allRoles, setAllRoles] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.id) {
            fetchRolesData();
        }
    }, [user]);

    const fetchRolesData = async () => {
        setLoading(true);
        try {
            const [available, assigned] = await Promise.all([
                adminService.getRealmRoles(),
                adminService.getUserRoles(user.id)
            ]);
            setAllRoles(available);
            setUserRoles(assigned);
        } catch (err) {
            console.error('Erreur lors du chargement des rôles :', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignRole = async () => {
        if (!selectedRole) return;
        const roleObj = allRoles.find((r) => r.name === selectedRole);
        if (!roleObj) return;

        try {
            await adminService.assignRoleToUser(user.id, [roleObj]);
            fetchRolesData();
            setSelectedRole('');
        } catch (err) {
            console.error("Erreur lors de l'attribution :", err);
        }
    };

    const handleRemoveRole = async (roleObj) => {
        try {
            await adminService.removeRoleFromUser(user.id, [roleObj]);
            fetchRolesData();
        } catch (err) {
            console.error('Erreur lors de la suppression :', err);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
                Gestion des rôles pour : <span className="text-blue-600">{user.username}</span>
            </h3>

            {loading ? (
                <p className="text-gray-500 text-sm">Chargement des rôles...</p>
            ) : (
                <>
                    <div className="mb-4">
                        <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">Rôles actuels :</h4>
                        <div className="flex flex-wrap gap-2">
                            {userRoles.length === 0 && <span className="text-sm text-gray-400">Aucun rôle attribué</span>}
                            {userRoles.map((role) => (
                                <span
                                    key={role.id}
                                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full"
                                >
                                    {role.name}
                                    <button
                                        onClick={() => handleRemoveRole(role)}
                                        className="hover:text-red-600 font-bold ml-1"
                                        title="Retirer ce rôle"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 items-center">
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-md text-sm outline-none"
                        >
                            <option value="">-- Sélectionner un rôle à ajouter --</option>
                            {allRoles
                                .filter((r) => !userRoles.some((ur) => ur.name === r.name))
                                .map((r) => (
                                    <option key={r.id} value={r.name}>
                                        {r.name}
                                    </option>
                                ))}
                        </select>
                        <button
                            onClick={handleAssignRole}
                            disabled={!selectedRole}
                            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            Ajouter
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}