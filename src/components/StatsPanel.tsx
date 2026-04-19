import { useState } from 'react';
import { ProcessStatusMap, ProcessKey, ProcessStatus, OrderColor } from '../types';
import { PROCESS_KEYS, PROCESS_LABELS, ORDER_COLOR_MAP, ORDER_COLORS } from '../constants';

interface Props {
  processStatus: ProcessStatusMap;
  avgItemsPerUnit: number;
  washMethodCount: number;
  totalCount: number;
  expectedTotal: number;
  processingRate: number;
  editMode: boolean;
  onProcessStatusChange: (key: ProcessKey, status: ProcessStatus) => void;
  onAvgChange: (v: number) => void;
  onWashCountChange: (v: number) => void;
}

export function StatsPanel({
  processStatus, avgItemsPerUnit, washMethodCount,
  expectedTotal, processingRate, editMode,
  onProcessStatusChange, onAvgChange, onWashCountChange,
}: Props) {
  const [colorPickerKey, setColorPickerKey] = useState<ProcessKey | null>(null);

  const rateColor =
    processingRate >= 80 ? '#16a34a' :
    processingRate >= 50 ? '#d97706' : '#dc2626';

  return (
    <div className="card" style={{ marginBottom: 10 }}>
      {colorPickerKey !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }} onClick={() => setColorPickerKey(null)} />
      )}

      <div className="card-header">
        <h2>✅ 공정 품질 체크</h2>
        {processingRate > 0 && (
          <span style={{
            marginLeft: 'auto', fontSize: 13, fontWeight: 900,
            color: rateColor,
          }}>
            처리율 {processingRate}%
            {processingRate >= 80 ? ' ✓' : ''}
          </span>
        )}
      </div>

      <div style={{ padding: '10px 14px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* 4 process quality cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {PROCESS_KEYS.map(key => {
            const { label } = PROCESS_LABELS[key];
            const status = processStatus[key];
            const col = status.color ? ORDER_COLOR_MAP[status.color] : null;
            const prog = status.progress;
            const done = prog >= 100;
            const mid  = prog >= 40 && prog < 100;
            const isOpen = colorPickerKey === key;

            const cardBg = !col ? '#f8fafc' : done ? '#f0fdf4' : mid ? '#fffbeb' : '#f8fafc';
            const cardBorder = !col ? '#e2e8f0' : done ? '#86efac' : mid ? '#fde68a' : '#e2e8f0';
            const progColor = done ? '#16a34a' : mid ? '#d97706' : '#94a3b8';

            return (
              <div key={key} style={{
                background: cardBg, border: `1.5px solid ${cardBorder}`,
                borderRadius: 8, padding: '10px 10px 8px',
                position: 'relative',
                transition: 'border-color 0.2s, background 0.2s',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
                  {label}
                </div>

                {/* Color indicator */}
                {editMode ? (
                  <div
                    onClick={e => { e.stopPropagation(); setColorPickerKey(isOpen ? null : key); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      background: col ? col.bg : '#e2e8f0',
                      color: col ? col.text : '#94a3b8',
                      borderRadius: 5, padding: '4px 7px', marginBottom: 7,
                      fontSize: 11, fontWeight: 800, cursor: 'pointer',
                      border: isOpen ? '2px solid #1e293b' : '2px solid transparent',
                      userSelect: 'none',
                    }}
                  >
                    {col ? col.label : '색상▾'}
                    <span style={{ fontSize: 8, opacity: 0.7, marginLeft: 1 }}>▼</span>
                  </div>
                ) : (
                  col && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: col.bg, display: 'inline-block', flexShrink: 0,
                      }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>
                        {col.label}
                      </span>
                    </div>
                  )
                )}

                {/* Color picker dropdown */}
                {isOpen && editMode && (
                  <div onClick={e => e.stopPropagation()} style={{
                    position: 'absolute', top: 70, left: 0, zIndex: 200,
                    background: '#fff', border: '1px solid #e2e8f0',
                    borderRadius: 8, padding: 8,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 4, width: 148,
                  }}>
                    <div
                      onClick={() => { onProcessStatusChange(key, { color: '', progress: 0 }); setColorPickerKey(null); }}
                      style={{
                        gridColumn: '1/-1', background: '#f1f5f9', color: '#64748b',
                        borderRadius: 5, padding: '4px', textAlign: 'center',
                        fontSize: 11, fontWeight: 700, cursor: 'pointer',
                        border: !status.color ? '2px solid #1e293b' : '2px solid transparent',
                        marginBottom: 2,
                      }}
                    >없음</div>
                    {ORDER_COLORS.map((c: OrderColor) => {
                      const ci = ORDER_COLOR_MAP[c];
                      return (
                        <div key={c}
                          onClick={() => { onProcessStatusChange(key, { ...status, color: c }); setColorPickerKey(null); }}
                          style={{
                            background: ci.bg, color: ci.text, borderRadius: 5,
                            padding: '4px 2px', textAlign: 'center',
                            fontSize: 10, fontWeight: 800, cursor: 'pointer',
                            border: status.color === c ? '2px solid #1e293b' : '2px solid transparent',
                          }}
                        >{ci.label}</div>
                      );
                    })}
                  </div>
                )}

                {/* Progress display / input */}
                {editMode ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input type="number" min={0} max={100}
                      value={status.progress || ''} placeholder="0"
                      disabled={!status.color}
                      onChange={e => {
                        const v = Math.min(100, Math.max(0, Number(e.target.value)));
                        onProcessStatusChange(key, { ...status, progress: v });
                      }}
                      style={{
                        flex: 1, height: 28,
                        border: `1.5px solid ${col ? col.bg + '66' : '#e2e8f0'}`,
                        borderRadius: 5, textAlign: 'center',
                        fontSize: 14, fontWeight: 900, color: '#1e293b',
                        background: status.color ? '#fff' : '#f1f5f9',
                        outline: 'none', opacity: status.color ? 1 : 0.4,
                        cursor: status.color ? 'text' : 'not-allowed',
                      }}
                    />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>%</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                    {col ? (
                      <>
                        <span style={{
                          fontSize: 20, fontWeight: 900, color: progColor,
                          fontVariantNumeric: 'tabular-nums',
                        }}>
                          {done ? '✓' : ''}{prog}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: progColor }}>%</span>
                      </>
                    ) : (
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#d1d5db' }}>—</span>
                    )}
                  </div>
                )}

                {/* Mini bar */}
                {col && (
                  <div style={{ height: 3, background: '#e2e8f0', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${prog}%`,
                      background: progColor, borderRadius: 2, transition: 'width 0.3s',
                    }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 처리율 통계 */}
        <div style={{
          background: processingRate > 0
            ? (processingRate >= 80 ? '#f0fdf4' : processingRate >= 50 ? '#fffbeb' : '#fff7ed')
            : '#f8fafc',
          border: `1px solid ${processingRate >= 80 ? '#86efac' : processingRate >= 50 ? '#fde68a' : processingRate > 0 ? '#fdba74' : '#e2e8f0'}`,
          borderRadius: 8, padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
        }}>
          {/* 야간 세탁분류건수 */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>
              야간 세탁분류건수
            </div>
            {editMode ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input type="number" min={0}
                  value={washMethodCount || ''} placeholder="0"
                  onChange={e => onWashCountChange(Number(e.target.value))}
                  style={{
                    width: 80, height: 32,
                    border: `1.5px solid ${washMethodCount > 0 ? '#f9731688' : '#e2e8f0'}`,
                    borderRadius: 7, textAlign: 'center',
                    fontSize: 16, fontWeight: 900, color: '#1e293b',
                    background: '#fff', outline: 'none',
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>개</span>
              </div>
            ) : (
              <div style={{ fontSize: 20, fontWeight: 800, color: washMethodCount > 0 ? '#1e293b' : '#d1d5db', fontVariantNumeric: 'tabular-nums' }}>
                {washMethodCount > 0 ? washMethodCount.toLocaleString() : '—'}
                {washMethodCount > 0 && <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginLeft: 3 }}>개</span>}
              </div>
            )}
          </div>

          {/* 전주 동요일 건당개별수 */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>
              전주 동요일 건당개별수
            </div>
            {editMode ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input type="number" min={0} step={0.1}
                  value={avgItemsPerUnit || ''} placeholder="0.0"
                  onChange={e => onAvgChange(Number(e.target.value))}
                  style={{
                    width: 72, height: 32,
                    border: `1.5px solid ${avgItemsPerUnit > 0 ? '#2563eb88' : '#e2e8f0'}`,
                    borderRadius: 7, textAlign: 'center',
                    fontSize: 16, fontWeight: 900, color: '#1e293b',
                    background: '#fff', outline: 'none',
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>개/건</span>
              </div>
            ) : (
              <div style={{ fontSize: 20, fontWeight: 800, color: avgItemsPerUnit > 0 ? '#1e293b' : '#d1d5db', fontVariantNumeric: 'tabular-nums' }}>
                {avgItemsPerUnit > 0 ? avgItemsPerUnit : '—'}
                {avgItemsPerUnit > 0 && <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginLeft: 3 }}>개/건</span>}
              </div>
            )}
          </div>

          {/* 예상 총출고 + 처리율 */}
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>
              처리율 (야간분류 / 예상출고)
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: processingRate > 0 ? rateColor : '#d1d5db', fontVariantNumeric: 'tabular-nums' }}>
              {processingRate > 0 ? `${processingRate}%` : '—'}
            </div>
            {expectedTotal > 0 && washMethodCount > 0 && (
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>
                {washMethodCount.toLocaleString()} ÷ {expectedTotal.toLocaleString()} × 100
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
