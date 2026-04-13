import React from 'react';
import { COLORS } from '../constants';

interface Props {
  cleaningTotals: { staff: number; count: number; hours: number; eff: number };
  laundryTotals:  { staff: number; boxes: number; rolls: number; hours: number; eff: number };
  hasData: boolean;
}

const StatCol: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color = '#f0f6ff' }) => (
  <div style={{ textAlign: 'center', minWidth: 72 }}>
    <div style={{ fontSize: 11, color: '#7a9cc0', fontWeight: 700, marginBottom: 4, letterSpacing: '0.04em' }}>{label}</div>
    <div style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
  </div>
);

const Divider = () => (
  <div style={{ width: 1, background: '#2e4a7a', alignSelf: 'stretch', margin: '0 16px' }} />
);

export const SummaryBar: React.FC<Props> = ({ cleaningTotals, laundryTotals, hasData }) => {
  if (!hasData) return null;

  const totalStaff = cleaningTotals.staff + laundryTotals.staff;

  return (
    <div style={{
      background: '#1a2f50',
      border: '1px solid #2e4a7a',
      borderRadius: 12,
      marginBottom: 12,
      overflow: 'hidden',
    }}>
      {/* 타이틀 */}
      <div style={{
        background: '#0f1e32',
        borderBottom: '1px solid #2e4a7a',
        padding: '7px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: '#8ab4d8', letterSpacing: '0.05em' }}>
          📋 전체 업무마감 요약
        </span>
        <span style={{ fontSize: 13, color: '#b8cfe8', fontWeight: 700 }}>
          오늘 총 인원 <span style={{ color: '#f0f6ff', fontSize: 16, fontWeight: 900 }}>{totalStaff}</span>명
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', gap: 0, flexWrap: 'wrap' }}>
        {/* 클리닝파트 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 4, height: 56, background: COLORS.cleaning, borderRadius: 2 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.cleaning, marginBottom: 8 }}>
              🧺 개별클리닝파트
              <span style={{ fontSize: 12, color: '#8ab4d8', fontWeight: 600, marginLeft: 8 }}>{cleaningTotals.staff}명</span>
            </div>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <StatCol label="총 처리" value={cleaningTotals.count > 0 ? `${cleaningTotals.count.toLocaleString()}건` : '—'} />
              <StatCol label="투입시간" value={cleaningTotals.hours > 0 ? `${cleaningTotals.hours}h` : '—'} color="#b8cfe8" />
              <StatCol label="인시당 생산" value={cleaningTotals.eff > 0 ? `${cleaningTotals.eff}건` : '—'} color={COLORS.rate} />
            </div>
          </div>
        </div>

        <Divider />

        {/* 런드리파트 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 4, height: 56, background: COLORS.laundry, borderRadius: 2 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.laundry, marginBottom: 8 }}>
              🫧 런드리파트
              <span style={{ fontSize: 12, color: '#8ab4d8', fontWeight: 600, marginLeft: 8 }}>{laundryTotals.staff}명</span>
            </div>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <StatCol label="생활빨래건조" value={laundryTotals.boxes > 0 ? `${laundryTotals.boxes}박스` : '—'} color="#60a5fa" />
              <StatCol label="이불건조" value={laundryTotals.rolls > 0 ? `${laundryTotals.rolls}롤` : '—'} color="#fb923c" />
              <StatCol label="투입시간" value={laundryTotals.hours > 0 ? `${laundryTotals.hours}h` : '—'} color="#b8cfe8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
