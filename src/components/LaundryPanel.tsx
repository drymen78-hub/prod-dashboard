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

const SectionHeader: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    margin: '10px 0 6px', padding: '4px 0 4px 8px',
    borderLeft: `3px solid ${COLORS.laundry}40`,
  }}>
    <span style={{ fontSize: 12 }}>{icon}</span>
    <span style={{ fontSize: 11, fontWeight: 800, color: '#475569', letterSpacing: '0.05em' }}>{label}</span>
  </div>
);

const NumberInput: React.FC<{
  value: number;
  onChange: (v: number) => void;
  color?: string;
  step?: number;
  placeholder?: string;
}> = ({ value, onChange, color = '#f1f5f9', step = 1, placeholder = '0' }) => (
  <input
    type="number"
    min="0"
    step={step}
    value={value === 0 ? '' : value}
    placeholder={placeholder}
    onChange={e => onChange(parseFloat(e.target.value) || 0)}
    style={{
      width: '100%', textAlign: 'center',
      background: '#0f172a', border: '1px solid #334155',
      borderRadius: 5, padding: '4px',
      fontSize: 13, fontWeight: 700, color,
      outline: 'none',
    }}
  />
);

export const LaundryPanel: React.FC<Props> = ({ staff, onStaffChange, tasks, onUpdate, totals, snapshots }) => {
  const activeTasks = tasks.filter(t => n(t.count) > 0 || n(t.hours) > 0);

  const productionConfig = useMemo(() => {
    if (activeTasks.length === 0) return null;
    const perHours = activeTasks.map(t => {
      const hours = n(t.hours);
      const count = n(t.count);
      return hours > 0 ? +(count / hours).toFixed(1) : 0;
    });
    return createProductionChartConfig(
      activeTasks.map(t => t.label),
      activeTasks.map(t => n(t.count)),
      perHours,
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
    // 런드리 트렌드: 박스+롤테이너 합계 기준
    const efficiencies = snapshots.map(s => {
      const total = s.laundryBoxes + s.laundryRolls;
      return s.laundryStaff > 0 && s.laundryHours > 0
        ? +(total / s.laundryStaff / s.laundryHours).toFixed(1) : 0;
    });
    return createTrendChartConfig(
      snapshots.map(s => s.label),
      efficiencies,
      COLORS.laundry,
    );
  }, [snapshots]);

  const COLS = '100px 1fr 90px 60px 70px 64px';

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* 패널 헤더 */}
      <div style={{
        background: '#1e293b', border: '1px solid #334155',
        borderLeft: `4px solid ${COLORS.laundry}`,
        borderRadius: 8, padding: '8px 14px', marginBottom: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.laundry }}>🫧 런드리파트</div>
        <div style={{ fontSize: 10, color: '#475569' }}>생활빨래·리빙·이불</div>
      </div>

      {/* ── 파트 인원 ── */}
      <SectionHeader icon="👥" label="파트 인원" />
      <div style={{
        background: '#1e293b', border: '1px solid #334155',
        borderRadius: 8, padding: '10px 14px', marginBottom: 8,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', minWidth: 80 }}>파트 전체 인원</span>
        <div style={{ width: 100 }}>
          <NumberInput value={staff} onChange={onStaffChange} color={COLORS.laundry} />
        </div>
        <span style={{ fontSize: 11, color: '#475569' }}>명 — 모든 업무에 공동 적용</span>
      </div>

      {/* ── 파트 KPI ── */}
      <SectionHeader icon="📊" label="파트 합계" />
      <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
        {totals.wash > 0 && (
          <KPICard label="세탁처리" value={totals.wash.toLocaleString()} unit="건" color="#34d399" icon="🫧" />
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
          color="#f97316"
          icon="🛏"
          status={totals.rolls > 0 ? 'good' : 'neutral'}
        />
        <KPICard label="투입시간" value={totals.hours} unit="h" color="#94a3b8" icon="⏱" />
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

      {/* ── 업무 입력 테이블 ── */}
      <SectionHeader icon="✏️" label="업무별 입력" />
      <div style={{
        background: '#1e293b', border: '1px solid #334155',
        borderRadius: 8, overflow: 'hidden', marginBottom: 8,
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: COLS,
          background: '#0f172a', padding: '6px 12px',
          borderBottom: '1px solid #334155',
          fontSize: 10, fontWeight: 800, color: '#475569', gap: 6,
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
              padding: '5px 12px',
              background: i % 2 === 1 ? '#0f172a20' : 'transparent',
              borderBottom: '1px solid #1e293b',
              alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontSize: 12, fontWeight: 800, color }}>{task.label}</span>
              <span style={{ fontSize: 10, color: '#475569' }}>{task.description}</span>
              <NumberInput value={count} onChange={v => onUpdate(task.id, 'count', v)} color={color} />
              <span style={{ fontSize: 11, color: '#475569', textAlign: 'center' }}>{task.unit}</span>
              <NumberInput value={hours} onChange={v => onUpdate(task.id, 'hours', v)} color="#94a3b8" step={0.5} />
              <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.rate, textAlign: 'center' }}>
                {perHour > 0 ? perHour : '—'}
              </span>
            </div>
          );
        })}
      </div>

      {/* 생산물 설명 카드 */}
      <div style={{
        background: '#0f172a', border: '1px solid #334155',
        borderRadius: 8, padding: '10px 14px', marginBottom: 8,
        display: 'flex', gap: 16,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#60a5fa', marginBottom: 4 }}>📦 생활빨래건조 완료</div>
          <div style={{ fontSize: 10, color: '#475569', lineHeight: 1.6 }}>
            다스로 고객구분 → 2단건조기 건조<br />
            완료 시 플라스틱 바스켓에 고객단위 담음
          </div>
        </div>
        <div style={{ width: 1, background: '#334155' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#f97316', marginBottom: 4 }}>🛏 이불건조 완료</div>
          <div style={{ fontSize: 10, color: '#475569', lineHeight: 1.6 }}>
            리빙류 대형건조기 건조<br />
            완료 시 롤테이너에 담음
          </div>
        </div>
      </div>

      {/* ── 분석 차트 ── */}
      {(productionConfig || hoursConfig || trendConfig) && (
        <SectionHeader icon="📈" label="분석 차트" />
      )}

      <ChartCard
        title="업무별 생산량 및 시간당 처리"
        config={productionConfig}
        height="200px"
        tag="생산량"
      />

      <ChartCard title="업무별 투입시간 비율" config={hoursConfig} height="160px" tag="시간분포" />

      <ChartCard
        title="날짜별 인시당 생산성 추이"
        config={trendConfig}
        height="150px"
        tag={snapshots.length >= 3 ? 'SPC' : '추이'}
      />
    </div>
  );
};
