import React, { useEffect, useState } from 'react';
import { getUsers, createUser, deleteUser } from '../services/userService';
import UserModal from '../components/users/UserModal';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Erreur lors du chargement des utilisateurs', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (userData) => {
        await createUser(userData);
        fetchUsers();
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Voulez-vous supprimer cet utilisateur ?')) {
            await deleteUser(id);
            fetchUsers();
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    + Ajouter Utilisateur
                </button>
            </div>

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-3">Nom</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Région</th>
                                <th className="p-3">Rôle</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{u.firstName} {u.lastName} ({u.username})</td>
                                    <td className="p-3">{u.email}</td>
                                    <td className="p-3">{u.region || 'N/A'}</td>
                                    <td className="p-3">{u.role}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleDeleteUser(u.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUserCreated={handleCreateUser}
            />
        </div>
    );
};

export default UsersPage;