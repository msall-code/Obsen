export interface UserProfile {
    keycloakId: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    active: boolean;
    createdAt?: string;
    roles?: string[];
}

export interface UserUpdatePayload {
    firstName: string;
    lastName: string;
    email: string;
}