const DAY_KR = ['일', '월', '화', '수', '목', '금', '토'];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${DAY_KR[d.getDay()]})`;
}

interface Props {
  date: string;
  savedAt: string;
  onDateChange: (d: string) => void;
  onReset: () => void;
  onCapture: () => void;
}

export function ShiftHeader({ date, savedAt, onDateChange, onReset, onCapture }: Props) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e3a5f 0%, #1a3050 100%)',
      borderRadius: 14, padding: '20px 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 4px 20px rgba(30,58,95,0.35)', marginBottom: 12, gap: 16,
    }}>
      {/* 좌측: 제목 */}
      <div>
        <div style={{
          fontSize: 26, fontWeight: 900, color: '#60a5fa',
          letterSpacing: 0.5, marginBottom: 6,
        }}>
          🌙 세탁 인계 상황 공유 · 야간 → 주간
        </div>
        <div style={{
          fontSize: 26, fontWeight: 900, color: '#fff',
          letterSpacing: -0.5, lineHeight: 1.2,
        }}>
          {formatDate(date)}
        </div>
        {savedAt && (
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginTop: 8 }}>
            최종 저장 {savedAt}
          </div>
        )}
      </div>

      {/* 우측: 버튼들 */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }} className="no-print">
        <input type="date" value={date} onChange={e => onDateChange(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 8, color: '#e2e8f0', padding: '8px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        />
        <button onClick={onCapture} style={{
          background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.5)',
          borderRadius: 8, color: '#c7d2fe', padding: '9px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
        }}>📸 캡처</button>
        <button onClick={onReset} style={{
          background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: 8, color: '#fca5a5', padding: '9px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}>초기화</button>
      </div>
    </div>
  );
}
