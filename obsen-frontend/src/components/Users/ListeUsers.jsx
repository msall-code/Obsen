import React from "react";

export default function ListeUsers({ users, onDelete }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
          <tr>
            <th className="px-6 py-3">Utilisateur</th>
            <th className="px-6 py-3">E-mail</th>
            <th className="px-6 py-3">Rôle</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-slate-300">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-slate-800/50">
              <td className="px-6 py-4 font-medium text-white">{user.username}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  user.role === "ADMIN" ? "bg-purple-500/20 text-purple-300" : "bg-cyan-500/20 text-cyan-300"
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onDelete(user.id)}
                  className="text-red-400 hover:text-red-300 text-xs font-medium cursor-pointer"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}