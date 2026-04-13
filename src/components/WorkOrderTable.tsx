import React from 'react';
import { WorkOrder, ProcessStage } from '../types';
import { ORDER_COLOR_MAP, STAGE_MAP, STAGE_ORDER, STAGE_COLUMNS, StageField } from '../constants';

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
}

export function WorkOrderTable({ workOrders, totalCount, onCountChange, onStageChange }: Props) {
  const activeOrders = workOrders.filter(wo => wo.count > 0);
  const doneCount    = activeOrders.filter(wo => calcProgress(wo) === 100).length;
  const inProgCount  = activeOrders.filter(wo => { const p = calcProgress(wo); return p > 0 && p < 100; }).length;
  const notStarted   = activeOrders.filter(wo => calcProgress(wo) === 0).length;

  const thStyle: React.CSSProperties = {
    padding: '10px 6px', fontSize: 11, fontWeight: 700, color: '#64748b',
    textAlign: 'center', background: '#f8fafc', borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap',
  };

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="section-header">
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
        <h2>작업 현황</h2>
        <div style={{ display: 'flex', gap: 6, marginLeft: 12 }}>
          {notStarted > 0 && <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>미진행 {notStarted}건</span>}
          {inProgCount > 0 && <span style={{ background: '#fef9c3', color: '#854d0e', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>진행중 {inProgCount}건</span>}
          {doneCount > 0 && <span style={{ background: '#dcfce7', color: '#15803d', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>완료 {doneCount}건</span>}
        </div>
        <span style={{ marginLeft: 'auto', background: '#1e3a5f', color: '#93c5fd', borderRadius: 20, padding: '2px 12px', fontSize: 12, fontWeight: 700 }}>
          총 {totalCount.toLocaleString()}건
        </span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '9%' }} /><col style={{ width: '8%' }} /><col style={{ width: '8%' }} />
            <col style={{ width: '15%' }} /><col style={{ width: '15%' }} /><col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} /><col style={{ width: '15%' }} />
          </colgroup>
          <thead>
            <tr>
              <th style={thStyle}>작업순서</th><th style={thStyle}>건수</th><th style={thStyle}>진행률</th>
              <th style={thStyle}>대분류</th><th style={thStyle}>드라이클리닝</th>
              <th style={thStyle}>웨트</th><th style={thStyle}>셔츠</th><th style={thStyle}>집중케어세탁</th>
            </tr>
          </thead>
          <tbody>
            {workOrders.map((wo, idx) => {
              const col = ORDER_COLOR_MAP[wo.color];
              const progress = calcProgress(wo);
              const isActive = wo.count > 0;
              return (
                <tr key={wo.id} style={{ background: idx % 2 === 0 ? '#fff' : '#fafbfc', opacity: isActive ? 1 : 0.5 }}>
                  <td style={{ padding: '6px 8px' }}>
                    <div style={{ background: col.bg, color: col.text, borderRadius: 8, padding: '6px 0', textAlign: 'center', fontWeight: 800, fontSize: 13 }}>{col.label}</div>
                  </td>
                  <td style={{ padding: '6px 6px' }}>
                    <input type="number" min={0} className="count-input" value={wo.count || ''} placeholder="0"
                      onChange={e => onCountChange(wo.id, Number(e.target.value))} />
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    <div style={{ textAlign: 'center', marginBottom: 3 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: progress === 100 ? '#15803d' : progress > 0 ? '#c2410c' : '#94a3b8' }}>
                        {isActive ? `${progress}%` : '—'}
                      </span>
                    </div>
                    {isActive && (
                      <div style={{ height: 4, background: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progress}%`, borderRadius: 2, transition: 'width 0.3s',
                          background: progress === 100 ? '#22c55e' : progress >= 75 ? '#f97316' : progress >= 50 ? '#eab308' : '#60a5fa' }} />
                      </div>
                    )}
                  </td>
                  {STAGE_COLUMNS.map(c => {
                    const stage = wo[c.key as StageField];
                    const info = STAGE_MAP[stage];
                    return (
                      <td key={c.key} style={{ padding: '6px 6px' }}>
                        <div className="stage-cell" role="button" tabIndex={0}
                          style={{ background: info.bg, color: info.text, border: `1px solid ${info.border}`, cursor: isActive ? 'pointer' : 'default' }}
                          onClick={() => { if (isActive) onStageChange(wo.id, c.key as StageField, cycleStage(stage)); }}
                          onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && isActive) { e.preventDefault(); onStageChange(wo.id, c.key as StageField, cycleStage(stage)); } }}
                          title={isActive ? '클릭하여 단계 변경' : '건수를 먼저 입력하세요'}>
                          {info.label}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            <tr style={{ background: '#1e3a5f', borderTop: '2px solid #e2e8f0' }}>
              <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 800, fontSize: 13, color: '#93c5fd' }}>계</td>
              <td style={{ padding: '10px 6px', textAlign: 'center', fontWeight: 800, fontSize: 15, color: '#fff' }}>{totalCount.toLocaleString()}</td>
              <td colSpan={6} style={{ padding: '10px 12px' }}>
                {activeOrders.length > 0 && (
                  <span style={{ color: '#93c5fd', fontSize: 11 }}>
                    활성 {activeOrders.length}개 바코드 · 평균 진행률 {Math.round(activeOrders.reduce((s, wo) => s + calcProgress(wo), 0) / activeOrders.length)}%
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ padding: '10px 18px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 12, flexWrap: 'wrap', background: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
        <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>단계 범례:</span>
        {STAGE_ORDER.filter(s => s !== '').map(s => {
          const info = STAGE_MAP[s];
          return (
            <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, color: info.text, fontWeight: 600 }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: info.bg, border: `1px solid ${info.border}` }} />
              {info.label} <span style={{ color: '#94a3b8', fontSize: 9 }}>({STAGE_MAP[s].weight}%)</span>
            </span>
          );
        })}
        <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 4 }}>· 셀 클릭으로 단계 전환</span>
      </div>
    </div>
  );
}
