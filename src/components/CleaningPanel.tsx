import React, { useMemo } from 'react';
import type { CleaningTask, DailySnapshot } from '../types';
import { COLORS, CLEANING_TASK_COLORS } from '../constants';
import { KPICard } from './KPICard';
import { ChartCard } from './ChartCard';
import { calcMetrics, n } from '../utils';
import {
  createProductionChartConfig,
  createHoursDoughnutConfig,
  createEfficiencyChartConfig,
  createTrendChartConfig,
} from '../utils/chartConfigs';

interface Props {
  tasks: CleaningTask[];
  onUpdate: (id: string, field: 'staff' | 'count' | 'hours' | 'stainCheck', value: number) => void;
  totals: { staff: number; count: number; hours: number; eff: number };
  snapshots: DailySnapshot[];
}

const SectionHeader: React.FC<{ icon: string; label: string; color?: string }> = ({ icon, label, color = COLORS.cleaning }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    margin: '14px 0 8px', padding: '6px 0 6px 12px',
    borderLeft: `4px solid ${color}`,
  }}>
    <span style={{ fontSize: 14 }}>{icon}</span>
    <span style={{ fontSize: 13, fontWeight: 800, color: '#d4e8ff', letterSpacing: '0.03em' }}>{label}</span>
  </div>
);

const NumberInput: React.FC<{
  value: number;
  onChange: (v: number) => void;
  color?: string;
  step?: number;
}> = ({ value, onChange, color = '#f0f6ff', step = 1 }) => (
  <input
    type="number"
    min="0"
    step={step}
    value={value === 0 ? '' : value}
    placeholder="0"
    onChange={e => onChange(parseFloat(e.target.value) || 0)}
    style={{
      width: '100%', textAlign: 'center',
      background: '#0f1e32',
      border: '1px solid #3a5a90',
      borderRadius: 6,
      padding: '6px 4px',
      fontSize: 15,
      fontWeight: 700,
      color,
      outline: 'none',
    }}
  />
);

export const CleaningPanel: React.FC<Props> = ({ tasks, onUpdate, totals, snapshots }) => {
  const activeTasks = tasks.filter(t => n(t.count) > 0 || n(t.hours) > 0);

  const stainCheckCount = n(tasks.find(t => t.id === '분류')?.stainCheck ?? 0);
  const classifyCount   = n(tasks.find(t => t.id === '분류')?.count ?? 0);
  const stainCheckRate  = classifyCount > 0 ? +((stainCheckCount / classifyCount) * 100).toFixed(1) : 0;

  const productionConfig = useMemo(() => {
    if (activeTasks.length === 0) return null;
    return createProductionChartConfig(
      activeTasks.map(t => t.label),
      activeTasks.map(t => n(t.count)),
      activeTasks.map(t => calcMetrics(n(t.count), n(t.staff), n(t.hours)).perHour),
      activeTasks.map(t => CLEANING_TASK_COLORS[t.id] ?? '#60a5fa'),
      '건',
    );
  }, [activeTasks]);

  const hoursConfig = useMemo(() => {
    const w = tasks.filter(t => n(t.hours) > 0);
    if (w.length === 0) return null;
    return createHoursDoughnutConfig(
      w.map(t => t.label),
      w.map(t => n(t.hours)),
      w.map(t => CLEANING_TASK_COLORS[t.id] ?? '#60a5fa'),
    );
  }, [tasks]);

  const effConfig = useMemo(() => {
    const w = tasks.filter(t => n(t.count) > 0 && n(t.staff) > 0 && n(t.hours) > 0);
    if (w.length === 0) return null;
    return createEfficiencyChartConfig(
      w.map(t => t.label),
      w.map(t => calcMetrics(n(t.count), n(t.staff), n(t.hours)).efficiency),
      w.map(t => CLEANING_TASK_COLORS[t.id] ?? '#60a5fa'),
    );
  }, [tasks]);

  const trendConfig = useMemo(() => {
    if (snapshots.length < 2) return null;
    return createTrendChartConfig(
      snapshots.map(s => s.label),
      snapshots.map(s => s.cleaningEfficiency),
      COLORS.cleaning,
    );
  }, [snapshots]);

  // 컬럼: 업무 | 설명 | 인원 | 생산량 | 단위 | 시간 | 시간당 | 얼룩체크
  const COLS = '70px 1fr 80px 90px 52px 80px 68px 84px';

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* 패널 헤더 */}
      <div style={{
        background: '#1a2f50',
        border: '1px solid #2e4a7a',
        borderLeft: `5px solid ${COLORS.cleaning}`,
        borderRadius: 10,
        padding: '10px 16px',
        marginBottom: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: COLORS.cleaning }}>🧺 개별클리닝파트</div>
        <div style={{ fontSize: 12, color: '#7a9cc0', fontWeight: 600 }}>바코드 1개 = 의류 1개</div>
      </div>

      {/* KPI */}
      <SectionHeader icon="📊" label="파트 합계" />
      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <KPICard label="총 인원" value={totals.staff} unit="명" icon="👤" color="#b8cfe8" />
        <KPICard label="총 처리량" value={totals.count.toLocaleString()} unit="건" color="#60a5fa" icon="📦" />
        <KPICard label="총 투입시간" value={totals.hours} unit="h" color="#b8cfe8" icon="⏱" />
        <KPICard
          label="인시당 생산량"
          value={totals.eff}
          unit="건"
          color={COLORS.rate}
          status={totals.eff > 0 ? 'good' : 'neutral'}
          icon="⚡"
          sub="건 / 인 / h"
        />
        {stainCheckCount > 0 && (
          <KPICard
            label="얼룩체크"
            value={stainCheckCount.toLocaleString()}
            unit="건"
            color="#c4b5fd"
            icon="🔍"
            sub={`분류 대비 ${stainCheckRate}%`}
          />
        )}
      </div>

      {/* 업무 입력 테이블 */}
      <SectionHeader icon="✏️" label="업무별 입력" />
      <div style={{
        background: '#1a2f50',
        border: '1px solid #2e4a7a',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 10,
      }}>
        {/* 헤더 */}
        <div style={{
          display: 'grid', gridTemplateColumns: COLS,
          background: '#0f1e32',
          padding: '8px 14px',
          borderBottom: '2px solid #2e4a7a',
          fontSize: 12, fontWeight: 800, color: '#8ab4d8',
          gap: 6,
        }}>
          <span>업무</span>
          <span>설명</span>
          <span style={{ textAlign: 'center' }}>인원</span>
          <span style={{ textAlign: 'center' }}>생산량</span>
          <span style={{ textAlign: 'center' }}>단위</span>
          <span style={{ textAlign: 'center' }}>시간(h)</span>
          <span style={{ textAlign: 'center' }}>시간당</span>
          <span style={{ textAlign: 'center', color: '#c4b5fd' }}>얼룩체크</span>
        </div>

        {tasks.map((task, i) => {
          const m     = calcMetrics(n(task.count), n(task.staff), n(task.hours));
          const color = CLEANING_TASK_COLORS[task.id] ?? '#60a5fa';
          return (
            <div key={task.id} style={{
              display: 'grid', gridTemplateColumns: COLS,
              padding: '8px 14px',
              background: i % 2 === 0 ? 'transparent' : '#162844',
              borderBottom: '1px solid #1e3a5f',
              alignItems: 'center', gap: 6,
            }}>
              <span style={{
                fontSize: 14, fontWeight: 900, color,
              }}>{task.label}</span>
              <span style={{ fontSize: 12, color: '#8ab4d8', fontWeight: 600 }}>{task.description}</span>
              <NumberInput value={n(task.staff)} onChange={v => onUpdate(task.id, 'staff', v)} color={color} />
              <NumberInput value={n(task.count)} onChange={v => onUpdate(task.id, 'count', v)} color={color} />
              <span style={{ fontSize: 13, color: '#8ab4d8', textAlign: 'center', fontWeight: 700 }}>{task.unit}</span>
              <NumberInput value={n(task.hours)} onChange={v => onUpdate(task.id, 'hours', v)} color="#b8cfe8" step={0.5} />
              <span style={{ fontSize: 14, fontWeight: 800, color: COLORS.rate, textAlign: 'center' }}>
                {m.perHour > 0 ? m.perHour : '—'}
              </span>
              {task.id === '분류' ? (
                <NumberInput
                  value={n(task.stainCheck ?? 0)}
                  onChange={v => onUpdate(task.id, 'stainCheck', v)}
                  color="#c4b5fd"
                />
              ) : (
                <span style={{ textAlign: 'center', color: '#2e4a7a', fontSize: 14, fontWeight: 700 }}>—</span>
              )}
            </div>
          );
        })}
      </div>

      {/* 차트 */}
      {(productionConfig || hoursConfig || effConfig || trendConfig) && (
        <SectionHeader icon="📈" label="분석 차트" />
      )}
      <ChartCard
        title="업무별 생산량 및 시간당 효율"
        config={productionConfig}
        height="210px"
        tag="생산량"
        badge={
          <div style={{ fontSize: 11, color: '#7a9cc0', display: 'flex', gap: 10 }}>
            <span><span style={{ display: 'inline-block', width: 9, height: 9, background: '#60a5fa80', borderRadius: 2, marginRight: 3 }} />생산량</span>
            <span><span style={{ display: 'inline-block', width: 12, height: 2, background: '#fbbf24', marginRight: 3, verticalAlign: 'middle' }} />시간당</span>
          </div>
        }
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <ChartCard title="업무별 투입시간 비율" config={hoursConfig} height="170px" tag="시간분포" />
        </div>
        <div style={{ flex: 1 }}>
          <ChartCard title="업무별 인시당 생산량" config={effConfig} height="170px" tag="효율" />
        </div>
      </div>
      <ChartCard
        title="날짜별 인시당 생산성 추이"
        config={trendConfig}
        height="160px"
        tag={snapshots.length >= 3 ? 'SPC' : '추이'}
      />
    </div>
  );
};
