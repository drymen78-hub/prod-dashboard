import React from 'react';

type Status = 'good' | 'warn' | 'alert' | 'neutral';

const STATUS_STYLE: Record<Status, { accent: string; bg: string; glow: string }> = {
  good:    { accent: '#4ade80', bg: '#052e1660', glow: '#4ade8030' },
  warn:    { accent: '#fb923c', bg: '#43140760', glow: '#fb923c30' },
  alert:   { accent: '#f87171', bg: '#450a0a60', glow: '#f8717130' },
  neutral: { accent: '#3b5998', bg: 'transparent', glow: 'transparent' },
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
  label, value, unit, color = '#f0f6ff',
  status = 'neutral', icon, sub, size = 'md',
}) => {
  const st = STATUS_STYLE[status];
  const fontSize = size === 'lg' ? 34 : size === 'sm' ? 22 : 28;

  return (
    <div style={{
      background: `linear-gradient(145deg, #1a2f50, #162844)`,
      backgroundImage: st.bg !== 'transparent' ? `linear-gradient(145deg, ${st.bg}, #162844 50%)` : undefined,
      borderTop: `3px solid ${st.accent}`,
      border: '1px solid #2e4a7a',
      borderTopWidth: 3,
      borderRadius: 10,
      padding: '10px 14px',
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 3,
    }}>
      <div style={{
        fontSize: 12,
        fontWeight: 700,
        color: '#8ab4d8',
        display: 'flex', alignItems: 'center', gap: 5,
        letterSpacing: '0.03em',
      }}>
        {icon && <span style={{ fontSize: 13 }}>{icon}</span>}
        {label}
      </div>
      <div style={{
        fontSize,
        fontWeight: 800,
        color,
        lineHeight: 1.1,
        display: 'flex', alignItems: 'baseline', gap: 4,
      }}>
        {value}
        {unit && (
          <span style={{ fontSize: fontSize * 0.42, color: '#8ab4d8', fontWeight: 700 }}>
            {unit}
          </span>
        )}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: '#6a90b8', fontWeight: 600 }}>{sub}</div>
      )}
    </div>
  );
};
