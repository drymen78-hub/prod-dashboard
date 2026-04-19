import { KickerSlot } from '../types';

interface Props {
  kickers: KickerSlot[];
  editMode: boolean;
  onUpdate: (id: string, field: 'on' | 'slots', val: boolean | number) => void;
}

export function KickerPanel({ kickers, editMode, onUpdate }: Props) {
  const kicker = kickers[0] ?? { id: '1', on: false, slots: 0 };
  const isOn = kicker.on;

  return (
    <div className="card" style={{ marginBottom: 10 }}>
      <div className="card-header">
        <h2>⚙️ 키커 현황</h2>
      </div>

      <div style={{ padding: '10px 14px 12px' }}>
        {editMode ? (
          /* 편집 모드: 버튼 + 슬롯 입력 */
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => onUpdate(kicker.id, 'on', true)}
              style={{
                background: isOn ? '#15803d' : '#fff',
                color: isOn ? '#fff' : '#94a3b8',
                border: `2px solid ${isOn ? '#15803d' : '#e2e8f0'}`,
                borderRadius: 8, padding: '7px 20px',
                fontSize: 14, fontWeight: 800, cursor: 'pointer',
              }}
            >
              {isOn ? '● 가동' : '○ 가동'}
            </button>

            <button
              onClick={() => onUpdate(kicker.id, 'on', false)}
              style={{
                background: !isOn ? '#64748b' : '#fff',
                color: !isOn ? '#fff' : '#94a3b8',
                border: `2px solid ${!isOn ? '#64748b' : '#e2e8f0'}`,
                borderRadius: 8, padding: '7px 20px',
                fontSize: 14, fontWeight: 800, cursor: 'pointer',
              }}
            >
              {!isOn ? '● 미가동' : '○ 미가동'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8, opacity: isOn ? 1 : 0.4 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>할당 슬롯</span>
              <input
                type="number" min={0}
                value={kicker.slots || ''} placeholder="0"
                disabled={!isOn}
                onChange={e => onUpdate(kicker.id, 'slots', Number(e.target.value))}
                style={{
                  width: 64, height: 34, border: `1.5px solid ${isOn ? '#86efac' : '#e2e8f0'}`,
                  borderRadius: 7, textAlign: 'center',
                  fontSize: 18, fontWeight: 900, color: '#1e293b',
                  background: '#fff', outline: 'none',
                  cursor: isOn ? 'text' : 'not-allowed',
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>개</span>
            </div>
          </div>
        ) : (
          /* 읽기 모드: 텍스트 표시 */
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: isOn ? '#f0fdf4' : '#f8fafc',
              border: `1.5px solid ${isOn ? '#86efac' : '#e2e8f0'}`,
              borderRadius: 8, padding: '8px 14px',
              flex: 1,
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: isOn ? '#15803d' : '#94a3b8' }}>
                {isOn ? '● 가동 중' : '○ 미가동'}
              </span>
              {isOn && (
                <>
                  <span style={{ width: 1, height: 14, background: '#d1d5db', display: 'inline-block' }} />
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#15803d', fontVariantNumeric: 'tabular-nums' }}>
                    {kicker.slots || 0}
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginLeft: 3 }}>슬롯</span>
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
