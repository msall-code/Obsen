import React, { useState } from 'react';

export default function CreateRoleModal({ isOpen, onClose, onSave }) {
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name: roleName.toUpperCase(), description });
    setRoleName('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Créer un nouveau rôle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="create-role-name" className="block text-sm font-medium text-gray-700">
              Nom du rôle
            </label>
            <input
              id="create-role-name"
              type="text"
              placeholder="ex: MANAGER"
              className="mt-1 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="create-role-description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="create-role-description"
              className="mt-1 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Créer le rôle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}