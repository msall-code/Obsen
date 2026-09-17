import { useEffect, useState } from 'react';
import keycloak from '../../config/keycloak';
import { getMyProfile } from './services/identityService';
import type { UserProfile } from './types';

export const UserProfileComponent = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        getMyProfile().then(setProfile).catch(console.error);
    }, []);

    if (!profile) return <p>Chargement du profil...</p>;

    return (
        <div>
            <h2>Bienvenue {profile.firstName}</h2>
            <button onClick={() => keycloak.logout()}>Se déconnecter</button>
        </div>
    );
};