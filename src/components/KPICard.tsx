import React from 'react';

type Status = 'good' | 'warn' | 'alert' | 'neutral';

const STATUS_STYLE: Record<Status, { accent: string; bg: string }> = {
  good:    { accent: '#4ade80', bg: '#052e1640' },
  warn:    { accent: '#f97316', bg: '#43140740' },
  alert:   { accent: '#f87171', bg: '#450a0a40' },
  neutral: { accent: '#334155', bg: 'transparent' },
};

interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  status?: Status;
  icon?: string;
  sub?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const KPICard: React.FC<KPICardProps> = ({
  label, value, unit, color = '#f1f5f9',
  status = 'neutral', icon, sub, size = 'md',
}) => {
  const st = STATUS_STYLE[status];
  const fontSize = size === 'lg' ? 30 : size === 'sm' ? 18 : 24;

  return (
    <div style={{
      background: '#1e293b',
      backgroundImage: st.bg !== 'transparent' ? `linear-gradient(135deg, ${st.bg}, transparent 60%)` : undefined,
      borderTop: `2px solid ${st.accent}`,
      borderRadius: 8,
      padding: '8px 12px',
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 2,
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
        {icon && <span>{icon}</span>}
        {label}
      </div>
      <div style={{ fontSize, fontWeight: 800, color, lineHeight: 1, display: 'flex', alignItems: 'baseline', gap: 3 }}>
        {value}
        {unit && <span style={{ fontSize: fontSize * 0.45, color: '#64748b', fontWeight: 600 }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: 10, color: '#475569', fontWeight: 600 }}>{sub}</div>}
    </div>
  );
};
