import React, { useMemo } from 'react';
import type { CleaningTask, DailySnapshot } from '../types';
import { COLORS, CLEANING_TASK_COLORS } from '../constants';
import { KPICard } from './KPICard';
import { ChartCard } from './ChartCard';
import { n } from '../utils';
import {
  createProductionChartConfig,
  createEfficiencyChartConfig,
  createTrendChartConfig,
} from '../utils/chartConfigs';

interface Props {
  tasks: CleaningTask[];
  onUpdate: (id: string, field: 'staff' | 'count' | 'qcHours' | 'stainCheck', value: number) => void;
  sharedHours: number;
  onSharedHoursChange: (v: number) => void;
  targetOut: number;
  onTargetOutChange: (v: number) => void;
  totals: {
    staff: number; count: number; hours: number; eff: number;
    classifyCount: number; machineCount: number; achieveRate: number;
  };
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
  value: number; onChange: (v: number) => void;
  color?: string; step?: number; disabled?: boolean;
}> = ({ value, onChange, color = '#f0f6ff', step = 1, disabled = false }) => (
  <input
    type="number" min="0" step={step}
    value={value === 0 ? '' : value}
    placeholder="0"
    disabled={disabled}
    onChange={e => onChange(parseFloat(e.target.value) || 0)}
    style={{
      width: '100%', textAlign: 'center',
      background: disabled ? '#0a1628' : '#0f1e32',
      border: `1px solid ${disabled ? '#1e3a5f' : '#3a5a90'}`,
      borderRadius: 6, padding: '6px 4px',
      fontSize: 15, fontWeight: 700,
      color: disabled ? '#3a5a90' : color,
      outline: 'none', cursor: disabled ? 'default' : 'text',
    }}
  />
);

// 목표 달성률 바
const GoalBar: React.FC<{ rate: number; goal?: number }> = ({ rate, goal = 60 }) => {
  const clamped = Math.min(rate, 150);
  const color   = rate >= goal ? COLORS.success : rate >= goal * 0.7 ? COLORS.warn : COLORS.alert;
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: '#8ab4d8', fontWeight: 700 }}>목표 달성률</span>
        <span style={{ fontSize: 13, fontWeight: 900, color }}>{rate}%</span>
      </div>
      <div style={{ height: 8, background: '#0f1e32', borderRadius: 4, overflow: 'hidden', border: '1px solid #2e4a7a' }}>
        <div style={{
          height: '100%', width: `${(clamped / 150) * 100}%`,
          background: color, borderRadius: 4,
          transition: 'width 0.4s ease',
          boxShadow: rate >= goal ? `0 0 8px ${color}80` : 'none',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
        <span style={{ fontSize: 10, color: '#7a9cc0' }}>목표 {goal}%</span>
      </div>
    </div>
  );
};

export const CleaningPanel: React.FC<Props> = ({
  tasks, onUpdate, sharedHours, onSharedHoursChange,
  targetOut, onTargetOutChange, totals, snapshots,
}) => {
  const classifyTask = tasks.find(t => t.id === '분류');
  const qcTask       = tasks.find(t => t.id === 'QC');

  const classifyStainCount = n(classifyTask?.stainCheck ?? 0);
  const classifyCount      = n(classifyTask?.count ?? 0);
  const classifyStainRate  = classifyCount > 0 ? +((classifyStainCount / classifyCount) * 100).toFixed(1) : 0;

  const qcStainCount = n(qcTask?.stainCheck ?? 0);
  const qcCount      = n(qcTask?.count ?? 0);
  const qcStainRate  = qcCount > 0 ? +((qcStainCount / qcCount) * 100).toFixed(1) : 0;

  // 차트용 active tasks (생산량 있는 것만)
  const chartTasks = tasks.filter(t => n(t.count) > 0);

  const productionConfig = useMemo(() => {
    if (chartTasks.length === 0) return null;
    return createProductionChartConfig(
      chartTasks.map(t => t.label),
      chartTasks.map(t => n(t.count)),
      chartTasks.map(t => {
        const hrs = t.id === 'QC' ? n(t.qcHours ?? 0) : sharedHours;
        return hrs > 0 ? +(n(t.count) / hrs).toFixed(1) : 0;
      }),
      chartTasks.map(t => CLEANING_TASK_COLORS[t.id] ?? '#60a5fa'),
      '건',
    );
  }, [chartTasks, sharedHours]);

  const effConfig = useMemo(() => {
    const w = tasks.filter(t => n(t.count) > 0 && n(t.staff) > 0);
    if (w.length === 0) return null;
    return createEfficiencyChartConfig(
      w.map(t => t.label),
      w.map(t => {
        const hrs = t.id === 'QC' ? n(t.qcHours ?? 0) : sharedHours;
        return n(t.staff) > 0 && hrs > 0 ? +(n(t.count) / n(t.staff) / hrs).toFixed(1) : 0;
      }),
      w.map(t => CLEANING_TASK_COLORS[t.id] ?? '#60a5fa'),
    );
  }, [tasks, sharedHours]);

  const trendConfig = useMemo(() => {
    if (snapshots.length < 2) return null;
    return createTrendChartConfig(
      snapshots.map(s => s.label),
      snapshots.map(s => s.cleaningEfficiency),
      COLORS.cleaning,
    );
  }, [snapshots]);

  // 컬럼: 업무 | 설명 | 인원 | 생산량 | 단위 | 시간(h) | 얼룩체크
  const COLS = '76px 1fr 76px 86px 48px 76px 84px';

  return (
    <div style={{ flex: 1, minWidth: 0 }}>

      {/* ── 패널 헤더 ── */}
      <div style={{
        background: '#1a2f50', border: '1px solid #2e4a7a',
        borderLeft: `5px solid ${COLORS.cleaning}`,
        borderRadius: 10, padding: '10px 16px', marginBottom: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: COLORS.cleaning }}>🧺 개별클리닝파트</div>
        <div style={{ fontSize: 11, color: '#7a9cc0', fontWeight: 600 }}>
          목표: 처리율 60% 이상
        </div>
      </div>

      {/* ── 목표 입력 ── */}
      <div style={{
        background: '#12213a', border: `1px solid ${COLORS.goal}50`,
        borderLeft: `4px solid ${COLORS.goal}`,
        borderRadius: 10, padding: '12px 16px', marginBottom: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: COLORS.goal, minWidth: 160 }}>
            🎯 당일 예상 총출고 개별수
          </span>
          <div style={{ width: 110 }}>
            <input
              type="number" min="0"
              value={targetOut === 0 ? '' : targetOut}
              placeholder="0"
              onChange={e => onTargetOutChange(parseFloat(e.target.value) || 0)}
              style={{
                width: '100%', textAlign: 'center',
                background: '#0f1e32', border: `1px solid ${COLORS.goal}80`,
                borderRadius: 6, padding: '6px 4px', fontSize: 15, fontWeight: 700,
                color: COLORS.goal, outline: 'none',
              }}
            />
          </div>
          <span style={{ fontSize: 13, color: '#7a9cc0' }}>개</span>
          {targetOut > 0 && (
            <div style={{ marginLeft: 'auto', textAlign: 'right', minWidth: 200 }}>
              <div style={{ fontSize: 12, color: '#8ab4d8' }}>
                처리 {totals.count.toLocaleString()} / 목표 {targetOut.toLocaleString()}개
              </div>
              <GoalBar rate={totals.achieveRate} />
            </div>
          )}
        </div>
      </div>

      {/* ── 공통 근무시간 ── */}
      <div style={{
        background: '#1a2f50', border: '1px solid #2e4a7a',
        borderRadius: 10, padding: '11px 16px', marginBottom: 10,
        display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#b8cfe8', minWidth: 140 }}>
          ⏱ 공통 근무시간 (QC 제외)
        </span>
        <div style={{ width: 100 }}>
          <input
            type="number" min="0" step={0.5}
            value={sharedHours === 0 ? '' : sharedHours}
            placeholder="0"
            onChange={e => onSharedHoursChange(parseFloat(e.target.value) || 0)}
            style={{
              width: '100%', textAlign: 'center',
              background: '#0f1e32', border: '1px solid #3a5a90',
              borderRadius: 6, padding: '6px 4px',
              fontSize: 15, fontWeight: 700, color: '#b8cfe8', outline: 'none',
            }}
          />
        </div>
        <span style={{ fontSize: 13, color: '#7a9cc0' }}>h — 분류·기계·웨트·건조&amp;셔츠 공동 적용</span>
        {sharedHours > 0 && totals.staff > 0 && (
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#60a5fa', fontWeight: 700 }}>
            총투입 {totals.hours}h
          </span>
        )}
      </div>

      {/* ── KPI ── */}
      <SectionHeader icon="📊" label="파트 합계" />
      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <KPICard label="총 인원"    value={totals.staff} unit="명" icon="👤" color="#b8cfe8" />
        <KPICard label="총 처리량"  value={totals.count.toLocaleString()} unit="건" color="#60a5fa" icon="📦" sub="분류 기준" />
        <KPICard label="총 투입시간" value={totals.hours} unit="h" color="#b8cfe8" icon="⏱" sub="인원×시간" />
        <KPICard
          label="인시당 생산량" value={totals.eff} unit="건" color={COLORS.rate}
          status={totals.eff > 0 ? 'good' : 'neutral'} icon="⚡" sub="(분류+기계)/인원"
        />
      </div>

      {/* ── 얼룩체크 강조 카드 ── */}
      {(classifyStainCount > 0 || qcStainCount > 0) && (
        <div style={{
          display: 'flex', gap: 8, marginBottom: 10,
        }}>
          {classifyStainCount > 0 && (
            <div style={{
              flex: 1, background: '#1e1040', border: '1px solid #7c3aed80',
              borderLeft: '4px solid #a78bfa', borderRadius: 10, padding: '10px 14px',
            }}>
              <div style={{ fontSize: 11, color: '#a78bfa', fontWeight: 800, marginBottom: 4 }}>
                🔍 분류 얼룩체크
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#c4b5fd' }}>
                  {classifyStainCount.toLocaleString()}
                </span>
                <span style={{ fontSize: 12, color: '#a78bfa' }}>건</span>
                <span style={{
                  fontSize: 14, fontWeight: 800,
                  color: classifyStainRate >= 10 ? COLORS.alert : classifyStainRate >= 5 ? COLORS.warn : COLORS.success,
                  marginLeft: 4,
                }}>
                  {classifyStainRate}%
                </span>
                <span style={{ fontSize: 11, color: '#7a9cc0' }}>/ 분류</span>
              </div>
            </div>
          )}
          {qcStainCount > 0 && (
            <div style={{
              flex: 1, background: '#1e1020', border: '1px solid #e879f980',
              borderLeft: '4px solid #e879f9', borderRadius: 10, padding: '10px 14px',
            }}>
              <div style={{ fontSize: 11, color: '#e879f9', fontWeight: 800, marginBottom: 4 }}>
                🔍 QC 얼룩체크
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#f0abfc' }}>
                  {qcStainCount.toLocaleString()}
                </span>
                <span style={{ fontSize: 12, color: '#e879f9' }}>건</span>
                <span style={{
                  fontSize: 14, fontWeight: 800,
                  color: qcStainRate >= 10 ? COLORS.alert : qcStainRate >= 5 ? COLORS.warn : COLORS.success,
                  marginLeft: 4,
                }}>
                  {qcStainRate}%
                </span>
                <span style={{ fontSize: 11, color: '#7a9cc0' }}>/ QC</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 업무 입력 테이블 ── */}
      <SectionHeader icon="✏️" label="업무별 입력" />
      <div style={{
        background: '#1a2f50', border: '1px solid #2e4a7a',
        borderRadius: 10, overflow: 'hidden', marginBottom: 10,
      }}>
        {/* 헤더 */}
        <div style={{
          display: 'grid', gridTemplateColumns: COLS,
          background: '#0f1e32', padding: '8px 14px',
          borderBottom: '2px solid #2e4a7a',
          fontSize: 12, fontWeight: 800, color: '#8ab4d8', gap: 6,
        }}>
          <span>업무</span>
          <span>설명</span>
          <span style={{ textAlign: 'center' }}>인원</span>
          <span style={{ textAlign: 'center' }}>생산량</span>
          <span style={{ textAlign: 'center' }}>단위</span>
          <span style={{ textAlign: 'center' }}>시간(h)</span>
          <span style={{ textAlign: 'center', color: '#c4b5fd' }}>얼룩체크</span>
        </div>

        {tasks.map((task, i) => {
          const color      = CLEANING_TASK_COLORS[task.id] ?? '#60a5fa';
          const isQC       = task.id === 'QC';
          const isClassify = task.id === '분류';
          const hasCount   = isQC || isClassify;    // 생산량 입력 있는 업무
          const hasStain   = isQC || isClassify;    // 얼룩체크 입력 있는 업무

          return (
            <div key={task.id} style={{
              display: 'grid', gridTemplateColumns: COLS,
              padding: '8px 14px',
              background: i % 2 === 0 ? 'transparent' : '#162844',
              borderBottom: '1px solid #1e3a5f',
              alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontSize: 14, fontWeight: 900, color }}>{task.label}</span>
              <span style={{ fontSize: 11, color: '#8ab4d8', fontWeight: 600 }}>{task.description}</span>

              {/* 인원 (모든 업무 필수) */}
              <NumberInput
                value={n(task.staff)}
                onChange={v => onUpdate(task.id, 'staff', v)}
                color={color}
              />

              {/* 생산량 (분류·QC만) */}
              {hasCount ? (
                <NumberInput
                  value={n(task.count)}
                  onChange={v => onUpdate(task.id, 'count', v)}
                  color={color}
                />
              ) : (
                <span style={{ textAlign: 'center', color: '#2e4a7a', fontSize: 14, fontWeight: 700 }}>—</span>
              )}

              <span style={{ fontSize: 13, color: '#8ab4d8', textAlign: 'center', fontWeight: 700 }}>{task.unit}</span>

              {/* 시간: QC는 직접 입력, 나머지는 공통값 표시 */}
              {isQC ? (
                <NumberInput
                  value={n(task.qcHours ?? 0)}
                  onChange={v => onUpdate(task.id, 'qcHours', v)}
                  color="#b8cfe8"
                  step={0.5}
                />
              ) : (
                <span style={{
                  textAlign: 'center', fontSize: 13, fontWeight: 700,
                  color: sharedHours > 0 ? '#b8cfe8' : '#2e4a7a',
                }}>
                  {sharedHours > 0 ? sharedHours : '—'}
                </span>
              )}

              {/* 얼룩체크 (분류·QC만) */}
              {hasStain ? (
                <NumberInput
                  value={n(task.stainCheck ?? 0)}
                  onChange={v => onUpdate(task.id, 'stainCheck', v)}
                  color={isQC ? '#e879f9' : '#c4b5fd'}
                />
              ) : (
                <span style={{ textAlign: 'center', color: '#2e4a7a', fontSize: 14, fontWeight: 700 }}>—</span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── 차트 ── */}
      {(productionConfig || effConfig || trendConfig) && (
        <SectionHeader icon="📈" label="분석 차트" />
      )}
      <ChartCard
        title="업무별 생산량 및 시간당 효율"
        config={productionConfig}
        height="200px"
        tag="생산량"
        badge={
          <div style={{ fontSize: 11, color: '#7a9cc0', display: 'flex', gap: 10 }}>
            <span><span style={{ display: 'inline-block', width: 9, height: 9, background: '#60a5fa80', borderRadius: 2, marginRight: 3 }} />생산량</span>
            <span><span style={{ display: 'inline-block', width: 12, height: 2, background: '#fbbf24', marginRight: 3, verticalAlign: 'middle' }} />시간당</span>
          </div>
        }
      />
      <ChartCard title="업무별 인시당 생산량" config={effConfig} height="160px" tag="효율" />
      <ChartCard
        title="날짜별 인시당 생산성 추이"
        config={trendConfig}
        height="155px"
        tag={snapshots.length >= 3 ? 'SPC' : '추이'}
      />
    </div>
  );
};
