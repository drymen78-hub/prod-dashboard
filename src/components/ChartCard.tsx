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
      background: '#1a2f50',
      border: '1px solid #2e4a7a',
      borderRadius: 10,
      padding: '12px 14px',
      marginBottom: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {tag && (
            <span style={{
              fontSize: 10, fontWeight: 800, color: '#60a5fa',
              background: '#0f1e32', border: '1px solid #2e4a7a',
              borderRadius: 5, padding: '2px 8px', letterSpacing: '0.05em',
            }}>{tag}</span>
          )}
          <span style={{ fontSize: 13, fontWeight: 700, color: '#d4e8ff' }}>{title}</span>
        </div>
        {badge}
      </div>
      <ChartBox config={config} height={height} />
    </div>
  );
};
