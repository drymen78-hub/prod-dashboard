import React, { useMemo } from 'react';
import type { LaundryTask, DailySnapshot } from '../types';
import { COLORS, LAUNDRY_TASK_COLORS } from '../constants';
import { KPICard } from './KPICard';
import { ChartCard } from './ChartCard';
import { n } from '../utils';
import {
  createProductionChartConfig,
  createHoursDoughnutConfig,
  createTrendChartConfig,
} from '../utils/chartConfigs';

interface Props {
  staff: number;
  onStaffChange: (v: number) => void;
  tasks: LaundryTask[];
  onUpdate: (id: string, field: 'count' | 'hours', value: number) => void;
  totals: { staff: number; boxes: number; rolls: number; hours: number; eff: number; wash: number };
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

export const LaundryPanel: React.FC<Props> = ({ staff, onStaffChange, tasks, onUpdate, totals, snapshots }) => {
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

  const hoursConfig = useMemo(() => {
    const w = tasks.filter(t => n(t.hours) > 0);
    if (w.length === 0) return null;
    return createHoursDoughnutConfig(
      w.map(t => t.label),
      w.map(t => n(t.hours)),
      w.map(t => LAUNDRY_TASK_COLORS[t.id] ?? '#34d399'),
    );
  }, [tasks]);

  const trendConfig = useMemo(() => {
    if (snapshots.length < 2) return null;
    const efficiencies = snapshots.map(s => {
      const total = s.laundryBoxes + s.laundryRolls;
      return s.laundryStaff > 0 && s.laundryHours > 0
        ? +(total / s.laundryStaff / s.laundryHours).toFixed(1) : 0;
    });
    return createTrendChartConfig(snapshots.map(s => s.label), efficiencies, COLORS.laundry);
  }, [snapshots]);

  const COLS = '100px 1fr 90px 72px 80px 68px';

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* 패널 헤더 */}
      <div style={{
        background: '#1a2f50',
        border: '1px solid #2e4a7a',
        borderLeft: `5px solid ${COLORS.laundry}`,
        borderRadius: 10,
        padding: '10px 16px',
        marginBottom: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: COLORS.laundry }}>🫧 런드리파트</div>
        <div style={{ fontSize: 12, color: '#7a9cc0', fontWeight: 600 }}>생활빨래 · 리빙 · 이불</div>
      </div>

      {/* 파트 인원 입력 */}
      <SectionHeader icon="👥" label="파트 인원" />
      <div style={{
        background: '#1a2f50',
        border: '1px solid #2e4a7a',
        borderRadius: 10,
        padding: '12px 16px',
        marginBottom: 10,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#8ab4d8', minWidth: 90 }}>파트 전체 인원</span>
        <div style={{ width: 110 }}>
          <NumberInput value={staff} onChange={onStaffChange} color={COLORS.laundry} />
        </div>
        <span style={{ fontSize: 13, color: '#7a9cc0', fontWeight: 600 }}>명 — 전 업무 공동 적용</span>
      </div>

      {/* KPI */}
      <SectionHeader icon="📊" label="파트 합계" />
      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        {totals.wash > 0 && (
          <KPICard label="세탁 처리" value={totals.wash.toLocaleString()} unit="건" color="#34d399" icon="🫧" />
        )}
        <KPICard
          label="생활빨래건조"
          value={totals.boxes}
          unit="박스"
          color="#60a5fa"
          icon="📦"
          status={totals.boxes > 0 ? 'good' : 'neutral'}
        />
        <KPICard
          label="이불건조"
          value={totals.rolls}
          unit="롤"
          color="#fb923c"
          icon="🛏"
          status={totals.rolls > 0 ? 'good' : 'neutral'}
        />
        <KPICard label="총 투입시간" value={totals.hours} unit="h" color="#b8cfe8" icon="⏱" />
        {totals.eff > 0 && (
          <KPICard
            label="인시당 생산량"
            value={totals.eff}
            color={COLORS.rate}
            status="good"
            icon="⚡"
            sub="(박스+롤) / 인 / h"
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
        <div style={{
          display: 'grid', gridTemplateColumns: COLS,
          background: '#0f1e32',
          padding: '8px 14px',
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
              <span style={{ fontSize: 12, color: '#8ab4d8', fontWeight: 600 }}>{task.description}</span>
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

      {/* 생산물 설명 */}
      <div style={{
        background: '#0f1e32',
        border: '1px solid #2e4a7a',
        borderRadius: 10,
        padding: '12px 16px',
        marginBottom: 10,
        display: 'flex', gap: 20,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#60a5fa', marginBottom: 5 }}>📦 생활빨래건조 완료</div>
          <div style={{ fontSize: 12, color: '#8ab4d8', lineHeight: 1.7, fontWeight: 600 }}>
            다스로 고객구분 → 2단건조기 건조<br />
            완료 시 플라스틱 바스켓에 고객단위 담음
          </div>
        </div>
        <div style={{ width: 1, background: '#2e4a7a' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#fb923c', marginBottom: 5 }}>🛏 이불건조 완료</div>
          <div style={{ fontSize: 12, color: '#8ab4d8', lineHeight: 1.7, fontWeight: 600 }}>
            리빙류 대형건조기 건조<br />
            완료 시 롤테이너에 담음
          </div>
        </div>
      </div>

      {/* 차트 */}
      {(productionConfig || hoursConfig || trendConfig) && (
        <SectionHeader icon="📈" label="분석 차트" />
      )}
      <ChartCard title="업무별 생산량 및 시간당 처리" config={productionConfig} height="210px" tag="생산량" />
      <ChartCard title="업무별 투입시간 비율" config={hoursConfig} height="170px" tag="시간분포" />
      <ChartCard
        title="날짜별 인시당 생산성 추이"
        config={trendConfig}
        height="160px"
        tag={snapshots.length >= 3 ? 'SPC' : '추이'}
      />
    </div>
  );
};
