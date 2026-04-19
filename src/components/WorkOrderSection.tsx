import { useState } from 'react';
import { OrderColor } from '../types';
import { ORDER_COLOR_MAP, ORDER_COLORS } from '../constants';

interface Props {
  workSequence: OrderColor[];
  workSequenceCounts: Partial<Record<OrderColor, number>>;
  intensiveCareColors: OrderColor[];
  editMode: boolean;
  onSequenceChange: (colors: OrderColor[]) => void;
  onSequenceCountChange: (color: OrderColor, count: number) => void;
  onIntensiveCareChange: (colors: OrderColor[]) => void;
}

export function WorkOrderSection({
  workSequence, workSequenceCounts, intensiveCareColors, editMode,
  onSequenceChange, onSequenceCountChange, onIntensiveCareChange,
}: Props) {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  const totalCount = workSequence.reduce(
    (s, c) => s + (workSequenceCounts[c] || 0), 0,
  );

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
    <div className="card" style={{ marginBottom: 10 }}>
      {colorPickerOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 100 }}
          onClick={() => setColorPickerOpen(false)}
        />
      )}

      <div className="card-header">
        <h2>📋 작업 순서 및 건수</h2>
        {totalCount > 0 && (
          <span style={{
            marginLeft: 8,
            background: '#1e3a5f', color: '#93c5fd',
            borderRadius: 20, padding: '2px 10px',
            fontSize: 12, fontWeight: 800, fontVariantNumeric: 'tabular-nums',
          }}>
            오늘 목표 {totalCount.toLocaleString()}건
          </span>
        )}
        {editMode && (
          <button
            onClick={() => setColorPickerOpen(o => !o)}
            style={{
              marginLeft: 'auto',
              background: colorPickerOpen ? '#1e3a5f' : '#e2e8f0',
              color: colorPickerOpen ? '#93c5fd' : '#475569',
              border: 'none', borderRadius: 7, padding: '5px 12px',
              fontSize: 11, fontWeight: 700, cursor: 'pointer', position: 'relative', zIndex: 101,
            }}
          >
            {colorPickerOpen ? '완료' : '+ 색상 편집'}
          </button>
        )}
      </div>

      <div style={{ padding: '10px 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* ── 색상 피커 (편집 모드 + 열림) ── */}
        {editMode && colorPickerOpen && (
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#f8fafc', border: '1px solid #e2e8f0',
              borderRadius: 8, padding: '10px 12px',
              display: 'flex', flexWrap: 'wrap', gap: 6, zIndex: 101, position: 'relative',
            }}
          >
            <div style={{ width: '100%', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>
              색상 선택 (클릭하여 추가/제거, 선택 순서대로 정렬)
            </div>
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
                    borderRadius: 7, padding: '5px 12px',
                    fontSize: 12, fontWeight: 800, cursor: 'pointer',
                    opacity: selected ? 1 : 0.6,
                  }}
                >
                  {ci.label}{selected ? ` ·${idx + 1}` : ''}
                </button>
              );
            })}
          </div>
        )}

        {/* ── VIEW: 4-컬럼 작업 순서 테이블 ── */}
        {workSequence.length === 0 ? (
          <div style={{ fontSize: 12, color: '#94a3b8', padding: '12px 0', textAlign: 'center' }}>
            {editMode ? '우측 "색상 편집" 버튼으로 작업 색상을 추가하세요' : '— 작업 순서 미입력'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 4, borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ width: 88, fontSize: 10, fontWeight: 700, color: '#94a3b8', flexShrink: 0 }}>색상</div>
              <div style={{ flex: 1, fontSize: 10, fontWeight: 700, color: '#94a3b8' }}>진행 비율</div>
              <div style={{ width: 56, textAlign: 'right', fontSize: 10, fontWeight: 700, color: '#94a3b8' }}>건수</div>
              <div style={{ width: 44, textAlign: 'right', fontSize: 10, fontWeight: 700, color: '#94a3b8' }}>비율</div>
            </div>

            {workSequence.map((color, rowIdx) => {
              const ci = ORDER_COLOR_MAP[color];
              const count = workSequenceCounts[color] || 0;
              const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
              const isIntensive = intensiveCareColors.includes(color);

              return (
                <div key={color} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* Swatch + name (88px) */}
                  <div style={{ width: 88, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: ci.bg, display: 'inline-block', flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
                      {rowIdx + 1}. {ci.label}
                    </span>
                    {isIntensive && (
                      <span style={{ fontSize: 9, fontWeight: 800, color: '#7c3aed', background: '#ede9fe', borderRadius: 3, padding: '1px 3px' }}>집중</span>
                    )}
                  </div>

                  {/* Progress bar (flex) */}
                  <div style={{ flex: 1, height: 20, background: '#f1f5f9', borderRadius: 5, overflow: 'hidden', position: 'relative' }}>
                    {count > 0 && (
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: ci.bg, opacity: 0.75, borderRadius: 5,
                        transition: 'width 0.4s',
                        minWidth: count > 0 ? 4 : 0,
                      }} />
                    )}
                    {count > 0 && pct >= 12 && (
                      <span style={{
                        position: 'absolute', left: `${Math.min(pct - 1, 95)}%`,
                        top: '50%', transform: 'translate(-50%, -50%)',
                        fontSize: 10, fontWeight: 800, color: '#fff',
                        whiteSpace: 'nowrap',
                        textShadow: '0 0 4px rgba(0,0,0,0.4)',
                      }}>
                        {count.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Count (56px) */}
                  {editMode ? (
                    <input
                      type="number" min={0}
                      value={count || ''} placeholder="0"
                      onChange={e => onSequenceCountChange(color, Number(e.target.value))}
                      style={{
                        width: 56, height: 26,
                        border: `1.5px solid ${count > 0 ? ci.bg + '88' : '#e2e8f0'}`,
                        borderRadius: 5, textAlign: 'center',
                        fontSize: 12, fontWeight: 800, color: '#1e293b',
                        background: '#fff', outline: 'none',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    />
                  ) : (
                    <div style={{
                      width: 56, textAlign: 'right',
                      fontSize: 13, fontWeight: 800, color: count > 0 ? '#1e293b' : '#d1d5db',
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {count > 0 ? count.toLocaleString() : '—'}
                    </div>
                  )}

                  {/* % (44px) */}
                  <div style={{
                    width: 44, textAlign: 'right',
                    fontSize: 12, fontWeight: 700,
                    color: count > 0 ? '#64748b' : '#d1d5db',
                  }}>
                    {count > 0 ? `${pct}%` : '—'}
                  </div>
                </div>
              );
            })}

            {/* Total row */}
            {totalCount > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                paddingTop: 4, borderTop: '1px solid #f1f5f9',
              }}>
                <div style={{ width: 88, fontSize: 11, fontWeight: 700, color: '#64748b' }}>합계</div>
                <div style={{ flex: 1 }} />
                <div style={{
                  width: 56, textAlign: 'right',
                  fontSize: 14, fontWeight: 900, color: '#1e293b',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {totalCount.toLocaleString()}
                </div>
                <div style={{ width: 44, textAlign: 'right', fontSize: 12, fontWeight: 700, color: '#64748b' }}>
                  100%
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── 집중케어 ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#faf5ff', border: '1px solid #e9d5ff',
          borderRadius: 8, padding: '8px 12px', flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#7c3aed', flexShrink: 0 }}>
            🎯 집중케어 세탁진행
          </span>
          {editMode ? (
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {ORDER_COLORS.map(color => {
                const ci = ORDER_COLOR_MAP[color];
                const selected = intensiveCareColors.includes(color);
                return (
                  <button key={color}
                    onClick={() => toggleIntensiveCare(color)}
                    style={{
                      background: selected ? ci.bg : '#fff',
                      color: selected ? ci.text : '#94a3b8',
                      border: `1.5px solid ${selected ? ci.bg : '#e2e8f0'}`,
                      borderRadius: 6, padding: '3px 9px',
                      fontSize: 11, fontWeight: 800, cursor: 'pointer',
                      opacity: selected ? 1 : 0.55,
                    }}
                  >
                    {ci.label}
                  </button>
                );
              })}
            </div>
          ) : (
            intensiveCareColors.length > 0 ? (
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {intensiveCareColors.map(color => {
                  const ci = ORDER_COLOR_MAP[color];
                  return (
                    <span key={color} style={{
                      background: ci.bg, color: ci.text,
                      borderRadius: 6, padding: '3px 9px',
                      fontSize: 11, fontWeight: 800,
                    }}>
                      {ci.label}
                    </span>
                  );
                })}
              </div>
            ) : (
              <span style={{ fontSize: 11, color: '#94a3b8' }}>선택 없음</span>
            )
          )}
        </div>

      </div>
    </div>
  );
}
