import { DashboardState } from '../types';
import { STAFF_POSITIONS } from '../constants';

interface Props {
  staff: DashboardState['staff'];
  totalStaff: number;
  onUpdate: (key: keyof DashboardState['staff'], val: number) => void;
}

const COLORS: Record<string, string> = {
  classification: '#2563eb', machine: '#7c3aed', qc: '#dc2626',
  wet: '#0891b2', dryShirts: '#059669', support: '#78716c',
};

export function StaffPanel({ staff, totalStaff, onUpdate }: Props) {
  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="section-header">
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb' }} />
        <h2>인원 현황</h2>
        <span style={{ marginLeft: 'auto', background: '#1e3a5f', color: '#93c5fd', borderRadius: 20, padding: '3px 16px', fontSize: 14, fontWeight: 900 }}>
          총 {totalStaff}명
        </span>
      </div>

      {/* 컴팩트 가로형 레이아웃 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, padding: '12px 16px 8px' }}>
        {STAFF_POSITIONS.map(pos => {
          const val = staff[pos.key] || 0;
          const color = COLORS[pos.key] || '#78716c';
          const active = val > 0;
          return (
            <div key={pos.key} style={{
              background: active ? color + '0f' : '#f8fafc',
              border: `2px solid ${active ? color + '55' : '#e2e8f0'}`,
              borderRadius: 10, padding: '10px 10px 8px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              transition: 'border-color 0.2s, background 0.2s',
            }}>
              {/* 업무명 */}
              <div style={{
                fontSize: 15, fontWeight: 900,
                color: active ? color : '#94a3b8',
                letterSpacing: 0.3,
              }}>
                {pos.label}
              </div>

              {/* +/- 입력 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button
                  onClick={() => onUpdate(pos.key, val - 1)}
                  style={{
                    width: 24, height: 24, borderRadius: 6,
                    border: `1px solid ${active ? color + '66' : '#e2e8f0'}`,
                    background: '#fff', color: active ? color : '#94a3b8',
                    fontSize: 16, fontWeight: 900,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', padding: 0, lineHeight: 1,
                  }}
                >−</button>
                <input
                  type="number" min={0}
                  value={val || ''} placeholder="0"
                  onChange={e => onUpdate(pos.key, Number(e.target.value))}
                  style={{
                    width: 40, height: 30, border: `1px solid ${active ? color + '66' : '#e2e8f0'}`,
                    borderRadius: 7, textAlign: 'center',
                    fontSize: 18, fontWeight: 900, color: '#1e293b', background: '#fff',
                  }}
                />
                <button
                  onClick={() => onUpdate(pos.key, val + 1)}
                  style={{
                    width: 24, height: 24, borderRadius: 6,
                    border: `1px solid ${active ? color + '66' : '#e2e8f0'}`,
                    background: '#fff', color: active ? color : '#94a3b8',
                    fontSize: 16, fontWeight: 900,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', padding: 0, lineHeight: 1,
                  }}
                >＋</button>
              </div>

              {/* 인원수 */}
              <div style={{
                fontSize: 22, fontWeight: 900, color: active ? color : '#d1d5db',
                lineHeight: 1,
              }}>
                {val}
                <span style={{ fontSize: 12, fontWeight: 700, marginLeft: 2, color: active ? color + 'aa' : '#d1d5db' }}>명</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 비율 바 */}
      {totalStaff > 0 && (
        <div style={{ padding: '0 16px 10px', display: 'flex', gap: 3 }}>
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
    </div>
  );
}
