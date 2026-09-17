import { useEffect, useState } from 'react';
import keycloak from '../../../config/keycloak';
import { getMyProfile } from '../services/identityService';
import type { UserProfile } from '../types';

export const ProfileCard = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getMyProfile()
            .then((data: UserProfile) => {
                setProfile(data);
                setLoading(false);
            })
            .catch((err: unknown) => {
                console.error('Erreur profil :', err);
                setError('Impossible de charger le profil.');
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!profile) return null;

    return (
        <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>{profile.firstName} {profile.lastName}</h3>
            <p>Email : {profile.email}</p>
            <p>Nom d'utilisateur : {profile.username}</p>
            <button onClick={() => keycloak.logout()}>Déconnexion</button>
        </div>
    );
};