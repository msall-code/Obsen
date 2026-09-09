import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../../services/userService';

export default function UserCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    enabled: true,
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roles = await userService.getAvailableRoles();
        setAvailableRoles(roles);
        if (roles.length > 0) {
          setSelectedRoleId(roles[0].id);
        }
      } catch (err) {
        console.error('Erreur chargement des rôles:', err);
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Structure des données conforme à la Keycloak Admin REST API
    const payload = {
      username: formData.username,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      enabled: formData.enabled,
      emailVerified: true,
      credentials: [
        {
          type: 'password',
          value: formData.password,
          temporary: false,
        },
      ],
    };

    try {
      const targetRole = availableRoles.find((r) => r.id === selectedRoleId);
      await userService.createUser(payload, targetRole);
      navigate('/admin/users');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-bold text-slate-800">➕ Créer un utilisateur</h1>
        <p className="text-xs text-slate-500 mt-1">
          Ajouter un nouveau compte au Realm Keycloak et lui assigner un rôle.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="create-username" className="text-xs font-semibold text-slate-500 uppercase">
            Nom d'utilisateur
          </label>
          <input
            id="create-username"
            type="text"
            required
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full mt-1 p-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="create-email" className="text-xs font-semibold text-slate-500 uppercase">
            Adresse Email
          </label>
          <input
            id="create-email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full mt-1 p-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="create-firstName" className="text-xs font-semibold text-slate-500 uppercase">
              Prénom
            </label>
            <input
              id="create-firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full mt-1 p-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="create-lastName" className="text-xs font-semibold text-slate-500 uppercase">
              Nom
            </label>
            <input
              id="create-lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full mt-1 p-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="create-password" className="text-xs font-semibold text-slate-500 uppercase">
            Mot de passe
          </label>
          <input
            id="create-password"
            type="password"
            required
            minLength={6}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full mt-1 p-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="create-role" className="text-xs font-semibold text-slate-500 uppercase">
            Rôle Keycloak
          </label>
          {rolesLoading ? (
            <p className="text-xs text-slate-400 mt-1">Chargement des rôles...</p>
          ) : (
            <select
              id="create-role"
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full mt-1 p-2.5 border border-slate-300 rounded-xl text-sm outline-none bg-white focus:border-blue-500"
            >
              {availableRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/users')}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading || rolesLoading}
            className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Création...' : "Créer l'utilisateur"}
          </button>
        </div>
      </form>
    </div>
  );
}