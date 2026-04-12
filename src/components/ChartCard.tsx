import React from 'react';
import type { ChartConfiguration } from 'chart.js';
import { ChartBox } from './ChartBox';

interface Props {
  title: string;
  height?: string;
  config: ChartConfiguration | null;
  badge?: React.ReactNode;
  tag?: string;
}

export const ChartCard: React.FC<Props> = ({ title, height = '200px', config, badge, tag }) => {
  if (!config) return null;
  return (
    <div style={{
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: 8,
      padding: '10px 12px',
      marginBottom: 6,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {tag && (
            <span style={{
              fontSize: 9, fontWeight: 800, color: '#475569',
              background: '#0f172a', border: '1px solid #334155',
              borderRadius: 4, padding: '1px 6px', letterSpacing: '0.05em',
            }}>{tag}</span>
          )}
          <span style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0' }}>{title}</span>
        </div>
        {badge}
      </div>
      <ChartBox config={config} height={height} />
    </div>
  );
};
