import { LaundryState } from '../types';
import { FOLDING_DRY_CAPACITY } from '../constants';

interface Props {
  laundry: LaundryState;
  onUpdate: (field: keyof LaundryState, val: number) => void;
}

export function LaundrySectionPanel({ laundry, onUpdate }: Props) {
  const foldingRate = FOLDING_DRY_CAPACITY > 0
    ? Math.round((laundry.foldingDryBox / FOLDING_DRY_CAPACITY) * 100) : 0;

  const foldingBarColor =
    foldingRate >= 80 ? '#22c55e' :
    foldingRate >= 50 ? '#f59e0b' : '#60a5fa';

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="section-header">
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0891b2' }} />
        <h2>런드리파트</h2>
      </div>

      <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* 인원 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          background: laundry.staff > 0 ? '#0891b20f' : '#f8fafc',
          border: `1.5px solid ${laundry.staff > 0 ? '#0891b244' : '#e2e8f0'}`,
          borderRadius: 10, padding: '12px 16px',
        }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: laundry.staff > 0 ? '#0e7490' : '#94a3b8', flexShrink: 0 }}>
            👥 인원
          </span>
          <input
            type="number" min={0}
            value={laundry.staff || ''} placeholder="0"
            onChange={e => onUpdate('staff', Number(e.target.value))}
            style={{
              width: 64, height: 34,
              border: `1.5px solid ${laundry.staff > 0 ? '#0891b266' : '#e2e8f0'}`,
              borderRadius: 8, textAlign: 'center',
              fontSize: 18, fontWeight: 900, color: '#1e293b', background: '#fff', outline: 'none',
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>명</span>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>(8시간 기준)</span>
          {laundry.staff > 0 && (
            <span style={{ marginLeft: 'auto', fontSize: 22, fontWeight: 900, color: '#0e7490' }}>
              {laundry.staff}
              <span style={{ fontSize: 13, marginLeft: 2, fontWeight: 700, color: '#64748b' }}>명</span>
            </span>
          )}
        </div>

        {/* 작업 현황 */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', marginBottom: 8, paddingLeft: 2 }}>
            📦 작업 현황
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

            {/* 폴딩인계 건조 */}
            <div style={{
              background: laundry.foldingDryBox > 0 ? '#f0fdf4' : '#f8fafc',
              border: `1.5px solid ${laundry.foldingDryBox > 0 ? '#86efac' : '#e2e8f0'}`,
              borderRadius: 10, padding: '12px 14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: laundry.foldingDryBox > 0 ? 10 : 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', minWidth: 100 }}>
                  폴딩인계 건조
                </div>
                <input
                  type="number" min={0} max={FOLDING_DRY_CAPACITY}
                  value={laundry.foldingDryBox || ''} placeholder="0"
                  onChange={e => onUpdate('foldingDryBox', Math.min(Number(e.target.value), FOLDING_DRY_CAPACITY))}
                  style={{
                    width: 72, height: 32,
                    border: `1.5px solid ${laundry.foldingDryBox > 0 ? '#86efac' : '#e2e8f0'}`,
                    borderRadius: 6, textAlign: 'center',
                    fontSize: 16, fontWeight: 900, color: '#1e293b', background: '#fff', outline: 'none',
                  }}
                />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>box</span>
                {laundry.foldingDryBox > 0 && (
                  <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 800, color: foldingBarColor }}>
                    달성률 {foldingRate}% ({laundry.foldingDryBox}/{FOLDING_DRY_CAPACITY})
                  </span>
                )}
              </div>

              {laundry.foldingDryBox > 0 && (
                <>
                  <div style={{ height: 20, background: '#e2e8f0', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                      height: '100%', width: `${foldingRate}%`,
                      background: foldingBarColor, borderRadius: 6, transition: 'width 0.4s',
                      display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 6,
                    }}>
                      {foldingRate >= 15 && (
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{foldingRate}%</span>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
                    최대 캐파: {FOLDING_DRY_CAPACITY}box (60대 × 6회/대)
                  </div>
                </>
              )}
            </div>

            {/* 리빙건조 완성 */}
            <div style={{
              background: laundry.livingDryRT > 0 ? '#eff6ff' : '#f8fafc',
              border: `1.5px solid ${laundry.livingDryRT > 0 ? '#93c5fd' : '#e2e8f0'}`,
              borderRadius: 10, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', minWidth: 100 }}>
                리빙건조 완성
              </div>
              <input
                type="number" min={0}
                value={laundry.livingDryRT || ''} placeholder="0"
                onChange={e => onUpdate('livingDryRT', Number(e.target.value))}
                style={{
                  width: 72, height: 32,
                  border: `1.5px solid ${laundry.livingDryRT > 0 ? '#93c5fd' : '#e2e8f0'}`,
                  borderRadius: 6, textAlign: 'center',
                  fontSize: 16, fontWeight: 900, color: '#1e293b', background: '#fff', outline: 'none',
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>RT</span>
              {laundry.livingDryRT > 0 && (
                <span style={{ marginLeft: 'auto', fontSize: 22, fontWeight: 900, color: '#1d4ed8' }}>
                  {laundry.livingDryRT}
                  <span style={{ fontSize: 13, marginLeft: 2, fontWeight: 700, color: '#64748b' }}>RT</span>
                </span>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
