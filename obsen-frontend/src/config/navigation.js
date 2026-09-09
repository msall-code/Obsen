export const NAV_ITEMS = [
    {
        title: 'Gestion des Utilisateurs',
        path: '/admin/users',
        icon: '👥',
        roles: ['ROLE_ADMIN'], // Visibilité exclusive Admin
    },
    {
        title: 'Tableau de bord',
        path: '/dashboard',
        icon: '📊',
        roles: ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_MANAGER'], // Accessible par tous
    },
    {
        title: 'Observabilité SRE',
        path: '/metrics',
        icon: '📈',
        roles: ['ROLE_ADMIN', 'ROLE_MANAGER'],
    },
];