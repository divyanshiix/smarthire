import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorGradient?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorGradient = 'var(--primary-gradient)'
}) => {
  return (
    <div className="glass-card" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{title}</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.2rem', marginBottom: '0.2rem' }}>{value}</h2>
          {subtitle && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{subtitle}</span>
          )}
        </div>
        <div style={{
          width: 46,
          height: 46,
          borderRadius: 'var(--radius-md)',
          background: colorGradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
};
