import { LaundryState } from '../types';
import { FOLDING_DRY_CAPACITY } from '../constants';

interface Props {
  laundry: LaundryState;
  editMode: boolean;
  onUpdate: (field: keyof LaundryState, val: number) => void;
}

export function LaundrySectionPanel({ laundry, editMode, onUpdate }: Props) {
  const foldingRate = FOLDING_DRY_CAPACITY > 0
    ? Math.round((laundry.foldingDryBox / FOLDING_DRY_CAPACITY) * 100) : 0;
  const barColor =
    foldingRate >= 80 ? '#16a34a' :
    foldingRate >= 50 ? '#d97706' : '#3b82f6';

  return (
    <div className="card" style={{ marginBottom: 10 }}>
      <div className="card-header">
        <h2>🧺 런드리파트</h2>
        {laundry.staff > 0 && (
          <span style={{
            marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: '#0e7490',
            background: '#ecfeff', borderRadius: 20, padding: '2px 10px',
          }}>
            {laundry.staff}명
          </span>
        )}
      </div>

      <div style={{ padding: '10px 12px 12px' }}>
        {/* 인원 편집 */}
        {editMode && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 10, padding: '8px 10px',
            background: '#f0fdfa', border: '1px solid #99f6e4',
            borderRadius: 8,
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#0e7490' }}>👥 인원</span>
            <input
              type="number" min={0}
              value={laundry.staff || ''} placeholder="0"
              onChange={e => onUpdate('staff', Number(e.target.value))}
              style={{
                width: 52, height: 28, border: '1.5px solid #99f6e4',
                borderRadius: 6, textAlign: 'center',
                fontSize: 15, fontWeight: 800, color: '#1e293b',
                background: '#fff', outline: 'none',
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>명</span>
          </div>
        )}

        {/* 2-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 10 }}>

          {/* Left: 폴딩인계 건조 */}
          <div style={{
            background: laundry.foldingDryBox > 0 ? '#f0fdf4' : '#f8fafc',
            border: `1.5px solid ${laundry.foldingDryBox > 0 ? '#86efac' : '#e2e8f0'}`,
            borderRadius: 8, padding: '10px 12px',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
              폴딩인계 건조
            </div>

            {editMode ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <input
                  type="number" min={0} max={FOLDING_DRY_CAPACITY}
                  value={laundry.foldingDryBox || ''} placeholder="0"
                  onChange={e => onUpdate('foldingDryBox', Math.min(Number(e.target.value), FOLDING_DRY_CAPACITY))}
                  style={{
                    width: 60, height: 30, border: '1.5px solid #86efac',
                    borderRadius: 6, textAlign: 'center',
                    fontSize: 15, fontWeight: 800, color: '#1e293b',
                    background: '#fff', outline: 'none',
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>box</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 8 }}>
                <span style={{
                  fontSize: 22, fontWeight: 800,
                  color: laundry.foldingDryBox > 0 ? barColor : '#d1d5db',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {laundry.foldingDryBox > 0 ? laundry.foldingDryBox : '—'}
                </span>
                {laundry.foldingDryBox > 0 && (
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>box</span>
                )}
              </div>
            )}

            <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${foldingRate}%`,
                background: barColor, borderRadius: 4, transition: 'width 0.4s',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 10, color: '#94a3b8' }}>/ {FOLDING_DRY_CAPACITY}box</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: barColor }}>
                {foldingRate}%
              </span>
            </div>
          </div>

          {/* Right: 리빙건조 완성 */}
          <div style={{
            background: laundry.livingDryRT > 0 ? '#eff6ff' : '#f8fafc',
            border: `1.5px solid ${laundry.livingDryRT > 0 ? '#93c5fd' : '#e2e8f0'}`,
            borderRadius: 8, padding: '10px 12px',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
              리빙건조 완성
            </div>

            {editMode ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="number" min={0}
                  value={laundry.livingDryRT || ''} placeholder="0"
                  onChange={e => onUpdate('livingDryRT', Number(e.target.value))}
                  style={{
                    width: 60, height: 30, border: '1.5px solid #93c5fd',
                    borderRadius: 6, textAlign: 'center',
                    fontSize: 15, fontWeight: 800, color: '#1e293b',
                    background: '#fff', outline: 'none',
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>RT</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                <span style={{
                  fontSize: 28, fontWeight: 800,
                  color: laundry.livingDryRT > 0 ? '#1d4ed8' : '#d1d5db',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {laundry.livingDryRT > 0 ? laundry.livingDryRT : '—'}
                </span>
                {laundry.livingDryRT > 0 && (
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>RT</span>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
