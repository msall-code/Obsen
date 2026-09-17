export interface UserProfile {
  keycloakId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  createdAt: string;
  roles?: string[]; // Liste des rôles (ex: ['USER', 'ADMIN'])
}