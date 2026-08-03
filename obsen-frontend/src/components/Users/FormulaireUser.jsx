import React, { useState } from "react";

export default function FormulaireUser({ onUserCreated }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "USER",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUserCreated(formData);
    setFormData({ username: "", email: "", firstName: "", lastName: "", role: "USER" });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-bold text-white mb-2">Ajouter un Utilisateur</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-400">Nom d'utilisateur *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#1b82a4]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400">E-mail *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#1b82a4]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400">Prénom</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#1b82a4]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400">Nom</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full mt-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#1b82a4]"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-400">Rôle</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full mt-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#1b82a4]"
        >
          <option value="USER">Opérateur (USER)</option>
          <option value="ADMIN">Administrateur (ADMIN)</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-[#1b82a4] hover:bg-[#14637d] text-white font-semibold px-4 py-2 rounded text-sm transition cursor-pointer"
      >
        Créer l'utilisateur
      </button>
    </form>
  );
}