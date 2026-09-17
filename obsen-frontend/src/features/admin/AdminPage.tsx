import { UserManagementTable } from '../identity/components/UserManagementTable';

export const AdminPage = () => {
    return (
        <div style={{ padding: '1rem' }}>
            <h2 style={{ color: '#2c3e50' }}>Panneau d'Administration Obsen</h2>
            <p>Bienvenue dans l'espace de gestion. Seuls les comptes avec le rôle <strong>ADMIN</strong> peuvent accéder à cette section.</p>

            <UserManagementTable />
        </div>
    );
};