import { DashboardState } from '../types';
import { STAFF_POSITIONS } from '../constants';

interface Props {
  staff: DashboardState['staff'];
  totalStaff: number;
  onUpdate: (key: keyof DashboardState['staff'], val: number) => void;
}

const COLORS: Record<string, string> = {
  classification: '#2563eb', machine: '#7c3aed', qc: '#dc2626',
  wet: '#0891b2', pretreatment: '#f97316', dryShirts: '#059669', support: '#78716c',
};

export function StaffPanel({ staff, totalStaff, onUpdate }: Props) {
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
          return (
            <div key={pos.key} style={{
              background: active ? color + '0f' : '#f8fafc',
              border: `2px solid ${active ? color + '55' : '#e2e8f0'}`,
              borderRadius: 10, padding: '10px 8px 10px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              transition: 'border-color 0.2s, background 0.2s',
            }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: active ? color : '#94a3b8', letterSpacing: 0.3, textAlign: 'center' }}>
                {pos.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input
                  type="number" min={0} step={0.5}
                  value={val || ''} placeholder="0"
                  onChange={e => {
                    const v = parseFloat(e.target.value);
                    onUpdate(pos.key, isNaN(v) ? 0 : v);
                  }}
                  style={{
                    width: 52, height: 36,
                    border: `2px solid ${active ? color + '66' : '#e2e8f0'}`,
                    borderRadius: 8, textAlign: 'center',
                    fontSize: 20, fontWeight: 900, color: '#1e293b', background: '#fff',
                    outline: 'none',
                  }}
                />
                <span style={{ fontSize: 14, fontWeight: 800, color: active ? color : '#94a3b8' }}>명</span>
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

    </div>
  );
}
