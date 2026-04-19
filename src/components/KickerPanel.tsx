import { KickerSlot } from '../types';

interface Props {
  kickers: KickerSlot[];
  onUpdate: (id: string, field: 'on' | 'slots', val: boolean | number) => void;
}

const KICKER_COLORS = ['#2563eb', '#7c3aed', '#059669', '#ea580c'];

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
            borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700,
          }}>
            가동 {activeCount}대
          </span>
          {totalSlots > 0 && (
            <span style={{ background: '#f0fdf4', color: '#15803d', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>
              총 {totalSlots} 슬롯
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '10px 16px 14px', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {kickers.map((kicker, idx) => {
          const color = KICKER_COLORS[idx] ?? '#64748b';
          const isOn  = kicker.on;

          return (
            <div key={kicker.id} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: isOn ? color + '0f' : '#f8fafc',
              border: `1.5px solid ${isOn ? color + '55' : '#e2e8f0'}`,
              borderRadius: 10, padding: '8px 14px',
              flex: '1 1 auto',
              transition: 'border-color 0.2s, background 0.2s',
            }}>
              {/* ON 버튼 */}
              <button
                onClick={() => onUpdate(kicker.id, 'on', true)}
                style={{
                  background: isOn ? color : '#fff',
                  color: isOn ? '#fff' : '#94a3b8',
                  border: `2px solid ${isOn ? color : '#e2e8f0'}`,
                  borderRadius: 6, padding: '4px 10px',
                  fontSize: 12, fontWeight: 900, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 9 }}>{isOn ? '●' : '○'}</span>ON
              </button>

              {/* OFF 버튼 */}
              <button
                onClick={() => onUpdate(kicker.id, 'on', false)}
                style={{
                  background: !isOn ? '#64748b' : '#fff',
                  color: !isOn ? '#fff' : '#94a3b8',
                  border: `2px solid ${!isOn ? '#64748b' : '#e2e8f0'}`,
                  borderRadius: 6, padding: '4px 10px',
                  fontSize: 12, fontWeight: 900, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 9 }}>{!isOn ? '●' : '○'}</span>OFF
              </button>

              {/* 슬롯 입력 */}
              <input
                type="number" min={0}
                value={kicker.slots || ''}
                placeholder="0"
                disabled={!isOn}
                onChange={e => onUpdate(kicker.id, 'slots', Number(e.target.value))}
                style={{
                  width: 44, height: 30,
                  border: `1.5px solid ${isOn ? color + '66' : '#e2e8f0'}`,
                  borderRadius: 6, textAlign: 'center',
                  fontSize: 14, fontWeight: 900, color: '#1e293b',
                  background: isOn ? '#fff' : '#f1f5f9', outline: 'none',
                  opacity: isOn ? 1 : 0.45, cursor: isOn ? 'text' : 'not-allowed',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 11, fontWeight: 700, color: isOn ? color : '#94a3b8', flexShrink: 0 }}>슬롯</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
