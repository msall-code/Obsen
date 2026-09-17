import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';

export interface User {
    keycloakId: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
}

interface EditUserModalProps {
    user: User;
    onClose: () => void;
    onRefresh: () => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onRefresh }) => {
    const [formData, setFormData] = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        password: '',
    });

    const [selectedRoles, setSelectedRoles] = useState<string[]>(user.roles || []);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleRoleToggle = (role: string) => {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(selectedRoles.filter((r) => r !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null);

        try {
            // 1. Mise à jour des informations utilisateur (Prénom, Nom, Email, Mot de passe)
            const userPayload: Record<string, string> = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
            };

            if (formData.password.trim() !== '') {
                userPayload.password = formData.password;
            }

            await axiosInstance.put(`/api/v1/identity/users/${user.keycloakId}`, userPayload);

            // 2. Mise à jour des rôles (Conforme à UpdateRolesRequest Java)
            await axiosInstance.put(
                `/api/v1/identity/users/${user.keycloakId}/roles`,
                { roles: selectedRoles }
            );

            onRefresh();
            onClose();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            console.error("Erreur lors de la mise à jour :", error.response?.data || err);
            setErrorMessage(
                error.response?.data?.message || "Une erreur est survenue lors de la mise à jour des rôles."
            );
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>Éditer l'utilisateur : {user.username}</h3>
                {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="firstName">Prénom :</label>
                        <input
                            id="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="lastName">Nom :</label>
                        <input
                            id="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="email">Email :</label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="password">Nouveau mot de passe (optionnel) :</label>
                        <input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <fieldset style={{ marginTop: '15px', border: 'none', padding: 0 }}>
                        <legend id="roles-label">Rôles attribués :</legend>
                        <div>
                            <label htmlFor="role-user">
                                <input
                                    id="role-user"
                                    type="checkbox"
                                    checked={selectedRoles.includes('User') || selectedRoles.includes('ROLE_USER') || selectedRoles.includes('USER')}
                                    onChange={() => handleRoleToggle('User')}
                                />
                                {' User'}
                            </label>

                            <label htmlFor="role-admin" style={{ marginLeft: '10px' }}>
                                <input
                                    id="role-admin"
                                    type="checkbox"
                                    checked={selectedRoles.includes('Admin') || selectedRoles.includes('ROLE_ADMIN') || selectedRoles.includes('ADMIN')}
                                    onChange={() => handleRoleToggle('Admin')}
                                />
                                {' Admin'}
                            </label>
                        </div>
                    </fieldset>

                    <div style={{ marginTop: '20px' }}>
                        <button type="submit">Enregistrer</button>
                        <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const UserManagementTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/api/v1/identity/users');
            const data = response.data;

            if (Array.isArray(data)) {
                setUsers(data);
            } else if (data && Array.isArray((data as { content?: User[] }).content)) {
                setUsers((data as { content: User[] }).content);
            } else {
                console.error("Format de réponse inattendu pour les utilisateurs :", data);
                setUsers([]);
            }
        } catch (err) {
            console.error('Erreur lors du chargement des utilisateurs', err);
            setUsers([]);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <h3>Gestion des Utilisateurs</h3>
            <table>
                <thead>
                    <tr>
                        <th>Nom d'utilisateur</th>
                        <th>Email</th>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Rôles</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(users) && users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.keycloakId}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.roles?.join(', ')}</td>
                                <td>
                                    <button onClick={() => setSelectedUser(user)}>Éditer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} style={{ textAlign: 'center' }}>
                                Aucun utilisateur trouvé.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onRefresh={fetchUsers}
                />
            )}
        </div>
    );
};