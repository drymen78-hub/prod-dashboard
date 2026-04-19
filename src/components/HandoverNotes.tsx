import { HandoverSection } from '../types';

interface Props {
  notes: HandoverSection;
  onUpdate: (field: keyof HandoverSection, val: string) => void;
}

const SECTIONS: Array<{ key: keyof HandoverSection; emoji: string; label: string; placeholder: string }> = [
  { key: 'incomplete',     emoji: '📦', label: '장비 특이사항',  placeholder: '장비 관련 특이사항을 입력하세요' },
  { key: 'issues',         emoji: '👥', label: '인원 특이사항',  placeholder: '인원 관련 특이사항을 입력하세요' },
  { key: 'dayTeamRequest', emoji: '🤝', label: '지원 현황',      placeholder: '지원 현황을 입력하세요' },
  { key: 'other',          emoji: '💬', label: '기타 특이사항',  placeholder: '기타 전달 사항을 입력하세요' },
];

const ACCENT: Record<keyof HandoverSection, string> = {
  incomplete:     '#dc2626',
  issues:         '#f97316',
  dayTeamRequest: '#2563eb',
  other:          '#7c3aed',
};

export function HandoverNotes({ notes, onUpdate }: Props) {
  const hasAny = Object.values(notes).some(v => v.trim() !== '');

  return (
    <div className="card">
      <div className="section-header">
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c3aed' }} />
        <h2>인수인계 메모</h2>
        {hasAny && (
          <span style={{
            marginLeft: 'auto', fontSize: 11, fontWeight: 700,
            background: '#fef9c3', color: '#854d0e',
            borderRadius: 20, padding: '2px 10px',
          }}>
            ⚠ 전달 내용 있음
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '12px 16px' }}>
        {SECTIONS.map(({ key, emoji, label, placeholder }) => {
          const accent = ACCENT[key];
          const filled = notes[key].trim() !== '';
          return (
            <div key={key} style={{
              background: filled ? accent + '08' : '#f8fafc',
              border: `1.5px solid ${filled ? accent + '55' : '#e2e8f0'}`,
              borderRadius: 10, padding: '10px 12px',
              display: 'flex', flexDirection: 'column', gap: 6,
              transition: 'border-color 0.2s, background 0.2s',
            }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: filled ? accent : '#94a3b8' }}>
                {emoji} {label}
              </div>
              <textarea
                value={notes[key]}
                onChange={e => onUpdate(key, e.target.value)}
                placeholder={placeholder}
                rows={3}
                style={{
                  width: '100%', border: 'none', background: 'transparent',
                  fontSize: 13, fontWeight: 600, color: '#1e293b',
                  resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit',
                  outline: 'none', padding: 0,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
