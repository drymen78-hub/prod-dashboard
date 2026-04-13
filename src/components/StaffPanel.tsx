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
        <span style={{ marginLeft: 'auto', background: '#1e3a5f', color: '#93c5fd', borderRadius: 20, padding: '2px 12px', fontSize: 12, fontWeight: 700 }}>
          총 {totalStaff}명
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, padding: '16px 18px' }}>
        {STAFF_POSITIONS.map(pos => (
          <div key={pos.key} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            background: '#f8fafc', borderRadius: 10, padding: '12px 8px', border: '1px solid #e2e8f0',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textAlign: 'center' }}>{pos.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button onClick={() => onUpdate(pos.key, (staff[pos.key] || 0) - 1)}
                style={{ width: 22, height: 22, borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>−</button>
              <input type="number" min={0} value={staff[pos.key] || ''} placeholder="0"
                onChange={e => onUpdate(pos.key, Number(e.target.value))}
                style={{ width: 36, height: 28, border: '1px solid #e2e8f0', borderRadius: 6, textAlign: 'center', fontSize: 16, fontWeight: 800, color: '#1e293b', background: '#fff' }} />
              <button onClick={() => onUpdate(pos.key, (staff[pos.key] || 0) + 1)}
                style={{ width: 22, height: 22, borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>＋</button>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1e3a5f' }}>{staff[pos.key] || 0}명</div>
          </div>
        ))}
      </div>
      {totalStaff > 0 && (
        <div style={{ padding: '0 18px 16px', display: 'flex', gap: 3, overflow: 'hidden' }}>
          {STAFF_POSITIONS.filter(p => staff[p.key] > 0).map(pos => (
            <div key={pos.key} title={`${pos.label}: ${staff[pos.key]}명`}
              style={{ flex: staff[pos.key], height: 6, background: colors[pos.key] || '#94a3b8', borderRadius: 3, transition: 'flex 0.3s' }} />
          ))}
        </div>
      )}
    </div>
  );
}
