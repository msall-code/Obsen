import React from 'react';

interface KpiCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  color?: string;
  icon?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  color = '#3b82f6',
  icon = '📊'
}) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '1.25rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        borderLeft: `5px solid ${color}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minWidth: '220px',
        flex: '1'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>{title}</span>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      </div>
      
      <div style={{ marginTop: '0.75rem' }}>
        <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>{value}</span>
        {subtitle && (
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#9ca3af' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};