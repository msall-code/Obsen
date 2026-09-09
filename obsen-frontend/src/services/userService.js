import keycloak from './keycloak';

const BASE_URL = 'http://localhost:7089/auth/admin/realms/Obsen-Realm';

// Helper pour obtenir un token valide à chaque requête
const getValidToken = async () => {
  try {
    await keycloak.updateToken(30); // Rafraîchit le token s'il expire dans moins de 30 sec
  } catch (err) {
    console.error('Échec du rafraîchissement du token Keycloak', err);
    keycloak.login();
  }
  return keycloak.token;
};

export const userService = {
  // --- UTILISATEURS ---
  async getUsers() {
    const token = await getValidToken();
    const response = await fetch(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    return await response.json();
  },

  async getUserById(userId) {
    const token = await getValidToken();
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(`Impossible de récupérer l'utilisateur: ${response.status}`);
    return await response.json();
  },

  // 🟢 AJOUT : Mettre à jour les informations de profil utilisateur dans Keycloak
  async updateUser(userId, updatedFields) {
    const token = await getValidToken();

    // 1. Récupération de l'état actuel pour éviter d'écraser des champs non fournis (groupes, attributes, etc.)
    const existingUser = await this.getUserById(userId);

    // 2. Fusion des champs modifiés
    const payload = {
      ...existingUser,
      ...updatedFields,
    };

    // 3. Envoi de la mise à jour à Keycloak
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errorMessage || `Échec de la mise à jour Keycloak (${response.status})`);
    }
  },

  async createUser(userData, selectedRole) {
    const token = await getValidToken();
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errorMessage || "Échec de la création de l'utilisateur.");
    }

    const locationHeader = response.headers.get('Location');
    let userId = null;

    if (locationHeader) {
      userId = locationHeader.split('/').pop();
    } else {
      const userRes = await fetch(`${BASE_URL}/users?username=${userData.username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const users = await userRes.json();
      if (users.length > 0) userId = users[0].id;
    }

    if (userId && selectedRole) {
      await this.updateUserRole(userId, null, selectedRole);
    }
  },

  async toggleUserEnabled(userId, currentStatus) {
    const token = await getValidToken();
    // Utiliser la mise à jour partielle sécurisée
    await this.updateUser(userId, { enabled: !currentStatus });
  },

  async deleteUser(id) {
    const token = await getValidToken();
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Échec de la suppression de l'utilisateur.");
  },

  // --- RÔLES REALM KEYCLOAK ---
  async getAvailableRoles() {
    const token = await getValidToken();
    const response = await fetch(`${BASE_URL}/roles`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Échec du chargement des rôles.');
    const roles = await response.json();
    return roles.filter(
      (r) => !['default-roles-obsen-realm', 'offline_access', 'uma_authorization'].includes(r.name)
    );
  },

  async getUserRoles(userId) {
    const token = await getValidToken();
    const response = await fetch(`${BASE_URL}/users/${userId}/role-mappings/realm`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Échec du chargement des rôles utilisateur.');
    return await response.json();
  },

  async updateUserRole(userId, oldRole, newRole) {
    const token = await getValidToken();

    if (oldRole) {
      await fetch(`${BASE_URL}/users/${userId}/role-mappings/realm`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify([oldRole]),
      });
    }
    if (newRole) {
      const response = await fetch(`${BASE_URL}/users/${userId}/role-mappings/realm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify([newRole]),
      });
      if (!response.ok) throw new Error("Échec de l'attribution du rôle.");
    }
  },

  async createRole(roleData) {
    const token = await getValidToken();
    const response = await fetch(`${BASE_URL}/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(roleData),
    });
    if (!response.ok) throw new Error('Échec de la création du rôle.');
  },

  async updateRole(oldRoleName, updatedRoleData) {
    const token = await getValidToken();
    const response = await fetch(`${BASE_URL}/roles/${encodeURIComponent(oldRoleName)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedRoleData),
    });
    if (!response.ok) throw new Error('Échec de la mise à jour du rôle dans Keycloak.');
  },

  async deleteRole(roleName) {
    const token = await getValidToken();
    const response = await fetch(`${BASE_URL}/roles/${encodeURIComponent(roleName)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Échec de la suppression du rôle.');
  },
};