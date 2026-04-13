import React, { useMemo } from 'react';
import type { LaundryTask, DailySnapshot } from '../types';
import { COLORS, LAUNDRY_TASK_COLORS } from '../constants';
import { KPICard } from './KPICard';
import { ChartCard } from './ChartCard';
import { n } from '../utils';
import {
  createProductionChartConfig,
  createTrendChartConfig,
} from '../utils/chartConfigs';

interface Props {
  staff: number;
  onStaffChange: (v: number) => void;
  tasks: LaundryTask[];
  onUpdate: (id: string, field: 'count' | 'hours', value: number) => void;
  supportSent: string;
  onSupportSentChange: (v: string) => void;
  supportReceived: string;
  onSupportReceivedChange: (v: string) => void;
  targetCustomers: number;
  onTargetCustomersChange: (v: number) => void;
  totals: { staff: number; boxes: number; rolls: number; hours: number; eff: number; achieveRate: number };
  snapshots: DailySnapshot[];
}

const SectionHeader: React.FC<{ icon: string; label: string; color?: string }> = ({ icon, label, color = COLORS.laundry }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    margin: '14px 0 8px', padding: '6px 0 6px 12px',
    borderLeft: `4px solid ${color}`,
  }}>
    <span style={{ fontSize: 14 }}>{icon}</span>
    <span style={{ fontSize: 13, fontWeight: 800, color: '#d4e8ff', letterSpacing: '0.03em' }}>{label}</span>
  </div>
);

const NumberInput: React.FC<{ value: number; onChange: (v: number) => void; color?: string; step?: number }> = (
  { value, onChange, color = '#f0f6ff', step = 1 }
) => (
  <input
    type="number" min="0" step={step}
    value={value === 0 ? '' : value}
    placeholder="0"
    onChange={e => onChange(parseFloat(e.target.value) || 0)}
    style={{
      width: '100%', textAlign: 'center',
      background: '#0f1e32', border: '1px solid #3a5a90',
      borderRadius: 6, padding: '6px 4px',
      fontSize: 15, fontWeight: 700, color, outline: 'none',
    }}
  />
);

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
          background: color, borderRadius: 4, transition: 'width 0.4s ease',
          boxShadow: rate >= goal ? `0 0 8px ${color}80` : 'none',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
        <span style={{ fontSize: 10, color: '#7a9cc0' }}>목표 {goal}%</span>
      </div>
    </div>
  );
};

export const LaundryPanel: React.FC<Props> = ({
  staff, onStaffChange, tasks, onUpdate,
  supportSent, onSupportSentChange,
  supportReceived, onSupportReceivedChange,
  targetCustomers, onTargetCustomersChange,
  totals, snapshots,
}) => {
  const activeTasks = tasks.filter(t => n(t.count) > 0 || n(t.hours) > 0);

  const productionConfig = useMemo(() => {
    if (activeTasks.length === 0) return null;
    return createProductionChartConfig(
      activeTasks.map(t => t.label),
      activeTasks.map(t => n(t.count)),
      activeTasks.map(t => {
        const h = n(t.hours);
        return h > 0 ? +(n(t.count) / h).toFixed(1) : 0;
      }),
      activeTasks.map(t => LAUNDRY_TASK_COLORS[t.id] ?? '#34d399'),
      '건',
    );
  }, [activeTasks]);

  const trendConfig = useMemo(() => {
    if (snapshots.length < 2) return null;
    const efficiencies = snapshots.map(s => {
      return s.laundryStaff > 0 && s.laundryHours > 0
        ? +(s.laundryBoxes / s.laundryStaff / s.laundryHours).toFixed(1)
        : 0;
    });
    return createTrendChartConfig(snapshots.map(s => s.label), efficiencies, COLORS.laundry);
  }, [snapshots]);

  const COLS = '110px 1fr 90px 72px 80px 68px';

  return (
    <div style={{ flex: 1, minWidth: 0 }}>

      {/* ── 패널 헤더 ── */}
      <div style={{
        background: '#1a2f50', border: '1px solid #2e4a7a',
        borderLeft: `5px solid ${COLORS.laundry}`,
        borderRadius: 10, padding: '10px 16px', marginBottom: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: COLORS.laundry }}>🫧 런드리파트</div>
        <div style={{ fontSize: 11, color: '#7a9cc0', fontWeight: 600 }}>목표: 처리율 60% 이상</div>
      </div>

      {/* ── 목표 입력 ── */}
      <div style={{
        background: '#12213a', border: `1px solid ${COLORS.goal}50`,
        borderLeft: `4px solid ${COLORS.goal}`,
        borderRadius: 10, padding: '12px 16px', marginBottom: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: COLORS.goal, minWidth: 170 }}>
            🎯 당일 예상 한밤생빨 고객수
          </span>
          <div style={{ width: 100 }}>
            <input
              type="number" min="0"
              value={targetCustomers === 0 ? '' : targetCustomers}
              placeholder="0"
              onChange={e => onTargetCustomersChange(parseFloat(e.target.value) || 0)}
              style={{
                width: '100%', textAlign: 'center',
                background: '#0f1e32', border: `1px solid ${COLORS.goal}80`,
                borderRadius: 6, padding: '6px 4px',
                fontSize: 15, fontWeight: 700, color: COLORS.goal, outline: 'none',
              }}
            />
          </div>
          <span style={{ fontSize: 13, color: '#7a9cc0' }}>명</span>
          {targetCustomers > 0 && (
            <div style={{ marginLeft: 'auto', textAlign: 'right', minWidth: 200 }}>
              <div style={{ fontSize: 12, color: '#8ab4d8' }}>
                처리 {totals.boxes}박스 / 목표 {targetCustomers}명
              </div>
              <GoalBar rate={totals.achieveRate} />
            </div>
          )}
        </div>
      </div>

      {/* ── 파트 인원 + 지원 관리 ── */}
      <SectionHeader icon="👥" label="인원 관리" />
      <div style={{
        background: '#1a2f50', border: '1px solid #2e4a7a',
        borderRadius: 10, padding: '12px 16px', marginBottom: 10,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {/* 전체 인원 +/- */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#8ab4d8', minWidth: 90 }}>파트 전체 인원</span>
          <button
            onClick={() => onStaffChange(staff - 1)}
            style={{
              width: 32, height: 32, borderRadius: 6, border: '1px solid #3a5a90',
              background: '#0f1e32', color: COLORS.alert, fontSize: 18, fontWeight: 900,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >−</button>
          <div style={{ width: 80 }}>
            <NumberInput value={staff} onChange={onStaffChange} color={COLORS.laundry} />
          </div>
          <button
            onClick={() => onStaffChange(staff + 1)}
            style={{
              width: 32, height: 32, borderRadius: 6, border: '1px solid #3a5a90',
              background: '#0f1e32', color: COLORS.success, fontSize: 18, fontWeight: 900,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >+</button>
          <span style={{ fontSize: 13, color: '#7a9cc0', fontWeight: 600 }}>명</span>
        </div>

        {/* 지원 보낸 곳 / 받은 곳 */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 140 }}>
            <div style={{ fontSize: 11, color: COLORS.warn, fontWeight: 700, marginBottom: 4 }}>↗ 지원 보낸 곳</div>
            <input
              type="text"
              value={supportSent}
              placeholder="예: 개별클리닝 2명"
              onChange={e => onSupportSentChange(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: '#0f1e32', border: `1px solid ${COLORS.warn}60`,
                borderRadius: 6, padding: '6px 10px',
                fontSize: 13, fontWeight: 600, color: COLORS.warn, outline: 'none',
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <div style={{ fontSize: 11, color: COLORS.success, fontWeight: 700, marginBottom: 4 }}>↙ 지원 받은 곳</div>
            <input
              type="text"
              value={supportReceived}
              placeholder="예: 픽업 3명"
              onChange={e => onSupportReceivedChange(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: '#0f1e32', border: `1px solid ${COLORS.success}60`,
                borderRadius: 6, padding: '6px 10px',
                fontSize: 13, fontWeight: 600, color: COLORS.success, outline: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── KPI ── */}
      <SectionHeader icon="📊" label="파트 합계" />
      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <KPICard
          label="생활빨래건조" value={totals.boxes} unit="박스" color="#60a5fa" icon="📦"
          status={totals.boxes > 0 ? 'good' : 'neutral'}
        />
        <KPICard
          label="이불건조" value={totals.rolls} unit="롤" color="#fb923c" icon="🛏"
          status={totals.rolls > 0 ? 'good' : 'neutral'}
        />
        <KPICard label="총 투입시간" value={totals.hours} unit="h" color="#b8cfe8" icon="⏱" />
        {totals.eff > 0 && (
          <KPICard
            label="인시당 생산량" value={totals.eff} color={COLORS.rate}
            status="good" icon="⚡" sub="생빨건조 / 인 / h"
          />
        )}
      </div>

      {/* ── 업무 입력 테이블 ── */}
      <SectionHeader icon="✏️" label="업무별 입력" />
      <div style={{
        background: '#1a2f50', border: '1px solid #2e4a7a',
        borderRadius: 10, overflow: 'hidden', marginBottom: 10,
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: COLS,
          background: '#0f1e32', padding: '8px 14px',
          borderBottom: '2px solid #2e4a7a',
          fontSize: 12, fontWeight: 800, color: '#8ab4d8', gap: 6,
        }}>
          <span>업무</span>
          <span>설명</span>
          <span style={{ textAlign: 'center' }}>생산량</span>
          <span style={{ textAlign: 'center' }}>단위</span>
          <span style={{ textAlign: 'center' }}>시간(h)</span>
          <span style={{ textAlign: 'center' }}>시간당</span>
        </div>

        {tasks.map((task, i) => {
          const hours   = n(task.hours);
          const count   = n(task.count);
          const perHour = hours > 0 ? +(count / hours).toFixed(1) : 0;
          const color   = LAUNDRY_TASK_COLORS[task.id] ?? '#34d399';
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
              <NumberInput value={count} onChange={v => onUpdate(task.id, 'count', v)} color={color} />
              <span style={{ fontSize: 13, color: '#8ab4d8', textAlign: 'center', fontWeight: 700 }}>{task.unit}</span>
              <NumberInput value={hours} onChange={v => onUpdate(task.id, 'hours', v)} color="#b8cfe8" step={0.5} />
              <span style={{ fontSize: 14, fontWeight: 800, color: COLORS.rate, textAlign: 'center' }}>
                {perHour > 0 ? perHour : '—'}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── 차트 ── */}
      {(productionConfig || trendConfig) && (
        <SectionHeader icon="📈" label="분석 차트" />
      )}
      <ChartCard title="업무별 생산량 및 시간당 처리" config={productionConfig} height="200px" tag="생산량" />
      <ChartCard
        title="날짜별 인시당 생산성 추이 (생활빨래건조 기준)"
        config={trendConfig}
        height="155px"
        tag={snapshots.length >= 3 ? 'SPC' : '추이'}
      />
    </div>
  );
};
