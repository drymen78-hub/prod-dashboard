interface Props { notes: string; onChange: (v: string) => void; }
const MAX_LENGTH = 500;

export function HandoverNotes({ notes, onChange }: Props) {
  return (
    <div className="card">
      <div className="section-header">
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c3aed' }} />
        <h2>인수인계 메모</h2>
        <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700,
          color: notes.length > MAX_LENGTH * 0.8 ? '#dc2626' : '#94a3b8' }}>
          {notes.length}/{MAX_LENGTH}
        </span>
      </div>
      <div style={{ padding: '12px 16px' }}>
        <textarea
          value={notes}
          onChange={e => onChange(e.target.value.slice(0, MAX_LENGTH))}
          placeholder={'• 미완료 항목:\n• 특이사항:\n• 주간팀 요청:'}
          rows={4}
          style={{
            width: '100%', border: '1px solid #e2e8f0', borderRadius: 8,
            padding: '10px 14px', fontSize: 14, fontWeight: 600, color: '#1e293b',
            background: '#f8fafc', resize: 'vertical', lineHeight: 1.7, fontFamily: 'inherit',
          }}
        />
        {notes.trim() && (
          <div style={{
            marginTop: 6, padding: '7px 12px',
            background: '#fef9c3', border: '1px solid #fde047', borderRadius: 6,
            fontSize: 12, color: '#854d0e', fontWeight: 700,
          }}>
            ⚠ 인수인계 내용이 있습니다. 주간팀 전달 확인 후 체크하세요.
          </div>
        )}
      </div>
    </div>
  );
}
