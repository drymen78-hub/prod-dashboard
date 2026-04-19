const DAY_KR = ['일', '월', '화', '수', '목', '금', '토'];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${DAY_KR[d.getDay()]})`;
}

interface Props {
  date: string;
  savedAt: string;
}

export function DashboardBanner({ date, savedAt }: Props) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 20px 12px',
      borderBottom: '1.5px solid #1e293b',
      marginBottom: 14,
    }}>
      {/* 좌: 제목 */}
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#1e293b', letterSpacing: -0.3 }}>
          🧺 개별 클리닝 파트
        </div>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#64748b', marginTop: 3 }}>
          야간조 작성 · 주간조 인수 대기 중
        </div>
      </div>

      {/* 우: LIVE + 날짜 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          background: '#dcfce7', color: '#16a34a',
          borderRadius: 20, padding: '3px 11px',
          fontSize: 11, fontWeight: 800,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
          LIVE
        </span>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', fontVariantNumeric: 'tabular-nums' }}>
            {formatDate(date)}
          </div>
          {savedAt && (
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, marginTop: 2 }}>
              최종 저장 {savedAt}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
