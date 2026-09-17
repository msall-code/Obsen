import React, { useState } from 'react';
import { updateUser } from '../services/identityService';
import type { UserProfile } from '../types';

interface EditUserModalProps {
    user: UserProfile;
    onClose: () => void;
    onSuccess: () => void;
}

export const EditUserModal = ({ user, onClose, onSuccess }: EditUserModalProps) => {
    const [firstName, setFirstName] = useState(user.firstName || '');
    const [lastName, setLastName] = useState(user.lastName || '');
    const [email, setEmail] = useState(user.email || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateUser(user.keycloakId, { firstName, lastName, email });
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Erreur mise à jour utilisateur :', err);
            alert('Échec de la modification.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', width: '400px' }}>
                <h3>Éditer {user.username}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    <div>
                        <label htmlFor="firstName" style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Prénom</label>
                        <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Nom</label>
                        <input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} disabled={loading}>Annuler</button>
                        <button type="submit" disabled={loading} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px' }}>
                            {loading ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};