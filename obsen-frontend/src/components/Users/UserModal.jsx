import React, { useState } from 'react';

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

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await onUserCreated(formData);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la création');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Créer un nouvel utilisateur</h2>

                {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text"
                        name="username"
                        placeholder="Nom d'utilisateur"
                        required
                        className="w-full p-2 border rounded"
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        className="w-full p-2 border rounded"
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Mot de passe"
                        required
                        className="w-full p-2 border rounded"
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Prénom"
                        className="w-full p-2 border rounded"
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Nom"
                        className="w-full p-2 border rounded"
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="region"
                        placeholder="Région (ex: Dakar)"
                        className="w-full p-2 border rounded"
                        onChange={handleChange}
                    />

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded text-gray-600"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {loading ? 'Création...' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;