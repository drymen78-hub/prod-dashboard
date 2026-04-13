import { DashboardState } from '../types';
import { STAFF_POSITIONS } from '../constants';

interface Props {
  staff: DashboardState['staff'];
  totalStaff: number;
  onUpdate: (key: keyof DashboardState['staff'], val: number) => void;
}

export function StaffPanel({ staff, totalStaff, onUpdate }: Props) {
  const colors: Record<string, string> = {
    classification: '#2563eb', machine: '#7c3aed', qc: '#dc2626',
    wet: '#0891b2', dryShirts: '#059669', support: '#9ca3af',
  };
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="section-header">
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb' }} />
        <h2>인원 현황</h2>
        <span style={{ marginLeft: 'auto', background: '#1e3a5f', color: '#93c5fd', borderRadius: 20, padding: '3px 14px', fontSize: 13, fontWeight: 800 }}>
          총 {totalStaff}명
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, padding: '16px 18px' }}>
        {STAFF_POSITIONS.map(pos => (
          <div key={pos.key} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            background: '#f8fafc', borderRadius: 12, padding: '14px 8px',
            border: `2px solid ${staff[pos.key] > 0 ? colors[pos.key] + '55' : '#e2e8f0'}`,
            transition: 'border-color 0.2s',
          }}>
            {/* 업무명 */}
            <div style={{
              fontSize: 14, fontWeight: 800, color: staff[pos.key] > 0 ? colors[pos.key] : '#64748b',
              textAlign: 'center', letterSpacing: 0.5,
              transition: 'color 0.2s',
            }}>
              {pos.label}
            </div>
            {/* 조작 버튼 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <button onClick={() => onUpdate(pos.key, (staff[pos.key] || 0) - 1)}
                style={{
                  width: 26, height: 26, borderRadius: 7, border: '1px solid #e2e8f0',
                  background: '#fff', color: '#64748b', fontSize: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', padding: 0, fontWeight: 700,
                }}>−</button>
              <input type="number" min={0} value={staff[pos.key] || ''} placeholder="0"
                onChange={e => onUpdate(pos.key, Number(e.target.value))}
                style={{
                  width: 42, height: 34, border: '1px solid #e2e8f0', borderRadius: 8,
                  textAlign: 'center', fontSize: 18, fontWeight: 900, color: '#1e293b',
                  background: '#fff',
                }} />
              <button onClick={() => onUpdate(pos.key, (staff[pos.key] || 0) + 1)}
                style={{
                  width: 26, height: 26, borderRadius: 7, border: '1px solid #e2e8f0',
                  background: '#fff', color: '#64748b', fontSize: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', padding: 0, fontWeight: 700,
                }}>＋</button>
            </div>
            {/* 인원수 표시 */}
            <div style={{
              fontSize: 20, fontWeight: 900, color: staff[pos.key] > 0 ? colors[pos.key] : '#cbd5e1',
              lineHeight: 1,
            }}>
              {staff[pos.key] || 0}
              <span style={{ fontSize: 12, fontWeight: 600, marginLeft: 2, color: staff[pos.key] > 0 ? colors[pos.key] + 'bb' : '#cbd5e1' }}>명</span>
            </div>
          </div>
        ))}
      </div>
      {totalStaff > 0 && (
        <div style={{ padding: '0 18px 16px', display: 'flex', gap: 3, overflow: 'hidden' }}>
          {STAFF_POSITIONS.filter(p => staff[p.key] > 0).map(pos => (
            <div key={pos.key} title={`${pos.label}: ${staff[pos.key]}명`}
              style={{ flex: staff[pos.key], height: 8, background: colors[pos.key] || '#94a3b8', borderRadius: 4, transition: 'flex 0.3s' }} />
          ))}
        </div>
      )}
    </div>
  );
}
