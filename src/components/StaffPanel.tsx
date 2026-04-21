import { DashboardState } from '../types';
import { STAFF_POSITIONS } from '../constants';

interface Props {
  staff: DashboardState['staff'];
  totalStaff: number;
  editMode: boolean;
  onUpdate: (key: keyof DashboardState['staff'], val: number) => void;
}

const COLORS: Record<string, string> = {
  classification: '#4f46e5',
  machine:        '#7c3aed',
  qc:             '#dc2626',
  wet:            '#0891b2',
  pretreatment:   '#d97706',
  dryShirts:      '#16a34a',
  support:        '#78716c',
};

export function StaffPanel({ staff, editMode, onUpdate }: Props) {
  return (
    <div className="card" style={{ marginBottom: 10, flex: 1 }}>
      <div className="card-header">
        <h2>👥 인원 현황</h2>
        {editMode && (
          <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
            (0.5 단위)
          </span>
        )}
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 6, padding: '10px 12px 12px',
      }}>
        {STAFF_POSITIONS.map(pos => {
          const val = staff[pos.key] || 0;
          const color = COLORS[pos.key] || '#78716c';
          const isQC = pos.key === 'qc';
          const danger = isQC && val === 0;
          const active = val > 0;
          const displayVal = Number.isInteger(val) ? String(val) : val.toFixed(1);

          return (
            <div key={pos.key} style={{
              background: danger ? '#fef2f2' : active ? color + '0d' : '#f8fafc',
              border: `1.5px solid ${danger ? '#fecaca' : active ? color + '40' : '#e2e8f0'}`,
              borderRadius: 8, padding: '8px 6px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
              transition: 'border-color 0.2s, background 0.2s',
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700, textAlign: 'center',
                color: danger ? '#dc2626' : active ? color : '#94a3b8',
              }}>
                {pos.label}
              </div>

              {editMode ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <input
                    type="number" min={0} step={0.5}
                    value={val || ''} placeholder="0"
                    onChange={e => {
                      const v = parseFloat(e.target.value);
                      onUpdate(pos.key, isNaN(v) ? 0 : v);
                    }}
                    style={{
                      width: 42, height: 30,
                      border: `1.5px solid ${danger ? '#fecaca' : active ? color + '55' : '#e2e8f0'}`,
                      borderRadius: 6, textAlign: 'center',
                      fontSize: 16, fontWeight: 900, color: '#1e293b',
                      background: '#fff', outline: 'none',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>명</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                  <span style={{
                    fontSize: 20, fontWeight: 800,
                    color: danger ? '#dc2626' : active ? color : '#d1d5db',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {displayVal}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: danger ? '#fca5a5' : active ? color + 'aa' : '#d1d5db',
                  }}>
                    명
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
