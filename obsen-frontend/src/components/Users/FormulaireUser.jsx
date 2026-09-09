import React, { useState, useEffect } from "react";

export default function FormulaireUser({
  userToEdit = null,
  availableRoles = [],
  onSubmit,
  onCancel,
  onRoleCreated,
  onRoleDeleted,
}) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    roles: [],
  });

  // Pour savoir si l'utilisateur a modifié le username à la main
  const [isUsernameCustomized, setIsUsernameCustomized] = useState(false);

  const [newRoleName, setNewRoleName] = useState("");
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [roleError, setRoleError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        username: userToEdit.username || "",
        email: userToEdit.email || "",
        firstName: userToEdit.firstName || "",
        lastName: userToEdit.lastName || "",
        password: "",
        roles: userToEdit.roles || [],
      });
      setIsUsernameCustomized(true);
    }
  }, [userToEdit]);

  const getRoleName = (role) => (typeof role === "object" ? role.name || role.roleName : role);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Si l'utilisateur tape son email et n'a pas personnalisé son username, on aligne le username sur l'email
      if (name === "email" && !isUsernameCustomized && !userToEdit) {
        updated.username = value;
      }

      return updated;
    });

    if (name === "username") {
      setIsUsernameCustomized(value.trim() !== "");
    }
  };

  const handleRoleToggle = (roleName) => {
    setFormData((prev) => {
      const exists = prev.roles.includes(roleName);
      const updatedRoles = exists
        ? prev.roles.filter((r) => r !== roleName)
        : [...prev.roles, roleName];
      return { ...prev, roles: updatedRoles };
    });
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    let cleanRoleName = newRoleName.trim().toUpperCase();

    if (cleanRoleName.startsWith("ROLE_")) {
      cleanRoleName = cleanRoleName.replace(/^ROLE_/, "");
    }

    if (!cleanRoleName) return;

    setIsCreatingRole(true);
    setRoleError(null);

    try {
      if (onRoleCreated) {
        await onRoleCreated({
          roleName: cleanRoleName,
          name: cleanRoleName,
          description: `Rôle ${cleanRoleName}`,
        });
      }
      setFormData((prev) => ({
        ...prev,
        roles: prev.roles.includes(cleanRoleName)
          ? prev.roles
          : [...prev.roles, cleanRoleName],
      }));
      setNewRoleName("");
    } catch (err) {
      setRoleError(
        err.response?.data?.message || "Erreur lors de la création du rôle."
      );
    } finally {
      setIsCreatingRole(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Sécurité : Si le username est vide, on prend l'email comme fallback
    const payload = {
      ...formData,
      username: formData.username.trim() || formData.email.trim(),
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Erreur lors de l'enregistrement de l'utilisateur."
      );
    } finally {
      setLoading(false);
    }
  };

  let submitButtonLabel = "Créer l'utilisateur";
  if (loading) {
    submitButtonLabel = "Enregistrement...";
  } else if (userToEdit) {
    submitButtonLabel = "Mettre à jour l'utilisateur";
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <h3 className="text-lg font-bold text-white">
          {userToEdit ? "Modifier l'utilisateur" : "Créer un nouvel utilisateur"}
        </h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-white text-sm cursor-pointer"
          >
            ✕ Fermer
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Formulaire Utilisateur */}
      <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="username" className="block text-xs font-semibold text-slate-400 mb-1">
              Nom d'utilisateur (Username) *
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="ex: jdupont ou jean.dupont@email.com"
              required
              disabled={!!userToEdit}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#1b82a4] disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-400 mb-1">
              Adresse Email *
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ex: jean.dupont@email.com"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#1b82a4]"
            />
          </div>

          <div>
            <label htmlFor="firstName" className="block text-xs font-semibold text-slate-400 mb-1">
              Prénom
            </label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#1b82a4]"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-xs font-semibold text-slate-400 mb-1">
              Nom
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#1b82a4]"
            />
          </div>
        </div>

        {!userToEdit && (
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-400 mb-1">
              Mot de passe *
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!userToEdit}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#1b82a4]"
            />
          </div>
        )}
      </form>

      {/* Section Gestion & Attribution des Rôles */}
      <div className="border-t border-slate-800 pt-4 space-y-3">
        <label htmlFor="newRoleInput" className="block text-xs font-semibold text-slate-400">
          Rôles Keycloak (Cliquer pour attribuer)
        </label>

        <div className="flex gap-2">
          <input
            id="newRoleInput"
            type="text"
            placeholder="Nouveau rôle (ex: ADMIN_LOGS)"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddRole(e);
              }
            }}
            className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#1b82a4]"
          />
          <button
            type="button"
            onClick={handleAddRole}
            disabled={isCreatingRole || !newRoleName.trim()}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer disabled:opacity-50"
          >
            {isCreatingRole ? "Création..." : "+ Créer le rôle"}
          </button>
        </div>
        {roleError && <p className="text-xs text-red-400">{roleError}</p>}

        <div className="flex flex-wrap gap-2 pt-1">
          {availableRoles?.map((roleItem, index) => {
            const roleName = getRoleName(roleItem);
            const isSelected = formData.roles.includes(roleName);

            return (
              <div
                key={`${roleName}-${index}`}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium border transition select-none ${isSelected
                    ? "bg-[#1b82a4] border-[#1b82a4] text-white"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
              >
                <button
                  type="button"
                  onClick={() => handleRoleToggle(roleName)}
                  className="bg-transparent border-0 text-inherit p-0 font-inherit cursor-pointer focus:outline-none"
                >
                  {isSelected ? `✓ ${roleName}` : roleName}
                </button>

                {onRoleDeleted && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRoleDeleted(roleName);
                    }}
                    className="ml-2 text-slate-400 hover:text-red-400 font-bold px-1 cursor-pointer bg-transparent border-0 focus:outline-none"
                    title="Supprimer ce rôle de Keycloak"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded text-sm font-semibold text-slate-400 hover:text-white transition cursor-pointer"
          >
            Annuler
          </button>
        )}
        <button
          form="user-form"
          type="submit"
          disabled={loading}
          className="bg-[#1b82a4] hover:bg-[#14637d] text-white font-semibold px-4 py-2 rounded text-sm transition cursor-pointer disabled:opacity-50"
        >
          {submitButtonLabel}
        </button>
      </div>
    </div>
  );
}