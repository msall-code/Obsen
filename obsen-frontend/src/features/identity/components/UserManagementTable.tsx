import { useEffect, useState, useMemo } from 'react';
import { getAllUsers, deleteUserById } from '../services/identityService';
import type { UserProfile } from '../types';
import { RoleManagerModal } from './RoleManagerModal';

const ITEMS_PER_PAGE = 5;

export const UserManagementTable = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // États pour la recherche et la pagination
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);

    // État pour gérer le modal d'édition des rôles
    const [selectedUserForRoles, setSelectedUserForRoles] = useState<UserProfile | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data);
            setError(null);
        } catch (err: unknown) {
            console.error('Erreur chargement utilisateurs :', err);
            setError('Impossible de charger la liste des utilisateurs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const term = searchTerm.toLowerCase();
            return (
                user.username.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term) ||
                `${user.firstName} ${user.lastName}`.toLowerCase().includes(term)
            );
        });
    }, [users, searchTerm]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    const handleDelete = async (keycloakId: string, username: string) => {
        if (window.confirm(`Voulez-vous vraiment supprimer l'utilisateur "${username}" ?`)) {
            try {
                await deleteUserById(keycloakId);
                setUsers((prev) => prev.filter((u) => u.keycloakId !== keycloakId));
            } catch (err: unknown) {
                console.error('Erreur lors de la suppression :', err);
                alert('Échec de la suppression. Vérifiez vos permissions ADMIN.');
            }
        }
    };

    if (loading) return <p>Chargement des utilisateurs...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ marginTop: '1.5rem' }}>
            <h3>Liste des Utilisateurs ({filteredUsers.length})</h3>

            {/* Barre de recherche */}
            <div style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Rechercher par nom, email ou username..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{
                        padding: '8px 12px',
                        width: '100%',
                        maxWidth: '400px',
                        borderRadius: '4px',
                        border: '1px solid #ccc'
                    }}
                />
            </div>

            {/* Tableau des données */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Username</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Nom Complet</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Email</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Statut</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.length > 0 ? (
                        paginatedUsers.map((user) => (
                            <tr key={user.keycloakId}>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{user.username}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{user.firstName} {user.lastName}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{user.email}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                    <span style={{ color: user.active ? 'green' : 'red', fontWeight: 'bold' }}>
                                        {user.active ? 'Actif' : 'Inactif'}
                                    </span>
                                </td>
                                <td style={{ padding: '8px', border: '1px solid #ddd', display: 'flex', gap: '8px' }}>
                                    {/* Bouton pour ouvrir le modal d'édition des rôles */}
                                    <button
                                        onClick={() => setSelectedUserForRoles(user)}
                                        style={{
                                            backgroundColor: '#2563eb',
                                            color: 'white',
                                            border: 'none',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Gérer les Rôles
                                    </button>

                                    {/* Bouton de suppression */}
                                    <button
                                        onClick={() => handleDelete(user.keycloakId, user.username)}
                                        style={{
                                            backgroundColor: '#d9534f',
                                            color: 'white',
                                            border: 'none',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} style={{ textAlign: 'center', padding: '12px' }}>
                                Aucun utilisateur trouvé.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    style={{ padding: '6px 12px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                >
                    Précédent
                </button>

                <span>
                    Page <strong>{currentPage}</strong> sur <strong>{totalPages}</strong>
                </span>

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    style={{ padding: '6px 12px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                >
                    Suivant
                </button>
            </div>

            {/* Affichage conditionnel du modal */}
            {selectedUserForRoles && (
                <RoleManagerModal
                    keycloakId={selectedUserForRoles.keycloakId}
                    username={selectedUserForRoles.username}
                    currentRoles={selectedUserForRoles.roles || []}
                    onClose={() => setSelectedUserForRoles(null)}
                    onSuccess={() => {
                        fetchUsers(); // Rafraîchir la liste après modification des rôles
                    }}
                />
            )}
        </div>
    );
};