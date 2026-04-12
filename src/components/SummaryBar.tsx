import React from 'react';
import { COLORS } from '../constants';

interface Props {
  cleaningTotals: {
    staff: number; count: number; hours: number; eff: number;
  };
  laundryTotals: {
    staff: number; boxes: number; rolls: number; hours: number; eff: number; wash: number;
  };
  hasData: boolean;
}

const StatCol: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color = '#f1f5f9' }) => (
  <div style={{ textAlign: 'center', minWidth: 64 }}>
    <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, marginBottom: 3, letterSpacing: '0.04em' }}>{label}</div>
    <div style={{ fontSize: 18, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
  </div>
);

const Divider = () => (
  <div style={{ width: 1, background: '#334155', alignSelf: 'stretch', margin: '0 12px' }} />
);

export const SummaryBar: React.FC<Props> = ({ cleaningTotals, laundryTotals, hasData }) => {
  if (!hasData) return null;

  const totalStaff = cleaningTotals.staff + laundryTotals.staff;

  return (
    <div style={{
      background: '#1e293b', border: '1px solid #334155',
      borderRadius: 10, marginBottom: 10, overflow: 'hidden',
    }}>
      {/* 타이틀 */}
      <div style={{
        background: '#0f172a', borderBottom: '1px solid #334155',
        padding: '5px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '0.05em' }}>
          전체 업무마감 요약
        </span>
        <span style={{ fontSize: 10, color: '#334155', fontWeight: 600 }}>
          총 인원 {totalStaff}명
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', gap: 0, flexWrap: 'wrap' }}>
        {/* 클리닝파트 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 3, height: 48, background: COLORS.cleaning, borderRadius: 2 }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: COLORS.cleaning, marginBottom: 6 }}>
              🧺 개별클리닝파트
              <span style={{ fontSize: 10, color: '#475569', fontWeight: 600, marginLeft: 6 }}>{cleaningTotals.staff}명</span>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <StatCol label="총 처리" value={cleaningTotals.count > 0 ? `${cleaningTotals.count.toLocaleString()}건` : '—'} />
              <StatCol label="투입시간" value={cleaningTotals.hours > 0 ? `${cleaningTotals.hours}h` : '—'} color="#94a3b8" />
              <StatCol label="인시당" value={cleaningTotals.eff > 0 ? `${cleaningTotals.eff}건` : '—'} color={COLORS.rate} />
            </div>
          </div>
        </div>

        <Divider />

        {/* 런드리파트 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 3, height: 48, background: COLORS.laundry, borderRadius: 2 }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: COLORS.laundry, marginBottom: 6 }}>
              🫧 런드리파트
              <span style={{ fontSize: 10, color: '#475569', fontWeight: 600, marginLeft: 6 }}>{laundryTotals.staff}명</span>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {laundryTotals.wash > 0 && <StatCol label="세탁" value={`${laundryTotals.wash.toLocaleString()}건`} />}
              <StatCol label="생활빨래건조" value={laundryTotals.boxes > 0 ? `${laundryTotals.boxes}박스` : '—'} color="#60a5fa" />
              <StatCol label="이불건조" value={laundryTotals.rolls > 0 ? `${laundryTotals.rolls}롤` : '—'} color="#f97316" />
              <StatCol label="투입시간" value={laundryTotals.hours > 0 ? `${laundryTotals.hours}h` : '—'} color="#94a3b8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
