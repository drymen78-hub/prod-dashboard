import { useState } from 'react';
import { OrderColor, ProcessKey, ProcessStatus, ProcessStatusMap } from '../types';
import { ORDER_COLOR_MAP, ORDER_COLORS, PROCESS_KEYS, PROCESS_LABELS } from '../constants';

interface Props {
  workSequence: OrderColor[];
  workSequenceCounts: Partial<Record<OrderColor, number>>;
  processStatus: ProcessStatusMap;
  intensiveCareColors: OrderColor[];
  onSequenceChange: (colors: OrderColor[]) => void;
  onSequenceCountChange: (color: OrderColor, count: number) => void;
  onProcessStatusChange: (key: ProcessKey, status: ProcessStatus) => void;
  onIntensiveCareChange: (colors: OrderColor[]) => void;
}

export function WorkOrderSection({
  workSequence, workSequenceCounts, processStatus, intensiveCareColors,
  onSequenceChange, onSequenceCountChange, onProcessStatusChange, onIntensiveCareChange,
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const [colorPickerKey, setColorPickerKey] = useState<ProcessKey | null>(null);

  const totalCount = workSequence.reduce((s, c) => s + (workSequenceCounts[c] || 0), 0);

  const toggleSequence = (color: OrderColor) => {
    if (workSequence.includes(color)) {
      onSequenceChange(workSequence.filter(c => c !== color));
    } else {
      onSequenceChange([...workSequence, color]);
    }
  };

  const toggleIntensiveCare = (color: OrderColor) => {
    if (intensiveCareColors.includes(color)) {
      onIntensiveCareChange(intensiveCareColors.filter(c => c !== color));
    } else {
      onIntensiveCareChange([...intensiveCareColors, color]);
    }
  };

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      {colorPickerKey !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }} onClick={() => setColorPickerKey(null)} />
      )}

      <div className="section-header">
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
        <h2>작업 현황</h2>
        {totalCount > 0 && (
          <span style={{
            marginLeft: 10, background: '#1e3a5f', color: '#93c5fd',
            borderRadius: 20, padding: '2px 12px', fontSize: 12, fontWeight: 800,
          }}>
            오늘 목표 {totalCount.toLocaleString()}건
          </span>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
          {workSequence.length > 0 ? `${workSequence.length}개 바코드` : '바코드 미선택'}
        </span>
      </div>

      <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* ── Row 1: 작업 순서 + 건수 입력 ── */}
        <div style={{
          background: '#f8fafc', borderRadius: 10, padding: '12px 14px',
          border: '1.5px solid #e2e8f0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: workSequence.length > 0 ? 10 : 0 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#475569', flexShrink: 0, minWidth: 54 }}>
              작업 순서
            </span>
            {workSequence.length === 0 && (
              <span style={{ flex: 1, fontSize: 12, color: '#94a3b8' }}>— 편집을 눌러 색상을 선택하세요 —</span>
            )}
            {workSequence.length > 0 && totalCount > 0 && (
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700, flex: 1 }}>
                합계 <strong style={{ color: '#1e293b', fontSize: 13 }}>{totalCount.toLocaleString()}</strong>건 = 오늘 목표
              </span>
            )}
            <button
              onClick={() => setEditMode(m => !m)}
              style={{
                background: editMode ? '#1e3a5f' : '#e2e8f0',
                color: editMode ? '#93c5fd' : '#475569',
                border: 'none', borderRadius: 7, padding: '6px 14px',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
              }}
            >
              {editMode ? '완료' : '편집'}
            </button>
          </div>

          {/* 선택된 색상 + 건수 입력 */}
          {workSequence.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, flexWrap: 'wrap' }}>
              {workSequence.map((color, i) => {
                const ci = ORDER_COLOR_MAP[color];
                const count = workSequenceCounts[color] || 0;
                return (
                  <span key={color} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {i > 0 && <span style={{ color: '#94a3b8', fontSize: 18, fontWeight: 700, alignSelf: 'center' }}>→</span>}
                    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <span style={{
                        background: ci.bg, color: ci.text,
                        borderRadius: 6, padding: '5px 11px',
                        fontSize: 13, fontWeight: 900, whiteSpace: 'nowrap',
                      }}>{ci.label}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                        <input
                          type="number" min={0}
                          value={count || ''}
                          placeholder="0"
                          onChange={e => onSequenceCountChange(color, Number(e.target.value))}
                          style={{
                            width: 52, height: 26,
                            border: `1.5px solid ${count > 0 ? ci.bg + '88' : '#e2e8f0'}`,
                            borderRadius: 5, textAlign: 'center',
                            fontSize: 12, fontWeight: 900, color: '#1e293b',
                            background: '#fff', outline: 'none',
                          }}
                        />
                        <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>건</span>
                      </span>
                    </span>
                  </span>
                );
              })}
            </div>
          )}

          {/* 편집 모드: 색상 선택 */}
          {editMode && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10, paddingTop: 10, borderTop: '1px solid #e2e8f0' }}>
              {ORDER_COLORS.map(color => {
                const ci = ORDER_COLOR_MAP[color];
                const selected = workSequence.includes(color);
                const idx = workSequence.indexOf(color);
                return (
                  <button key={color}
                    onClick={() => toggleSequence(color)}
                    style={{
                      background: selected ? ci.bg : '#fff',
                      color: selected ? ci.text : '#64748b',
                      border: `2px solid ${selected ? ci.bg : '#e2e8f0'}`,
                      borderRadius: 7, padding: '6px 13px',
                      fontSize: 12, fontWeight: 800, cursor: 'pointer',
                      opacity: selected ? 1 : 0.55, transition: 'all 0.15s',
                    }}
                  >
                    {ci.label}{selected ? ` (${idx + 1})` : ''}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Row 2: 공정별 현황 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {PROCESS_KEYS.map(key => {
            const { label } = PROCESS_LABELS[key];
            const status = processStatus[key];
            const col = status.color ? ORDER_COLOR_MAP[status.color] : null;
            const isOpen = colorPickerKey === key;

            return (
              <div key={key} style={{
                background: col ? col.bg + '0d' : '#f8fafc',
                border: `1.5px solid ${col ? col.bg + '55' : '#e2e8f0'}`,
                borderRadius: 10, padding: '10px 12px', position: 'relative',
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 7 }}>{label}</div>

                <div
                  onClick={e => { e.stopPropagation(); setColorPickerKey(isOpen ? null : key); }}
                  style={{
                    background: col ? col.bg : '#e2e8f0', color: col ? col.text : '#94a3b8',
                    borderRadius: 6, padding: '5px 8px', marginBottom: 7,
                    fontSize: 12, fontWeight: 800, cursor: 'pointer', textAlign: 'center',
                    border: isOpen ? '2px solid #1e293b' : '2px solid transparent', userSelect: 'none',
                  }}
                >
                  {col ? col.label : '색상 선택'} <span style={{ fontSize: 8, opacity: 0.7 }}>▼</span>
                </div>

                {isOpen && (
                  <div onClick={e => e.stopPropagation()} style={{
                    position: 'absolute', top: 72, left: 0, zIndex: 200,
                    background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
                    padding: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5, width: 155,
                  }}>
                    <div style={{ gridColumn: '1/-1', fontSize: 10, fontWeight: 700, color: '#64748b', textAlign: 'center', marginBottom: 3 }}>
                      색상 선택
                    </div>
                    <div onClick={() => { onProcessStatusChange(key, { color: '', progress: 0 }); setColorPickerKey(null); }}
                      style={{
                        gridColumn: '1/-1', background: '#f1f5f9', color: '#64748b',
                        borderRadius: 6, padding: '5px', textAlign: 'center', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                        border: !status.color ? '2px solid #1e293b' : '2px solid transparent', marginBottom: 2,
                      }}>없음</div>
                    {ORDER_COLORS.map(c => {
                      const ci = ORDER_COLOR_MAP[c];
                      return (
                        <div key={c}
                          onClick={() => { onProcessStatusChange(key, { ...status, color: c }); setColorPickerKey(null); }}
                          style={{
                            background: ci.bg, color: ci.text, borderRadius: 6, padding: '5px 2px',
                            textAlign: 'center', fontSize: 11, fontWeight: 800, cursor: 'pointer',
                            border: status.color === c ? '2px solid #1e293b' : '2px solid transparent',
                          }}
                        >{ci.label}</div>
                      );
                    })}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <input type="number" min={0} max={100}
                    value={status.progress || ''} placeholder="0"
                    disabled={!status.color}
                    onChange={e => {
                      const v = Math.min(100, Math.max(0, Number(e.target.value)));
                      onProcessStatusChange(key, { ...status, progress: v });
                    }}
                    style={{
                      flex: 1, height: 30, border: `1.5px solid ${col ? col.bg + '66' : '#e2e8f0'}`,
                      borderRadius: 6, textAlign: 'center', fontSize: 14, fontWeight: 900, color: '#1e293b',
                      background: status.color ? '#fff' : '#f1f5f9', outline: 'none',
                      opacity: status.color ? 1 : 0.45, cursor: status.color ? 'text' : 'not-allowed',
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>%</span>
                </div>

                {status.color && (
                  <div style={{ height: 4, background: '#e2e8f0', borderRadius: 2, marginTop: 7, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${status.progress}%`,
                      background: col?.bg ?? '#94a3b8', borderRadius: 2, transition: 'width 0.3s',
                    }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Row 3: 집중케어 세탁진행 ── */}
        <div style={{
          background: '#f8fafc', border: '1.5px solid #e2e8f0',
          borderRadius: 10, padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#475569', flexShrink: 0 }}>
            🎯 집중케어 세탁진행
          </span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {ORDER_COLORS.map(color => {
              const ci = ORDER_COLOR_MAP[color];
              const selected = intensiveCareColors.includes(color);
              return (
                <button key={color}
                  onClick={() => toggleIntensiveCare(color)}
                  style={{
                    background: selected ? ci.bg : '#fff', color: selected ? ci.text : '#94a3b8',
                    border: `1.5px solid ${selected ? ci.bg : '#e2e8f0'}`,
                    borderRadius: 6, padding: '4px 10px',
                    fontSize: 11, fontWeight: 800, cursor: 'pointer',
                    opacity: selected ? 1 : 0.5, transition: 'all 0.15s',
                  }}
                >{ci.label}</button>
              );
            })}
          </div>
          {intensiveCareColors.length === 0 && (
            <span style={{ fontSize: 11, color: '#94a3b8' }}>선택된 색상 없음</span>
          )}
        </div>

      </div>
    </div>
  );
}
