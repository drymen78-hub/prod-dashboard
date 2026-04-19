import { HandoverSection } from '../types';

interface Props {
  notes: HandoverSection;
  onUpdate: (field: keyof HandoverSection, val: string) => void;
}

export function HandoverNotes({ notes, onUpdate }: Props) {
  const value = notes.other;
  const hasSomething = value.trim() !== '';

  return (
    <div className="card">
      <div className="section-header">
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c3aed' }} />
        <h2>인수인계 메모</h2>
        {hasSomething && (
          <span style={{
            marginLeft: 'auto', fontSize: 13, fontWeight: 700,
            background: '#fef9c3', color: '#854d0e',
            borderRadius: 20, padding: '2px 12px',
          }}>
            ⚠ 전달 내용 있음
          </span>
        )}
      </div>

      <div style={{ padding: '14px 16px 16px' }}>
        <textarea
          value={value}
          onChange={e => onUpdate('other', e.target.value)}
          placeholder="장비, 인원, 지원 현황 등 특이사항을 자유롭게 작성하세요"
          rows={6}
          style={{
            width: '100%',
            border: `1.5px solid ${hasSomething ? '#a78bfa' : '#e2e8f0'}`,
            borderRadius: 10,
            background: hasSomething ? '#faf5ff' : '#f8fafc',
            fontSize: 16, fontWeight: 600, color: '#1e293b',
            resize: 'vertical', lineHeight: 1.7, fontFamily: 'inherit',
            outline: 'none', padding: '12px 14px',
            transition: 'border-color 0.2s, background 0.2s',
            minHeight: 200,
          }}
        />
      </div>
    </div>
  );
}
