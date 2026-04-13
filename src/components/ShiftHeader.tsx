const DAY_KR = ['일', '월', '화', '수', '목', '금', '토'];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${DAY_KR[d.getDay()]})`;
}

interface Props {
  date: string;
  savedAt: string;
  totalStaff: number;
  onDateChange: (d: string) => void;
  onReset: () => void;
  onCapture: () => void;
  onSave: () => void;
}

export function ShiftHeader({ date, savedAt, totalStaff, onDateChange, onReset, onCapture, onSave }: Props) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e3a5f 0%, #1a3050 100%)',
      borderRadius: 14, padding: '18px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 4px 12px rgba(30,58,95,0.25)', marginBottom: 16,
    }}>
      {/* 좌측: 제목 + 날짜 */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#93c5fd', letterSpacing: 2, marginBottom: 6, textTransform: 'uppercase' }}>
          🧺 세탁 인계 상황 공유
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: 0.5 }}>
          {formatDate(date)}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{
            background: 'rgba(96,165,250,0.2)', border: '1px solid rgba(96,165,250,0.4)',
            borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 700, color: '#93c5fd',
          }}>
            총 근무인원 {totalStaff}명
          </span>
          <span style={{
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 600, color: '#cbd5e1',
          }}>
            야간 → 주간 인수인계 보고서
          </span>
          {savedAt && (
            <span style={{ fontSize: 11, color: '#64748b' }}>
              최종 저장 {savedAt}
            </span>
          )}
        </div>
      </div>

      {/* 우측: 버튼들 */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }} className="no-print">
        <input type="date" value={date} onChange={e => onDateChange(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8, color: '#e2e8f0', padding: '7px 10px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        />
        <button onClick={onCapture} style={{
          background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.5)',
          borderRadius: 8, color: '#a5b4fc', padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          📸 캡처
        </button>
        <button onClick={onSave} style={{
          background: 'linear-gradient(135deg, #059669, #047857)', border: '1px solid rgba(5,150,105,0.6)',
          borderRadius: 8, color: '#fff', padding: '8px 18px', fontSize: 13, fontWeight: 800, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 5,
          boxShadow: '0 2px 8px rgba(5,150,105,0.4)',
        }}>
          💾 저장
        </button>
        <button onClick={onReset} style={{
          background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: 8, color: '#fca5a5', padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
        }}>
          초기화
        </button>
      </div>
    </div>
  );
}
