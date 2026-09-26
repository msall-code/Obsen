import React, { useState, useEffect } from 'react';

export default function EditUserModal({ isOpen, onClose, user, roles, onSave }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.roles?.[0] || '',
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(user.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Éditer l'utilisateur</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-firstName" className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <input
              id="edit-firstName"
              type="text"
              className="mt-1 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="edit-lastName" className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              id="edit-lastName"
              type="text"
              className="mt-1 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="edit-email"
              type="email"
              className="mt-1 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700">
              Rôle
            </label>
            <select
              id="edit-role"
              className="mt-1 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="">-- Sélectionner un rôle --</option>
              {roles.map((r) => (
                <option key={r.id || r.name} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}