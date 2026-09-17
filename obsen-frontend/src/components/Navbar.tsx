import { Link } from 'react-router-dom';
import keycloak from '../config/keycloak';

export const Navbar = () => {
    const roles = keycloak.realmAccess?.roles || [];
    const isAdmin = roles.includes('ADMIN');

    return (
        <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#eee', marginBottom: '1rem' }}>
            <Link to="/">Dashboard</Link>
            <Link to="/profile">Mon Profil</Link>

            {/* Afficher le lien Admin uniquement si l'utilisateur possède le rôle ADMIN */}
            {isAdmin && (
                <Link to="/admin" style={{ color: 'red', fontWeight: 'bold' }}>
                    Administration
                </Link>
            )}

            <button onClick={() => keycloak.logout()} style={{ marginLeft: 'auto' }}>
                Déconnexion
            </button>
        </nav>
    );
};