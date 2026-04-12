import { useState, useCallback, useMemo } from 'react';
import { useRecords } from './useRecords';
import { CLEANING_TASKS_DEFAULT, LAUNDRY_TASKS_DEFAULT } from '../constants';
import { today, formatDateLabel, n } from '../utils';
import type { CleaningTask, LaundryTask, DailySnapshot } from '../types';

function cloneCleaning(): CleaningTask[] {
  return CLEANING_TASKS_DEFAULT.map(t => ({ ...t }));
}
function cloneLaundry(): LaundryTask[] {
  return LAUNDRY_TASKS_DEFAULT.map(t => ({ ...t }));
}

export function useDashboard() {
  const [reportDate, setReportDate] = useState(today);
  const [cleaningTasks, setCleaningTasks] = useState<CleaningTask[]>(cloneCleaning);
  const [laundryStaff, setLaundryStaff]   = useState(0);
  const [laundryTasks, setLaundryTasks]   = useState<LaundryTask[]>(cloneLaundry);
  const [saved, setSaved]   = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const { snapshots, upsert } = useRecords();

  const dateLabel = useMemo(() => formatDateLabel(reportDate), [reportDate]);

  // ── 클리닝 집계 ──────────────────────────────────────────
  const cleaningTotals = useMemo(() => {
    const staff = cleaningTasks.reduce((s, t) => s + n(t.staff), 0);
    const count = cleaningTasks
      .filter(t => t.unit === '건')
      .reduce((s, t) => s + n(t.count), 0);
    const hours = cleaningTasks.reduce((s, t) => s + n(t.hours), 0);
    const eff   = staff > 0 && hours > 0 ? +(count / staff / hours).toFixed(1) : 0;
    return { staff, count, hours: +hours.toFixed(1), eff };
  }, [cleaningTasks]);

  // ── 런드리 집계 ──────────────────────────────────────────
  const laundryTotals = useMemo(() => {
    const hours   = laundryTasks.reduce((s, t) => s + n(t.hours), 0);
    const boxes   = n(laundryTasks.find(t => t.id === '생활빨래건조')?.count ?? 0);
    const rolls   = n(laundryTasks.find(t => t.id === '이불건조')?.count ?? 0);
    const wash    = n(laundryTasks.find(t => t.id === '세탁')?.count ?? 0);
    const total   = boxes + rolls; // 주요 생산 지표 합산
    const eff     = laundryStaff > 0 && hours > 0 ? +(total / laundryStaff / hours).toFixed(1) : 0;
    return { staff: laundryStaff, hours: +hours.toFixed(1), boxes, rolls, wash, total, eff };
  }, [laundryTasks, laundryStaff]);

  // ── 업무 수정 핸들러 ──────────────────────────────────────
  const updateCleaningTask = useCallback((id: string, field: 'staff' | 'count' | 'hours' | 'stainCheck', value: number) => {
    setCleaningTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
    setSaved(false); setSaveMsg('');
  }, []);

  const updateLaundryTask = useCallback((id: string, field: 'count' | 'hours', value: number) => {
    setLaundryTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
    setSaved(false); setSaveMsg('');
  }, []);

  const updateLaundryStaff = useCallback((v: number) => {
    setLaundryStaff(v);
    setSaved(false); setSaveMsg('');
  }, []);

  // ── 저장 ─────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    const stainCheck = n(cleaningTasks.find(t => t.id === '분류')?.stainCheck ?? 0);
    const snap: DailySnapshot = {
      date:  reportDate,
      label: reportDate.slice(5).replace('-', '/'),
      cleaningStaff:      cleaningTotals.staff,
      cleaningTotal:      cleaningTotals.count,
      cleaningHours:      cleaningTotals.hours,
      cleaningEfficiency: cleaningTotals.eff,
      stainCheckCount:    stainCheck,
      laundryStaff:       laundryTotals.staff,
      laundryBoxes:       laundryTotals.boxes,
      laundryRolls:       laundryTotals.rolls,
      laundryHours:       laundryTotals.hours,
    };
    upsert(snap);
    setSaved(true);
    setSaveMsg('✓ 저장 완료');
  }, [reportDate, cleaningTotals, laundryTotals, upsert]);

  // ── 초기화 ────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setCleaningTasks(cloneCleaning());
    setLaundryTasks(cloneLaundry());
    setLaundryStaff(0);
    setSaved(false);
    setSaveMsg('');
  }, []);

  // ── 이 날짜의 기존 기록 있는지 ────────────────────────────
  const hasData = useMemo(() =>
    cleaningTasks.some(t => n(t.count) > 0 || n(t.hours) > 0) ||
    laundryTasks.some(t => n(t.count) > 0 || n(t.hours) > 0),
  [cleaningTasks, laundryTasks]);

  return {
    reportDate, setReportDate, dateLabel,
    cleaningTasks, updateCleaningTask,
    laundryStaff, updateLaundryStaff,
    laundryTasks, updateLaundryTask,
    cleaningTotals, laundryTotals,
    snapshots,
    saved, saveMsg, handleSave, handleReset,
    hasData,
  };
}
