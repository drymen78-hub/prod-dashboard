import { HandoverSection } from '../types';

interface Props {
  notes: HandoverSection;
  editMode: boolean;
  onUpdate: (field: keyof HandoverSection, val: string) => void;
}

export function HandoverNotes({ notes, editMode, onUpdate }: Props) {
  const value = notes.other;
  const hasContent = value.trim() !== '';

  return (
    <div style={{
      background: '#fffbeb',
      border: '1.5px solid #fde68a',
      borderRadius: 10, padding: '12px 14px',
    }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: '#92400e', marginBottom: 8 }}>
        ⚠ 인수인계 메모
      </div>

      {editMode ? (
        <textarea
          value={value}
          onChange={e => onUpdate('other', e.target.value)}
          placeholder="장비, 인원, 지원 현황 등 특이사항을 자유롭게 작성하세요"
          rows={5}
          style={{
            width: '100%',
            border: '1.5px solid #fde68a', borderRadius: 8,
            background: '#fff', fontSize: 13, fontWeight: 500,
            color: '#1e293b', resize: 'vertical', lineHeight: 1.6,
            fontFamily: 'inherit', outline: 'none', padding: '10px 12px',
            minHeight: 100,
          }}
        />
      ) : (
        <div style={{
          fontSize: 13, fontWeight: 500,
          color: hasContent ? '#1e293b' : '#94a3b8',
          lineHeight: 1.6, whiteSpace: 'pre-wrap',
          minHeight: 48,
        }}>
          {hasContent ? value : '— 전달 사항 없음'}
        </div>
      )}
    </div>
  );
}
