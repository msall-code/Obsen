import React, { useState, useEffect } from 'react';
import {
    getUsersApi,
    updateUserStatusApi,
    assignRoleToUserApi,
    deleteUserApi
} from '../api/admin';
import {
    Users, UserCheck, UserX, Shield,
    Plus, Trash2, Search, RefreshCw, AlertCircle, CheckCircle2
} from 'lucide-react';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [roleInput, setRoleInput] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const response = await getUsersApi();
            setUsers(response.data);
        } catch (err) {
            console.error("Erreur lors de la récupération des utilisateurs Keycloak :", err);
            showNotify("Erreur lors du chargement des utilisateurs.", true);
        } finally {
            setLoading(false);
        }
    };

    const showNotify = (msg, isError = false) => {
        setNotification({ msg, isError });
        setTimeout(() => setNotification(null), 3500);
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            await updateUserStatusApi(userId, !currentStatus);
            showNotify(`Statut de l'utilisateur mis à jour.`);
            loadUsers();
        } catch (err) {
            console.error("Erreur lors de la mise à jour du statut :", err);
            showNotify("Échec de la mise à jour du statut.", true);
        }
    };

    const handleAssignRole = async (userId) => {
        if (!roleInput.trim()) return;
        try {
            await assignRoleToUserApi(userId, roleInput.trim().toUpperCase());
            showNotify(`Rôle ${roleInput.toUpperCase()} attribué avec succès.`);
            setRoleInput('');
            setSelectedUserId(null);
            loadUsers();
        } catch (err) {
            console.error("Erreur d'attribution de rôle :", err);
            showNotify("Impossible d'attribuer le rôle.", true);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur Keycloak ?")) return;
        try {
            await deleteUserApi(userId);
            showNotify("Utilisateur supprimé.");
            loadUsers();
        } catch (err) {
            console.error("Erreur lors de la suppression de l'utilisateur :", err);
            showNotify("Erreur lors de la suppression.", true);
        }
    };

    const filteredUsers = users.filter(u =>
        u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderTableBody = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">Chargement des données...</td>
                </tr>
            );
        }

        if (filteredUsers.length === 0) {
            return (
                <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">Aucun utilisateur trouvé.</td>
                </tr>
            );
        }

        return (
            <>
                {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-850/40 transition">
                        <td className="p-4 font-bold text-white">{u.username}</td>
                        <td className="p-4 text-slate-400">{u.email || 'N/A'}</td>
                        <td className="p-4">
                            {u.enabled ? (
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-1 rounded-full">Actif</span>
                            ) : (
                                <span className="bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-bold px-2.5 py-1 rounded-full">Désactivé</span>
                            )}
                        </td>
                        <td className="p-4">
                            <div className="flex flex-wrap gap-1.5 items-center">
                                {(u.roles || ['USER']).map((role) => (
                                    <span key={`${u.id}-${role}`} className="bg-slate-800 text-slate-300 border border-slate-700/80 text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center space-x-1">
                                        <Shield className="w-3 h-3 text-emerald-400" />
                                        <span>{role}</span>
                                    </span>
                                ))}
                                <button
                                    onClick={() => setSelectedUserId(selectedUserId === u.id ? null : u.id)}
                                    className="p-1 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 rounded-md transition"
                                    title="Ajouter un rôle"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {selectedUserId === u.id && (
                                <div className="mt-2 flex items-center space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Ex: ADMIN, OBSERVER"
                                        value={roleInput}
                                        onChange={(e) => setRoleInput(e.target.value)}
                                        className="bg-slate-950 border border-slate-700 text-xs px-2.5 py-1 rounded text-white focus:outline-none focus:border-emerald-400"
                                    />
                                    <button
                                        onClick={() => handleAssignRole(u.id)}
                                        className="bg-emerald-500 text-slate-950 font-bold text-xs px-2.5 py-1 rounded hover:bg-emerald-400 transition"
                                    >
                                        Attribuer
                                    </button>
                                </div>
                            )}
                        </td>
                        <td className="p-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                                <button
                                    onClick={() => handleToggleStatus(u.id, u.enabled)}
                                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
                                    title={u.enabled ? "Désactiver le compte" : "Activer le compte"}
                                >
                                    {u.enabled ? <UserX className="w-4 h-4 text-amber-400" /> : <UserCheck className="w-4 h-4 text-emerald-400" />}
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition hover:text-red-400"
                                    title="Supprimer l'utilisateur"
                                >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
                        <Users className="w-7 h-7 text-emerald-400" />
                        <span>Gestion des Utilisateurs Keycloak</span>
                    </h1>
                    <p className="text-slate-400 text-sm">Gérez les accès, les statuts et les privilèges du Realm Obsen.</p>
                </div>

                <button
                    onClick={loadUsers}
                    className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl border border-slate-800 transition shadow-lg self-start md:self-auto"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Rafraîchir</span>
                </button>
            </div>

            {notification && (
                <div className={`p-4 rounded-xl border flex items-center space-x-3 transition ${notification.isError ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    }`}>
                    {notification.isError ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                    <span className="text-sm font-medium">{notification.msg}</span>
                </div>
            )}

            <div className="relative">
                <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Rechercher par nom d'utilisateur ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-800 text-slate-200 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 transition text-sm"
                />
            </div>

            <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-900/90 text-slate-400 text-xs font-bold uppercase border-b border-slate-800">
                        <tr>
                            <th className="p-4">Utilisateur</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Statut</th>
                            <th className="p-4">Rôles Keycloak</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-sm">
                        {renderTableBody()}
                    </tbody>
                </table>
            </div>
        </div>
    );
}