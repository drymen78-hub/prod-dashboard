import React, { useState } from 'react';
import { WorkOrder, ProcessStage, OrderColor } from '../types';
import { ORDER_COLOR_MAP, STAGE_MAP, STAGE_ORDER, STAGE_COLUMNS, ORDER_COLORS, StageField } from '../constants';

function cycleStage(current: ProcessStage): ProcessStage {
  const idx = STAGE_ORDER.indexOf(current);
  return STAGE_ORDER[(idx + 1) % STAGE_ORDER.length];
}

function calcProgress(wo: WorkOrder): number {
  const fields: StageField[] = ['classification', 'dryCleaning', 'intensiveCare', 'wet', 'shirts'];
  const active = fields.filter(f => wo[f] !== '');
  if (active.length === 0) return 0;
  return Math.round(active.reduce((s, f) => s + STAGE_MAP[wo[f]].weight, 0) / active.length);
}

// 단계 행 컴포넌트
function StageRow({
  label, desc, stage, onCycle, isActive, indent = false,
}: {
  label: string; desc: string; stage: ProcessStage;
  onCycle: () => void; isActive: boolean; indent?: boolean;
}) {
  const info = STAGE_MAP[stage];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '3px 0', paddingLeft: indent ? 16 : 0,
    }}>
      {indent && <span style={{ fontSize: 10, color: '#94a3b8', flexShrink: 0 }}>↳</span>}
      <div style={{ minWidth: indent ? 52 : 64, flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: indent ? '#94a3b8' : '#475569' }}>{label}</div>
        {!indent && <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 1 }}>{desc}</div>}
      </div>
      <div
        role="button" tabIndex={isActive ? 0 : -1}
        onClick={() => isActive && onCycle()}
        onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && isActive) { e.preventDefault(); onCycle(); }}}
        title={isActive ? '클릭하여 단계 변경' : '건수를 먼저 입력하세요'}
        style={{
          flex: 1, padding: '5px 0', borderRadius: 6,
          background: info.bg, color: info.text,
          border: `1px solid ${info.border}`,
          textAlign: 'center', fontSize: indent ? 11 : 12, fontWeight: 800,
          cursor: isActive ? 'pointer' : 'default',
          userSelect: 'none', lineHeight: 1.2,
          opacity: isActive ? 1 : 0.6,
        }}
      >
        {info.label}
      </div>
    </div>
  );
}

interface Props {
  workOrders: WorkOrder[];
  totalCount: number;
  onCountChange: (id: string, count: number) => void;
  onStageChange: (id: string, field: StageField, stage: ProcessStage) => void;
  onColorChange: (id: string, color: OrderColor) => void;
}

export function WorkOrderTable({ workOrders, totalCount, onCountChange, onStageChange, onColorChange }: Props) {
  const [colorPickerId, setColorPickerId] = useState<string | null>(null);

  const activeOrders = workOrders.filter(wo => wo.count > 0);
  const doneCount    = activeOrders.filter(wo => calcProgress(wo) === 100).length;
  const inProgCount  = activeOrders.filter(wo => { const p = calcProgress(wo); return p > 0 && p < 100; }).length;
  const notStarted   = activeOrders.filter(wo => calcProgress(wo) === 0).length;

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      {/* 색상 선택창 오버레이 */}
      {colorPickerId !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 150 }} onClick={() => setColorPickerId(null)} />
      )}

      <div className="section-header">
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
        <h2>작업 현황</h2>
        <div style={{ display: 'flex', gap: 6, marginLeft: 12 }}>
          {notStarted > 0 && <span style={{ background: '#f1f5f9', color: '#475569', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>미진행 {notStarted}</span>}
          {inProgCount > 0 && <span style={{ background: '#fef9c3', color: '#854d0e', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>진행중 {inProgCount}</span>}
          {doneCount > 0 && <span style={{ background: '#dcfce7', color: '#15803d', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>완료 {doneCount}</span>}
        </div>
        <span style={{ marginLeft: 'auto', background: '#1e3a5f', color: '#93c5fd', borderRadius: 20, padding: '3px 16px', fontSize: 13, fontWeight: 800 }}>
          총 <span style={{ fontSize: 20, fontWeight: 900 }}>{totalCount.toLocaleString()}</span>건
        </span>
      </div>

      {/* 가로 카드 그리드 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10,
        padding: '12px 16px',
      }}>
        {workOrders.map(wo => {
          const col = ORDER_COLOR_MAP[wo.color];
          const progress = calcProgress(wo);
          const isActive = wo.count > 0;
          const isOpen = colorPickerId === wo.id;

          const progressColor =
            progress === 100 ? '#22c55e' :
            progress >= 75   ? '#f97316' :
            progress >= 50   ? '#eab308' : '#60a5fa';

          return (
            <div key={wo.id} style={{
              background: isActive ? '#fff' : '#f8fafc',
              border: `2px solid ${isActive ? col.bg + '55' : '#e2e8f0'}`,
              borderRadius: 12,
              opacity: isActive ? 1 : 0.55,
              display: 'flex', flexDirection: 'column',
              overflow: 'visible', position: 'relative',
            }}>
              {/* 카드 상단: 색상 배지 + 건수 */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 12px 8px',
                borderBottom: '1px solid #e2e8f0',
                background: col.bg + '0d',
                borderRadius: '10px 10px 0 0',
              }}>
                {/* 색상 배지 (클릭 → 색상 변경) */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div
                    onClick={e => { e.stopPropagation(); setColorPickerId(isOpen ? null : wo.id); }}
                    style={{
                      background: col.bg, color: col.text,
                      borderRadius: 8, padding: '6px 10px',
                      fontWeight: 900, fontSize: 13,
                      cursor: 'pointer',
                      border: isOpen ? '2px solid #1e293b' : '2px solid rgba(255,255,255,0.3)',
                      userSelect: 'none', lineHeight: 1,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {col.label}
                    <span style={{ fontSize: 8, opacity: 0.8, marginLeft: 3 }}>▼</span>
                  </div>

                  {/* 색상 선택 팝업 */}
                  {isOpen && (
                    <div onClick={e => e.stopPropagation()} style={{
                      position: 'absolute', top: '100%', left: 0, zIndex: 200,
                      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
                      padding: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5,
                      width: 140, marginTop: 4,
                    }}>
                      <div style={{ gridColumn: '1/-1', fontSize: 10, fontWeight: 700, color: '#64748b', textAlign: 'center', marginBottom: 2 }}>
                        색상 선택
                      </div>
                      {ORDER_COLORS.map(c => {
                        const ci = ORDER_COLOR_MAP[c];
                        return (
                          <div key={c}
                            onClick={() => { onColorChange(wo.id, c); setColorPickerId(null); }}
                            style={{
                              background: ci.bg, color: ci.text,
                              borderRadius: 6, padding: '6px 2px',
                              textAlign: 'center', fontSize: 12, fontWeight: 800,
                              cursor: 'pointer',
                              border: wo.color === c ? '2px solid #1e293b' : '2px solid transparent',
                            }}
                          >{ci.label}</div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 건수 입력 */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600, marginBottom: 2 }}>건수</div>
                  <input
                    type="number" min={0}
                    value={wo.count || ''} placeholder="0"
                    onChange={e => onCountChange(wo.id, Number(e.target.value))}
                    style={{
                      width: '100%', height: 30,
                      border: `1.5px solid ${isActive ? col.bg + '66' : '#e2e8f0'}`,
                      borderRadius: 6, textAlign: 'center',
                      fontSize: 15, fontWeight: 900, color: '#1e293b',
                      background: '#fff', outline: 'none',
                    }}
                  />
                </div>

                {/* 진행률 */}
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600, marginBottom: 2 }}>진행률</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: isActive ? progressColor : '#d1d5db' }}>
                    {isActive ? `${progress}%` : '—'}
                  </div>
                </div>
              </div>

              {/* 공정 단계 목록 */}
              <div style={{ padding: '8px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {STAGE_COLUMNS.map(col => {
                  const stage = wo[col.key as StageField];
                  return (
                    <React.Fragment key={col.key}>
                      <StageRow
                        label={col.label} desc={col.desc}
                        stage={stage}
                        onCycle={() => onStageChange(wo.id, col.key as StageField, cycleStage(stage))}
                        isActive={isActive}
                      />
                      {/* 드라이클리닝 아래 집중케어 배지 */}
                      {col.key === 'dryCleaning' && (
                        <StageRow
                          label="집중케어" desc="집중케어세탁"
                          stage={wo.intensiveCare}
                          onCycle={() => onStageChange(wo.id, 'intensiveCare', cycleStage(wo.intensiveCare))}
                          isActive={isActive}
                          indent
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* 하단 진행 바 */}
              {isActive && (
                <div style={{ padding: '6px 12px 10px' }}>
                  <div style={{ height: 5, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${progress}%`, borderRadius: 3,
                      transition: 'width 0.3s', background: progressColor,
                    }} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 합계 + 범례 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', borderTop: '2px solid #e2e8f0',
        background: '#1e3a5f', borderRadius: '0 0 12px 12px',
      }}>
        <div>
          {activeOrders.length > 0 && (
            <span style={{ color: '#93c5fd', fontSize: 13 }}>
              활성 {activeOrders.length}개 바코드 · 평균 진행률{' '}
              <strong>{Math.round(activeOrders.reduce((s, wo) => s + calcProgress(wo), 0) / activeOrders.length)}%</strong>
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>단계:</span>
          {STAGE_ORDER.filter(s => s !== '').map(s => {
            const info = STAGE_MAP[s];
            return (
              <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: info.text, fontWeight: 700 }}>
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: info.bg, border: `1px solid ${info.border}` }} />
                {info.label}
              </span>
            );
          })}
        </div>
        <span style={{ fontWeight: 900, fontSize: 22, color: '#fff' }}>
          {totalCount.toLocaleString()}
          <span style={{ fontSize: 13, fontWeight: 700, color: '#93c5fd', marginLeft: 3 }}>건</span>
        </span>
      </div>
    </div>
  );
}
