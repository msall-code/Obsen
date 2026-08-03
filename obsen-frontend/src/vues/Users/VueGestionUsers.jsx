import React, { useState } from "react";
import FormulaireUser from "../../components/Users/FormulaireUser";
import ListeUsers from "../../components/Users/ListeUsers";

export default function VueGestionUsers() {
  const [users, setUsers] = useState([
    { id: 1, username: "admin", email: "admin@obsen.internal", role: "ADMIN" },
    { id: 2, username: "operator1", email: "op1@obsen.internal", role: "USER" },
  ]);

  const handleUserCreated = (newUser) => {
    setUsers([...users, { ...newUser, id: Date.now() }]);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Gestion des Utilisateurs</h1>
        <p className="text-xs text-slate-400 mt-1">Gérez les accès et les comptes d'opérateurs OBSEN.</p>
      </div>

      <FormulaireUser onUserCreated={handleUserCreated} />
      <ListeUsers users={users} onDelete={handleDeleteUser} />
    </div>
  );
}