import { KickerSlot } from '../types';

interface Props {
  kickers: KickerSlot[];
  onUpdate: (id: string, field: 'on' | 'slots', val: boolean | number) => void;
}

const KICKER_LABELS = ['키커 1', '키커 2', '키커 3', '키커 4'];

export function KickerPanel({ kickers, onUpdate }: Props) {
  const activeCount = kickers.filter(k => k.on).length;
  const totalSlots  = kickers.filter(k => k.on).reduce((s, k) => s + (k.slots || 0), 0);

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="section-header">
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0891b2' }} />
        <h2>키커 현황</h2>
        <div style={{ display: 'flex', gap: 6, marginLeft: 10 }}>
          <span style={{
            background: activeCount > 0 ? '#cffafe' : '#f1f5f9',
            color: activeCount > 0 ? '#0e7490' : '#94a3b8',
            borderRadius: 20, padding: '2px 12px', fontSize: 13, fontWeight: 700,
          }}>
            가동 {activeCount}대
          </span>
          {totalSlots > 0 && (
            <span style={{ background: '#f0fdf4', color: '#15803d', borderRadius: 20, padding: '2px 12px', fontSize: 13, fontWeight: 700 }}>
              총 {totalSlots} 슬롯
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '12px 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {kickers.map((kicker, idx) => {
          const isOn = kicker.on;

          return (
            <div key={kicker.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: isOn ? '#f0fdf4' : '#f8fafc',
              border: `1.5px solid ${isOn ? '#86efac' : '#e2e8f0'}`,
              borderRadius: 10, padding: '10px 16px',
              transition: 'border-color 0.2s, background 0.2s',
            }}>
              {/* 키커 번호 */}
              <span style={{ fontSize: 16, fontWeight: 900, color: isOn ? '#15803d' : '#94a3b8', minWidth: 52 }}>
                {KICKER_LABELS[idx]}
              </span>

              {/* 가동 버튼 */}
              <button
                onClick={() => onUpdate(kicker.id, 'on', true)}
                style={{
                  background: isOn ? '#15803d' : '#fff',
                  color: isOn ? '#fff' : '#94a3b8',
                  border: `2px solid ${isOn ? '#15803d' : '#e2e8f0'}`,
                  borderRadius: 8, padding: '6px 18px',
                  fontSize: 15, fontWeight: 900, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <span style={{ fontSize: 10 }}>{isOn ? '●' : '○'}</span> 가동
              </button>

              {/* 미가동 버튼 */}
              <button
                onClick={() => onUpdate(kicker.id, 'on', false)}
                style={{
                  background: !isOn ? '#64748b' : '#fff',
                  color: !isOn ? '#fff' : '#94a3b8',
                  border: `2px solid ${!isOn ? '#64748b' : '#e2e8f0'}`,
                  borderRadius: 8, padding: '6px 18px',
                  fontSize: 15, fontWeight: 900, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <span style={{ fontSize: 10 }}>{!isOn ? '●' : '○'}</span> 미가동
              </button>

              {/* 슬롯 입력 */}
              {isOn && (
                <>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#64748b', marginLeft: 8 }}>슬롯</span>
                  <input
                    type="number" min={0}
                    value={kicker.slots || ''}
                    placeholder="0"
                    onChange={e => onUpdate(kicker.id, 'slots', Number(e.target.value))}
                    style={{
                      width: 64, height: 36,
                      border: '1.5px solid #86efac',
                      borderRadius: 8, textAlign: 'center',
                      fontSize: 18, fontWeight: 900, color: '#1e293b',
                      background: '#fff', outline: 'none',
                    }}
                  />
                  <span style={{ fontSize: 16, fontWeight: 900, color: '#15803d' }}>
                    {kicker.slots || 0}
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginLeft: 2 }}>슬롯</span>
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
