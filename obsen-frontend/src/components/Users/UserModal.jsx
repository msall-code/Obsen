import React, { useState } from 'react';
import { createUser } from '../../services/userService';

const UserModal = ({ isOpen, onClose, onUserCreated }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        region: '',
        role: 'USER',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUser(formData);
            onUserCreated();
            onClose();
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Ajouter un Utilisateur</h2>
                <form onSubmit={handleSubmit}>
                    <input className="w-full border p-2 mb-2" name="username" placeholder="Identifiant" onChange={handleChange} required />
                    <input className="w-full border p-2 mb-2" name="email" type="email" placeholder="Email" onChange={handleChange} required />
                    <input className="w-full border p-2 mb-2" name="password" type="password" placeholder="Mot de passe" onChange={handleChange} required />
                    <input className="w-full border p-2 mb-2" name="firstName" placeholder="Prénom" onChange={handleChange} />
                    <input className="w-full border p-2 mb-2" name="lastName" placeholder="Nom" onChange={handleChange} />
                    <input className="w-full border p-2 mb-2" name="region" placeholder="Région" onChange={handleChange} />
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Annuler</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Créer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;