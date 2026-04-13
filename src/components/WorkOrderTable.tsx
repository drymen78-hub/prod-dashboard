import React, { useState } from 'react';
import { WorkOrder, ProcessStage, OrderColor } from '../types';
import { ORDER_COLOR_MAP, STAGE_MAP, STAGE_ORDER, STAGE_COLUMNS, ORDER_COLORS, StageField } from '../constants';

function cycleStage(current: ProcessStage): ProcessStage {
  const idx = STAGE_ORDER.indexOf(current);
  return STAGE_ORDER[(idx + 1) % STAGE_ORDER.length];
}

function calcProgress(wo: WorkOrder): number {
  const fields: StageField[] = ['classification', 'dryCleaning', 'wet', 'shirts', 'intensiveCare'];
  const active = fields.filter(f => wo[f] !== '');
  if (active.length === 0) return 0;
  return Math.round(active.reduce((s, f) => s + STAGE_MAP[wo[f]].weight, 0) / active.length);
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
  const doneCount   = activeOrders.filter(wo => calcProgress(wo) === 100).length;
  const inProgCount = activeOrders.filter(wo => { const p = calcProgress(wo); return p > 0 && p < 100; }).length;
  const notStarted  = activeOrders.filter(wo => calcProgress(wo) === 0).length;

  const thStyle: React.CSSProperties = {
    padding: '9px 6px', fontSize: 12, fontWeight: 700, color: '#475569',
    textAlign: 'center', background: '#f1f5f9', borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap',
  };

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      {/* 색상 선택창 열렸을 때 바깥 클릭 감지용 오버레이 */}
      {colorPickerId !== null && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 150 }}
          onClick={() => setColorPickerId(null)}
        />
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

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '10%' }} /><col style={{ width: '8%' }} /><col style={{ width: '8%' }} />
            <col style={{ width: '15%' }} /><col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} /><col style={{ width: '15%' }} /><col style={{ width: '14%' }} />
          </colgroup>
          <thead>
            <tr>
              <th style={thStyle}>작업순서<br/><span style={{ fontSize: 9, fontWeight: 500, color: '#94a3b8' }}>클릭=색상변경</span></th>
              <th style={thStyle}>건수</th><th style={thStyle}>진행률</th>
              <th style={thStyle}>대분류</th><th style={thStyle}>드라이클리닝</th>
              <th style={thStyle}>웨트</th><th style={thStyle}>셔츠</th><th style={thStyle}>집중케어세탁</th>
            </tr>
          </thead>
          <tbody>
            {workOrders.map((wo, idx) => {
              const col = ORDER_COLOR_MAP[wo.color];
              const progress = calcProgress(wo);
              const isActive = wo.count > 0;
              const isOpen = colorPickerId === wo.id;

              return (
                <tr key={wo.id} style={{ background: idx % 2 === 0 ? '#fff' : '#f8fafc', opacity: isActive ? 1 : 0.45 }}>
                  {/* 색상 선택 셀 */}
                  <td style={{ padding: '4px 6px', position: 'relative' }}>
                    <div
                      onClick={e => { e.stopPropagation(); setColorPickerId(isOpen ? null : wo.id); }}
                      style={{
                        background: col.bg, color: col.text,
                        borderRadius: 8, padding: '7px 4px',
                        textAlign: 'center', fontWeight: 900, fontSize: 14,
                        cursor: 'pointer',
                        border: isOpen ? '2px solid #1e293b' : '2px solid rgba(255,255,255,0.3)',
                        userSelect: 'none', lineHeight: 1.2,
                      }}
                    >
                      {col.label}
                      <div style={{ fontSize: 9, opacity: 0.75, marginTop: 2 }}>▼ 변경</div>
                    </div>

                    {/* 색상 선택 팝업 */}
                    {isOpen && (
                      <div
                        onClick={e => e.stopPropagation()}
                        style={{
                          position: 'absolute', top: '100%', left: 0, zIndex: 200,
                          background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
                          padding: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5,
                          width: 140, marginTop: 4,
                        }}
                      >
                        <div style={{ gridColumn: '1/-1', fontSize: 10, fontWeight: 700, color: '#64748b', textAlign: 'center', marginBottom: 2 }}>
                          색상 선택
                        </div>
                        {ORDER_COLORS.map(c => {
                          const ci = ORDER_COLOR_MAP[c];
                          return (
                            <div
                              key={c}
                              onClick={() => { onColorChange(wo.id, c); setColorPickerId(null); }}
                              style={{
                                background: ci.bg, color: ci.text,
                                borderRadius: 6, padding: '6px 2px',
                                textAlign: 'center', fontSize: 12, fontWeight: 800,
                                cursor: 'pointer',
                                border: wo.color === c ? '2px solid #1e293b' : '2px solid transparent',
                                outline: wo.color === c ? '1px solid #1e293b' : 'none',
                              }}
                            >
                              {ci.label}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </td>

                  <td style={{ padding: '4px 5px' }}>
                    <input type="number" min={0} className="count-input"
                      value={wo.count || ''} placeholder="0"
                      onChange={e => onCountChange(wo.id, Number(e.target.value))}
                      style={{ fontSize: 15, fontWeight: 900, height: 34 }}
                    />
                  </td>

                  <td style={{ padding: '4px 6px' }}>
                    <div style={{ textAlign: 'center', marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: progress === 100 ? '#15803d' : progress > 0 ? '#c2410c' : '#94a3b8' }}>
                        {isActive ? `${progress}%` : '—'}
                      </span>
                    </div>
                    {isActive && (
                      <div style={{ height: 5, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progress}%`, borderRadius: 3, transition: 'width 0.3s',
                          background: progress === 100 ? '#22c55e' : progress >= 75 ? '#f97316' : progress >= 50 ? '#eab308' : '#60a5fa' }} />
                      </div>
                    )}
                  </td>

                  {STAGE_COLUMNS.map(c => {
                    const stage = wo[c.key as StageField];
                    const info = STAGE_MAP[stage];
                    return (
                      <td key={c.key} style={{ padding: '4px 5px' }}>
                        <div className="stage-cell" role="button" tabIndex={0}
                          style={{
                            background: info.bg, color: info.text, border: `1px solid ${info.border}`,
                            cursor: isActive ? 'pointer' : 'default', height: 34, fontSize: 13, fontWeight: 800,
                          }}
                          onClick={() => { if (isActive) onStageChange(wo.id, c.key as StageField, cycleStage(stage)); }}
                          onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && isActive) { e.preventDefault(); onStageChange(wo.id, c.key as StageField, cycleStage(stage)); } }}
                          title={isActive ? '클릭하여 단계 변경' : '건수를 먼저 입력하세요'}
                        >
                          {info.label}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {/* 합계 행 */}
            <tr style={{ background: '#1e3a5f', borderTop: '2px solid #cbd5e1' }}>
              <td style={{ padding: '8px', textAlign: 'center', fontWeight: 800, fontSize: 14, color: '#93c5fd' }}>계</td>
              <td style={{ padding: '8px 6px', textAlign: 'center' }}>
                <span style={{ fontWeight: 900, fontSize: 24, color: '#fff' }}>{totalCount.toLocaleString()}</span>
              </td>
              <td colSpan={6} style={{ padding: '8px 12px' }}>
                {activeOrders.length > 0 && (
                  <span style={{ color: '#93c5fd', fontSize: 12 }}>
                    활성 {activeOrders.length}개 바코드 · 평균 진행률{' '}
                    {Math.round(activeOrders.reduce((s, wo) => s + calcProgress(wo), 0) / activeOrders.length)}%
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 하단 범례 */}
      <div style={{ padding: '8px 16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 12, flexWrap: 'wrap', background: '#f8fafc', borderRadius: '0 0 12px 12px', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>단계 범례:</span>
        {STAGE_ORDER.filter(s => s !== '').map(s => {
          const info = STAGE_MAP[s];
          return (
            <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: info.text, fontWeight: 700 }}>
              <span style={{ display: 'inline-block', width: 11, height: 11, borderRadius: 2, background: info.bg, border: `1px solid ${info.border}` }} />
              {info.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
