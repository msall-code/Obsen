import { useState } from 'react';
import { updateUserRoles } from '../services/identityService';

interface RoleManagerModalProps {
    keycloakId: string;
    username: string;
    currentRoles: string[];
    onClose: () => void;
    onSuccess: () => void;
}

export const RoleManagerModal = ({
    keycloakId,
    username,
    currentRoles,
    onClose,
    onSuccess,
}: RoleManagerModalProps) => {
    const [isAdmin, setIsAdmin] = useState<boolean>(currentRoles.includes('ADMIN'));
    const [loading, setLoading] = useState<boolean>(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const updatedRoles = ['USER'];
            if (isAdmin) updatedRoles.push('ADMIN');

            await updateUserRoles(keycloakId, updatedRoles);
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Erreur modification rôles :', err);
            alert('Impossible de modifier les rôles.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', width: '350px' }}>
                <h3>Rôles de {username}</h3>
                <div style={{ margin: '1.5rem 0' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                        />
                        Rôle ADMINISTRATEUR (ADMIN)
                    </label>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button onClick={onClose} disabled={loading}>Annuler</button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px' }}
                    >
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </div>
        </div>
    );
};