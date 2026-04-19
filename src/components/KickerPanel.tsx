import { KickerSlot } from '../types';

interface Props {
  kickers: KickerSlot[];
  onUpdate: (id: string, field: 'on' | 'slots', val: boolean | number) => void;
}

export function KickerPanel({ kickers, onUpdate }: Props) {
  // 단일 통합 뷰: kickers[0]을 전체 키커 대표 상태로 사용
  const kicker = kickers[0] ?? { id: '1', on: false, slots: 0 };
  const isOn = kicker.on;

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="section-header">
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0891b2' }} />
        <h2>🔧 키커 현황</h2>
        {isOn && kicker.slots > 0 && (
          <span style={{
            marginLeft: 'auto', background: '#f0fdf4', color: '#15803d',
            borderRadius: 20, padding: '2px 14px', fontSize: 14, fontWeight: 800,
          }}>
            {kicker.slots} 슬롯 가동 중
          </span>
        )}
      </div>

      <div style={{ padding: '16px 20px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* 가동 / 미가동 */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={() => onUpdate(kicker.id, 'on', true)}
            style={{
              background: isOn ? '#15803d' : '#fff',
              color: isOn ? '#fff' : '#94a3b8',
              border: `2px solid ${isOn ? '#15803d' : '#e2e8f0'}`,
              borderRadius: 10, padding: '10px 28px',
              fontSize: 17, fontWeight: 900, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <span style={{ fontSize: 12 }}>{isOn ? '●' : '○'}</span> 가동
          </button>

          <button
            onClick={() => onUpdate(kicker.id, 'on', false)}
            style={{
              background: !isOn ? '#64748b' : '#fff',
              color: !isOn ? '#fff' : '#94a3b8',
              border: `2px solid ${!isOn ? '#64748b' : '#e2e8f0'}`,
              borderRadius: 10, padding: '10px 28px',
              fontSize: 17, fontWeight: 900, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <span style={{ fontSize: 12 }}>{!isOn ? '●' : '○'}</span> 미가동
          </button>
        </div>

        {/* 할당 슬롯수 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          background: isOn ? '#f0fdf4' : '#f8fafc',
          border: `1.5px solid ${isOn ? '#86efac' : '#e2e8f0'}`,
          borderRadius: 10, padding: '12px 16px',
          opacity: isOn ? 1 : 0.5,
        }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: isOn ? '#15803d' : '#94a3b8' }}>
            할당 슬롯
          </span>
          <input
            type="number" min={0}
            value={kicker.slots || ''}
            placeholder="0"
            disabled={!isOn}
            onChange={e => onUpdate(kicker.id, 'slots', Number(e.target.value))}
            style={{
              width: 80, height: 40,
              border: `1.5px solid ${isOn ? '#86efac' : '#e2e8f0'}`,
              borderRadius: 8, textAlign: 'center',
              fontSize: 22, fontWeight: 900, color: '#1e293b',
              background: '#fff', outline: 'none',
              cursor: isOn ? 'text' : 'not-allowed',
            }}
          />
          <span style={{ fontSize: 17, fontWeight: 800, color: isOn ? '#15803d' : '#94a3b8' }}>개</span>
        </div>

      </div>
    </div>
  );
}
