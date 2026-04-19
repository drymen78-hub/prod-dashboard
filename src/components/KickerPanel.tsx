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
            <span style={{
              background: '#f0fdf4', color: '#15803d',
              borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700,
            }}>
              총 {totalSlots} 슬롯
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, padding: '12px 16px' }}>
        {kickers.map((kicker, idx) => {
          const color  = KICKER_COLORS[idx] ?? '#64748b';
          const isOn   = kicker.on;

          return (
            <div key={kicker.id} style={{
              background: isOn ? color + '0f' : '#f8fafc',
              border: `2px solid ${isOn ? color + '55' : '#e2e8f0'}`,
              borderRadius: 12, padding: '14px 12px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              transition: 'border-color 0.2s, background 0.2s',
            }}>
              {/* 키커 번호 */}
              <div style={{ fontSize: 13, fontWeight: 900, color: isOn ? color : '#94a3b8', letterSpacing: 0.5 }}>
                키커 {idx + 1}
              </div>

              {/* ON / OFF 토글 */}
              <button
                onClick={() => onUpdate(kicker.id, 'on', !isOn)}
                style={{
                  width: 72, height: 32, borderRadius: 8,
                  border: `2px solid ${isOn ? color : '#e2e8f0'}`,
                  background: isOn ? color : '#fff',
                  color: isOn ? '#fff' : '#94a3b8',
                  fontSize: 13, fontWeight: 900, cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                {isOn ? 'ON' : 'OFF'}
              </button>

              {/* 슬롯 수 */}
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600, textAlign: 'center', marginBottom: 3 }}>슬롯</div>
                <input
                  type="number" min={0}
                  value={kicker.slots || ''}
                  placeholder="0"
                  disabled={!isOn}
                  onChange={e => onUpdate(kicker.id, 'slots', Number(e.target.value))}
                  style={{
                    width: '100%', height: 34,
                    border: `1.5px solid ${isOn ? color + '66' : '#e2e8f0'}`,
                    borderRadius: 6, textAlign: 'center',
                    fontSize: 16, fontWeight: 900, color: '#1e293b',
                    background: isOn ? '#fff' : '#f1f5f9',
                    outline: 'none', cursor: isOn ? 'text' : 'not-allowed',
                    opacity: isOn ? 1 : 0.5,
                  }}
                />
              </div>

              {/* 슬롯 표시 */}
              <div style={{ fontSize: 20, fontWeight: 900, color: isOn ? color : '#d1d5db', lineHeight: 1 }}>
                {isOn ? (kicker.slots || 0) : '—'}
                {isOn && <span style={{ fontSize: 11, fontWeight: 700, marginLeft: 2, color: color + 'aa' }}>슬롯</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
