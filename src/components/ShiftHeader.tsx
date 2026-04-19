interface Props {
  date: string;
  editMode: boolean;
  onDateChange: (d: string) => void;
  onReset: () => void;
  onCapture: () => void;
  onEditToggle: () => void;
}

export function ShiftHeader({
  date, editMode, onDateChange, onReset, onCapture, onEditToggle,
}: Props) {
  return (
    <div
      className="no-print"
      style={{
        background: '#fff', border: '1px solid #e2e8f0',
        borderRadius: 10, padding: '11px 18px',
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      <span style={{ fontSize: 32, fontWeight: 800, color: '#1e293b' }}>
        🧺 야간 인계 대시보드
      </span>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* 편집 모드 토글 */}
        <button
          onClick={onEditToggle}
          style={{
            background: editMode ? '#fef3c7' : '#f8fafc',
            color: editMode ? '#92400e' : '#64748b',
            border: `1.5px solid ${editMode ? '#fde68a' : '#e2e8f0'}`,
            borderRadius: 8, padding: '7px 16px',
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}
        >
          {editMode ? '✏ 편집 중 (완료)' : '✏ 편집 모드'}
        </button>

        {/* 날짜 선택 */}
        <input
          type="date" value={date}
          onChange={e => onDateChange(e.target.value)}
          style={{
            border: '1.5px solid #e2e8f0', borderRadius: 8,
            padding: '7px 10px', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', background: '#fff', color: '#1e293b',
            outline: 'none',
          }}
        />

        {/* 저장·캡처 */}
        <button
          onClick={onCapture}
          style={{
            background: '#1e3a5f', color: '#fff',
            border: 'none', borderRadius: 8, padding: '8px 20px',
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}
        >
          📸 캡처
        </button>

        {/* 초기화 */}
        <button
          onClick={onReset}
          style={{
            background: '#fff', color: '#ef4444',
            border: '1.5px solid #fecaca', borderRadius: 8,
            padding: '7px 13px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}
        >
          초기화
        </button>
      </div>
    </div>
  );
}
