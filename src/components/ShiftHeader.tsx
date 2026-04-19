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
  onSaveSheets: () => void;
}

export function ShiftHeader({ date, savedAt, totalStaff, onDateChange, onReset, onCapture, onSave, onSaveSheets }: Props) {
  const staffDisplay = Number.isInteger(totalStaff) ? String(totalStaff) : totalStaff.toFixed(1);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e3a5f 0%, #1a3050 100%)',
      borderRadius: 14, padding: '20px 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 4px 20px rgba(30,58,95,0.35)', marginBottom: 12, gap: 16,
    }}>
      {/* 좌측: 제목 */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#60a5fa', letterSpacing: 2, marginBottom: 6 }}>
          🧺 세탁 인계 상황 공유 · 야간 → 주간
        </div>
        <div style={{
          fontSize: 48, fontWeight: 900, color: '#fff',
          letterSpacing: -1, lineHeight: 1.05,
        }}>
          {formatDate(date)}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{
            background: 'rgba(96,165,250,0.2)', border: '1px solid rgba(96,165,250,0.4)',
            borderRadius: 20, padding: '5px 18px', fontSize: 16, fontWeight: 800, color: '#93c5fd',
          }}>
            총 근무인원 {staffDisplay}명
          </span>
          {savedAt && (
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
              최종 저장 {savedAt}
            </span>
          )}
        </div>
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
          borderRadius: 8, color: '#c7d2fe', padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
        }}>📸 캡처</button>
        <button onClick={onSaveSheets} style={{
          background: 'rgba(5,150,105,0.2)', border: '1px solid rgba(5,150,105,0.5)',
          borderRadius: 8, color: '#6ee7b7', padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
        }}>📊 Sheets 저장</button>
        <button onClick={onSave} style={{
          background: 'linear-gradient(135deg, #059669, #047857)',
          border: '1px solid rgba(5,150,105,0.5)',
          borderRadius: 8, color: '#fff', padding: '9px 22px',
          fontSize: 14, fontWeight: 900, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
          boxShadow: '0 2px 8px rgba(5,150,105,0.4)',
        }}>💾 저장</button>
        <button onClick={onReset} style={{
          background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: 8, color: '#fca5a5', padding: '9px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}>초기화</button>
      </div>
    </div>
  );
}
