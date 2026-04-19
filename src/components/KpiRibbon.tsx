import { StaffCounts, KickerSlot } from '../types';

interface Props {
  processingRate: number;
  washMethodCount: number;
  expectedTotal: number;
  totalCount: number;
  targetCount: number;
  totalStaff: number;
  staffCounts: StaffCounts;
  kickers: KickerSlot[];
}

interface CardProps {
  icon: string;
  label: string;
  value: string;
  sub: string;
  subDanger?: boolean;
  hero?: boolean;
  heroColor?: string;
  badge?: { text: string; color: string; bg: string };
  barFill: number;    // 0-100
  barColor: string;
  valueColor?: string;
}

function KpiCard({
  icon, label, value, sub, subDanger, hero, heroColor,
  badge, barFill, barColor, valueColor,
}: CardProps) {
  const vColor = valueColor ?? (hero && heroColor ? heroColor : '#1e293b');
  return (
    <div style={{
      background: hero && heroColor ? heroColor + '12' : '#fff',
      border: `1.5px solid ${hero && heroColor ? heroColor + '40' : '#e2e8f0'}`,
      borderRadius: 10, padding: '14px 16px',
      position: 'relative',
      boxShadow: hero ? '0 2px 8px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      {badge && (
        <span style={{
          position: 'absolute', top: 10, right: 12,
          background: badge.bg, color: badge.color,
          borderRadius: 20, padding: '2px 9px',
          fontSize: 10, fontWeight: 800, letterSpacing: 0.2,
        }}>
          {badge.text}
        </span>
      )}

      <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 5 }}>
        {icon} {label}
      </div>

      <div style={{
        fontSize: 28, fontWeight: 800, color: vColor,
        fontVariantNumeric: 'tabular-nums', lineHeight: 1.1, marginBottom: 4,
      }}>
        {value}
      </div>

      <div style={{
        fontSize: 11, fontWeight: 600,
        color: subDanger ? '#dc2626' : '#94a3b8',
        marginBottom: 10, minHeight: 14,
      }}>
        {sub}
      </div>

      {/* Mini 4px bar */}
      <div style={{ height: 4, background: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
        {barFill > 0 && (
          <div style={{
            height: '100%', width: `${Math.min(barFill, 100)}%`,
            background: barColor, borderRadius: 2, transition: 'width 0.5s',
          }} />
        )}
      </div>
    </div>
  );
}

export function KpiRibbon({
  processingRate, washMethodCount, expectedTotal,
  totalCount, targetCount, totalStaff, staffCounts, kickers,
}: Props) {
  const kicker = kickers[0] ?? { id: '1', on: false, slots: 0 };
  const qcStaff = staffCounts.qc ?? 0;

  /* 1. 처리율 */
  const rateColor =
    processingRate >= 80 ? '#16a34a' :
    processingRate >= 50 ? '#d97706' : '#dc2626';

  /* 2. 오늘 작업량 */
  const targetRatio = targetCount > 0 && totalCount > 0
    ? Math.round((totalCount / targetCount) * 100) : null;
  const workColor = targetRatio === null ? '#1e293b'
    : targetRatio >= 100 ? '#16a34a' : '#d97706';

  /* 3. 야간 인원 */
  const qcWarn = qcStaff === 0;

  /* 4. 키커 슬롯 */
  const kickerOn = kicker.on;

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12, marginBottom: 16,
    }}>
      {/* 총출고목표건수 */}
      <KpiCard
        icon="📦" label="총출고목표건수"
        value={totalCount > 0 ? `${totalCount.toLocaleString()}건` : '—'}
        valueColor={workColor}
        sub={targetCount > 0 ? `목표 ${targetCount.toLocaleString()}건` : ''}
        badge={
          targetRatio !== null
            ? {
                text: `${targetRatio}%`,
                color: targetRatio >= 100 ? '#16a34a' : '#d97706',
                bg: targetRatio >= 100 ? '#dcfce7' : '#fef9c3',
              }
            : undefined
        }
        barFill={targetCount > 0 ? Math.min((totalCount / targetCount) * 100, 100) : (totalCount > 0 ? 40 : 0)}
        barColor={targetRatio !== null && targetRatio >= 100 ? '#16a34a' : '#d97706'}
      />

      {/* 총출고개별수 처리율 — hero */}
      <KpiCard
        icon="🎯" label="총출고개별수 처리율"
        hero heroColor={rateColor}
        value={processingRate > 0 ? `${processingRate}%` : '—'}
        valueColor={rateColor}
        sub={
          expectedTotal > 0
            ? `${washMethodCount.toLocaleString()} / ${expectedTotal.toLocaleString()}개`
            : '수치 미입력'
        }
        barFill={Math.min(processingRate, 100)}
        barColor={rateColor}
      />

      {/* 야간 인원 */}
      <KpiCard
        icon="👥" label="야간 인원"
        value={totalStaff > 0 ? `${totalStaff}명` : '—'}
        sub={qcWarn ? '⚠ QC 공석' : `QC ${qcStaff}명`}
        subDanger={qcWarn}
        badge={
          qcWarn
            ? { text: 'QC 공석', color: '#dc2626', bg: '#fee2e2' }
            : { text: '충원 완료', color: '#16a34a', bg: '#dcfce7' }
        }
        barFill={totalStaff > 0 ? Math.min((totalStaff / 12) * 100, 100) : 0}
        barColor={qcWarn ? '#dc2626' : '#2563eb'}
      />

      {/* 키커 슬롯 */}
      <KpiCard
        icon="⚙️" label="키커 슬롯"
        value={kickerOn ? `${kicker.slots || 0}개` : '—'}
        sub={kickerOn ? '가동 중' : '미가동'}
        badge={
          kickerOn
            ? { text: '가동 중', color: '#16a34a', bg: '#dcfce7' }
            : { text: '미가동', color: '#94a3b8', bg: '#f1f5f9' }
        }
        barFill={kickerOn && kicker.slots > 0 ? Math.min((kicker.slots / 300) * 100, 100) : 0}
        barColor="#16a34a"
      />
    </div>
  );
}
