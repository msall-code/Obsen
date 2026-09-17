import { useEffect, useState } from 'react';
import { KpiCard } from './components/KpiCard';
import { getDashboardStats } from '../identity/services/identityService';
import type { DashboardStats } from '../identity/services/identityService';

export const DashboardPage = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error('Erreur chargement KPIs :', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div style={{ padding: '1.5rem 0' }}>
            <h2>Tableau de Bord Obsen</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                Aperçu global et métriques de supervision de la plateforme.
            </p>

            {loading ? (
                <p>Chargement des métriques...</p>
            ) : (
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <KpiCard
                        title="Total Utilisateurs"
                        value={stats?.totalUsers ?? 0}
                        subtitle="Comptes enregistrés"
                        color="#2563eb"
                        icon="👥"
                    />
                    <KpiCard
                        title="Utilisateurs Actifs"
                        value={stats?.activeUsers ?? 0}
                        subtitle="Actuellement autorisés"
                        color="#16a34a"
                        icon="✅"
                    />
                    <KpiCard
                        title="Comptes Inactifs"
                        value={stats?.inactiveUsers ?? 0}
                        subtitle="En attente / Désactivés"
                        color="#dc2626"
                        icon="⚠️"
                    />
                </div>
            )}
        </div>
    );
};