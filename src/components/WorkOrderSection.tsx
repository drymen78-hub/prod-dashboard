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
        {editMode && (
          <button
            onClick={() => setColorPickerOpen(o => !o)}
            style={{
              marginLeft: 'auto',
              background: colorPickerOpen ? '#1e3a5f' : '#e2e8f0',
              color: colorPickerOpen ? '#93c5fd' : '#475569',
              border: 'none', borderRadius: 7, padding: '5px 12px',
              fontSize: 11, fontWeight: 700, cursor: 'pointer',
              position: 'relative', zIndex: 101,
            }}
          >
            {colorPickerOpen ? '완료' : '+ 색상 편집'}
          </button>
        )}
      </div>

      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* 색상 피커 (편집 모드) */}
        {editMode && colorPickerOpen && (
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#f8fafc', border: '1px solid #e2e8f0',
              borderRadius: 8, padding: '10px 12px',
              display: 'flex', flexWrap: 'wrap', gap: 6,
              zIndex: 101, position: 'relative',
            }}
          >
            <div style={{ width: '100%', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>
              색상 선택 (클릭하여 추가/제거)
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

        {/* 가로 화살표 체인 */}
        {workSequence.length === 0 ? (
          <div style={{ fontSize: 12, color: '#94a3b8', padding: '10px 0', textAlign: 'center' }}>
            {editMode ? '"색상 편집" 버튼으로 작업 색상을 추가하세요' : '— 작업 순서 미입력'}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4, flexWrap: 'wrap' }}>
            {workSequence.map((color, i) => {
              const ci = ORDER_COLOR_MAP[color];
              const count = workSequenceCounts[color] || 0;
              const isIntensive = intensiveCareColors.includes(color);
              return (
                <span key={color} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {i > 0 && (
                    <span style={{ color: '#94a3b8', fontSize: 18, fontWeight: 700, alignSelf: 'center', marginTop: -6 }}>
                      →
                    </span>
                  )}
                  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                    {/* 색상 칩 */}
                    <span style={{
                      background: ci.bg, color: ci.text,
                      borderRadius: 7, padding: '5px 13px',
                      fontSize: 13, fontWeight: 900, whiteSpace: 'nowrap',
                      position: 'relative',
                    }}>
                      {ci.label}
                      {isIntensive && (
                        <span style={{
                          position: 'absolute', top: -5, right: -5,
                          fontSize: 8, fontWeight: 800, color: '#7c3aed',
                          background: '#ede9fe', borderRadius: 3, padding: '1px 3px',
                        }}>집중</span>
                      )}
                    </span>
                    {/* 건수 */}
                    {editMode ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                        <input
                          type="number" min={0}
                          value={count || ''} placeholder="0"
                          onChange={e => onSequenceCountChange(color, Number(e.target.value))}
                          style={{
                            width: 52, height: 26,
                            border: `1.5px solid ${count > 0 ? ci.bg + '88' : '#e2e8f0'}`,
                            borderRadius: 5, textAlign: 'center',
                            fontSize: 12, fontWeight: 800, color: '#1e293b',
                            background: '#fff', outline: 'none',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        />
                        <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>건</span>
                      </span>
                    ) : (
                      <span style={{
                        fontSize: 13, fontWeight: 800,
                        color: count > 0 ? '#1e293b' : '#d1d5db',
                        fontVariantNumeric: 'tabular-nums',
                      }}>
                        {count > 0 ? `${count.toLocaleString()}건` : '—'}
                      </span>
                    )}
                  </span>
                </span>
              );
            })}
          </div>
        )}

        {/* 집중케어 */}
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
