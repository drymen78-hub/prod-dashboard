import { DashboardState } from '../types';
import { STAFF_POSITIONS } from '../constants';

interface Props {
  staff: DashboardState['staff'];
  totalStaff: number;
  targetCount: number;
  workHours: number;
  onUpdate: (key: keyof DashboardState['staff'], val: number) => void;
  onTargetChange: (v: number) => void;
  onWorkHoursChange: (v: number) => void;
}

const COLORS: Record<string, string> = {
  classification: '#2563eb', machine: '#7c3aed', qc: '#dc2626',
  wet: '#0891b2', pretreatment: '#f97316', dryShirts: '#059669', support: '#78716c',
};

export function StaffPanel({ staff, totalStaff, targetCount, workHours, onUpdate, onTargetChange, onWorkHoursChange }: Props) {
  const totalDisplay = Number.isInteger(totalStaff) ? String(totalStaff) : totalStaff.toFixed(1);

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="section-header">
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb' }} />
        <h2>인원 현황</h2>
        <span style={{ marginLeft: 8, fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
          (0.5 단위 입력 가능)
        </span>
        <span style={{ marginLeft: 'auto', background: '#1e3a5f', color: '#93c5fd', borderRadius: 20, padding: '3px 16px', fontSize: 14, fontWeight: 900 }}>
          총 {totalDisplay}명
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, padding: '12px 16px 8px' }}>
        {STAFF_POSITIONS.map(pos => {
          const val = staff[pos.key] || 0;
          const color = COLORS[pos.key] || '#78716c';
          const active = val > 0;
          const displayVal = Number.isInteger(val) ? String(val) : val.toFixed(1);

          return (
            <div key={pos.key} style={{
              background: active ? color + '0f' : '#f8fafc',
              border: `2px solid ${active ? color + '55' : '#e2e8f0'}`,
              borderRadius: 10, padding: '10px 8px 8px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              transition: 'border-color 0.2s, background 0.2s',
            }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: active ? color : '#94a3b8', letterSpacing: 0.3, textAlign: 'center' }}>
                {pos.label}
              </div>
              <input
                type="number" min={0} step={0.5}
                value={val || ''} placeholder="0"
                onChange={e => {
                  const v = parseFloat(e.target.value);
                  onUpdate(pos.key, isNaN(v) ? 0 : v);
                }}
                style={{
                  width: 52, height: 32,
                  border: `2px solid ${active ? color + '66' : '#e2e8f0'}`,
                  borderRadius: 8, textAlign: 'center',
                  fontSize: 18, fontWeight: 900, color: '#1e293b', background: '#fff',
                  outline: 'none',
                }}
              />
              <div style={{ fontSize: 20, fontWeight: 900, color: active ? color : '#d1d5db', lineHeight: 1 }}>
                {displayVal}
                <span style={{ fontSize: 11, fontWeight: 700, marginLeft: 2, color: active ? color + 'aa' : '#d1d5db' }}>명</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 비율 바 */}
      {totalStaff > 0 && (
        <div style={{ padding: '0 16px 8px', display: 'flex', gap: 3 }}>
          {STAFF_POSITIONS.filter(p => staff[p.key] > 0).map(pos => (
            <div key={pos.key}
              title={`${pos.label}: ${staff[pos.key]}명`}
              style={{
                flex: staff[pos.key], height: 7,
                background: COLORS[pos.key] || '#94a3b8',
                borderRadius: 4, transition: 'flex 0.3s',
              }}
            />
          ))}
        </div>
      )}

      {/* 목표건수 · 근무시간 */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
        padding: '8px 16px 12px', borderTop: '1px solid #e2e8f0', marginTop: 4,
      }}>
        <div style={{
          background: targetCount > 0 ? '#1e3a5f0f' : '#f8fafc',
          border: `1.5px solid ${targetCount > 0 ? '#1e3a5f44' : '#e2e8f0'}`,
          borderRadius: 10, padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 3 }}>목표건수</div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>야간 처리 목표</div>
          </div>
          <input type="number" min={0}
            value={targetCount || ''} placeholder="0"
            onChange={e => onTargetChange(Number(e.target.value))}
            style={{
              flex: 1, height: 36, border: `1.5px solid ${targetCount > 0 ? '#1e3a5f66' : '#e2e8f0'}`,
              borderRadius: 8, textAlign: 'center', fontSize: 18, fontWeight: 900,
              color: '#1e293b', background: '#fff', outline: 'none',
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b', flexShrink: 0 }}>건</span>
        </div>

        <div style={{
          background: workHours > 0 ? '#0891b20f' : '#f8fafc',
          border: `1.5px solid ${workHours > 0 ? '#0891b244' : '#e2e8f0'}`,
          borderRadius: 10, padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 3 }}>근무시간</div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>야간 근무 시간</div>
          </div>
          <input type="number" min={0} step={0.5}
            value={workHours || ''} placeholder="0"
            onChange={e => onWorkHoursChange(parseFloat(e.target.value) || 0)}
            style={{
              flex: 1, height: 36, border: `1.5px solid ${workHours > 0 ? '#0891b266' : '#e2e8f0'}`,
              borderRadius: 8, textAlign: 'center', fontSize: 18, fontWeight: 900,
              color: '#1e293b', background: '#fff', outline: 'none',
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b', flexShrink: 0 }}>시간</span>
        </div>
      </div>
    </div>
  );
}
