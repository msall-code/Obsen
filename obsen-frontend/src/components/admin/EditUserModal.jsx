import React, { useState, useEffect } from 'react';

export default function EditUserModal({ isOpen, onClose, user, roles, onSave }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setRole(user.roles?.[0] || (roles[0]?.name || roles[0] || 'ROLE_USER'));
    }
  }, [user, roles]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(user.id, { firstName, lastName, email, role });
  };

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-lg font-extrabold text-slate-900">Modifier l'Utilisateur</h3>
          <p className="text-xs text-slate-500">Mettez à jour les informations et réaffectez un rôle.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Prénom</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none font-medium text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nom</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none font-medium text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none font-medium text-sm"
              required
            />
          </div>

          {/* SÉLECTEUR DE RÔLE */}
          <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
            <label className="block text-xs font-bold text-indigo-900 uppercase mb-1">Changer le Rôle</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 bg-white text-slate-900 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-sm cursor-pointer"
            >
              {roles.map((r, idx) => {
                const roleName = r.name || r;
                return (
                  <option key={r.id || idx} value={roleName}>
                    {roleName}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}