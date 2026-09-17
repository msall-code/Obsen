import { useEffect, useState } from 'react';
import { KpiCard } from './components/KpiCard';
import { getDashboardStats } from '../identity/services/identityService';
import type { DashboardStats } from '../identity/services/identityService';
import keycloak from '../../config/keycloak';

export const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const roles = (keycloak.realmAccess?.roles || []).map((r) => r.toUpperCase());
  const isAdmin = roles.includes('ADMIN');

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

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
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div style={{ padding: '1.5rem 0' }}>
        <h2>Tableau de Bord Obsen</h2>
        <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '1rem' }}>
          <p>Bienvenue ! Vous êtes connecté en tant qu'utilisateur standard.</p>
        </div>
      </div>
    );
  }

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