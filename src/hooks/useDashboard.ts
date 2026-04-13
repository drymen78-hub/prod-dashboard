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
  // 클리닝 공통 근무시간 (QC 제외 전 업무가 공유)
  const [cleaningSharedHours, setCleaningSharedHours] = useState(0);
  // 당일 예상 총출고 개별수 (목표 달성률 계산용)
  const [cleaningTarget, setCleaningTarget] = useState(0);

  const [laundryStaff, setLaundryStaff] = useState(0);
  const [laundryTasks, setLaundryTasks]  = useState<LaundryTask[]>(cloneLaundry);
  // 런드리 지원 관리
  const [laundrySupportSent,     setLaundrySupportSent]     = useState('');
  const [laundrySupportReceived, setLaundrySupportReceived] = useState('');
  // 당일 예상 한밤생빨 고객수 (목표 달성률 계산용)
  const [laundryTarget, setLaundryTarget] = useState(0);

  const [saved, setSaved]     = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const { snapshots, upsert } = useRecords();
  const dateLabel = useMemo(() => formatDateLabel(reportDate), [reportDate]);

  // ── 클리닝 집계 ──────────────────────────────────────────
  const cleaningTotals = useMemo(() => {
    const totalStaff = cleaningTasks.reduce((s, t) => s + n(t.staff), 0);

    // 총처리량 = 분류 생산량만
    const classifyCount = n(cleaningTasks.find(t => t.id === '분류')?.count ?? 0);
    const machineCount  = n(cleaningTasks.find(t => t.id === '기계')?.count  ?? 0);
    const qcTask        = cleaningTasks.find(t => t.id === 'QC');
    const qcStaff       = n(qcTask?.staff ?? 0);
    const qcHours       = n(qcTask?.qcHours ?? 0);
    const nonQcStaff    = totalStaff - qcStaff;

    // 총투입시간 = (non-QC 인원 × 공통시간) + (QC 인원 × QC시간)
    const totalHours = nonQcStaff * cleaningSharedHours + qcStaff * qcHours;

    // 인시당 생산량 = (분류 + 기계) / 총인원 (0 방지)
    const eff = totalStaff > 0
      ? +((classifyCount + machineCount) / totalStaff).toFixed(1)
      : 0;

    // 목표 달성률
    const achieveRate = cleaningTarget > 0
      ? +((classifyCount / cleaningTarget) * 100).toFixed(1)
      : 0;

    return {
      staff:        totalStaff,
      count:        classifyCount,        // 총처리량 = 분류만
      hours:        +totalHours.toFixed(1),
      eff,
      classifyCount,
      machineCount,
      achieveRate,
    };
  }, [cleaningTasks, cleaningSharedHours, cleaningTarget]);

  // ── 런드리 집계 ──────────────────────────────────────────
  const laundryTotals = useMemo(() => {
    const hours = laundryTasks.reduce((s, t) => s + n(t.hours), 0);
    const boxes = n(laundryTasks.find(t => t.id === '생활빨래건조')?.count ?? 0);
    const rolls = n(laundryTasks.find(t => t.id === '이불건조')?.count    ?? 0);

    // 인시당 생산량 = 생활빨래건조만 사용
    const eff = laundryStaff > 0 && hours > 0
      ? +(boxes / laundryStaff / hours).toFixed(1)
      : 0;

    // 목표 달성률 (생활빨래건조 처리 / 목표 고객수)
    const achieveRate = laundryTarget > 0
      ? +((boxes / laundryTarget) * 100).toFixed(1)
      : 0;

    return { staff: laundryStaff, hours: +hours.toFixed(1), boxes, rolls, eff, achieveRate };
  }, [laundryTasks, laundryStaff, laundryTarget]);

  // ── 업무 수정 핸들러 ──────────────────────────────────────
  const updateCleaningTask = useCallback(
    (id: string, field: 'staff' | 'count' | 'qcHours' | 'stainCheck', value: number) => {
      setCleaningTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
      setSaved(false); setSaveMsg('');
    }, []);

  const updateLaundryTask = useCallback((id: string, field: 'count' | 'hours', value: number) => {
    setLaundryTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
    setSaved(false); setSaveMsg('');
  }, []);

  const updateLaundryStaff = useCallback((v: number) => {
    setLaundryStaff(Math.max(0, v));
    setSaved(false); setSaveMsg('');
  }, []);

  // ── 저장 ─────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    const stainCheck   = n(cleaningTasks.find(t => t.id === '분류')?.stainCheck  ?? 0);
    const qcStainCheck = n(cleaningTasks.find(t => t.id === 'QC')?.stainCheck    ?? 0);
    const snap: DailySnapshot = {
      date:  reportDate,
      label: reportDate.slice(5).replace('-', '/'),
      cleaningStaff:      cleaningTotals.staff,
      cleaningTotal:      cleaningTotals.count,
      cleaningHours:      cleaningTotals.hours,
      cleaningEfficiency: cleaningTotals.eff,
      stainCheckCount:    stainCheck,
      qcStainCheckCount:  qcStainCheck,
      laundryStaff:       laundryTotals.staff,
      laundryBoxes:       laundryTotals.boxes,
      laundryRolls:       laundryTotals.rolls,
      laundryHours:       laundryTotals.hours,
    };
    upsert(snap);
    setSaved(true);
    setSaveMsg('✓ 저장 완료');
  }, [reportDate, cleaningTasks, cleaningTotals, laundryTotals, upsert]);

  // ── 초기화 ────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setCleaningTasks(cloneCleaning());
    setCleaningSharedHours(0);
    setCleaningTarget(0);
    setLaundryTasks(cloneLaundry());
    setLaundryStaff(0);
    setLaundrySupportSent('');
    setLaundrySupportReceived('');
    setLaundryTarget(0);
    setSaved(false);
    setSaveMsg('');
  }, []);

  const hasData = useMemo(() =>
    cleaningTasks.some(t => n(t.count) > 0 || n(t.staff) > 0) ||
    laundryTasks.some(t => n(t.count) > 0 || n(t.hours) > 0),
  [cleaningTasks, laundryTasks]);

  return {
    reportDate, setReportDate, dateLabel,
    cleaningTasks, updateCleaningTask,
    cleaningSharedHours, setCleaningSharedHours: (v: number) => { setCleaningSharedHours(v); setSaved(false); setSaveMsg(''); },
    cleaningTarget,      setCleaningTarget:      (v: number) => { setCleaningTarget(v);      setSaved(false); setSaveMsg(''); },
    laundryStaff, updateLaundryStaff,
    laundryTasks, updateLaundryTask,
    laundrySupportSent,     setLaundrySupportSent:     (v: string) => { setLaundrySupportSent(v);     setSaved(false); setSaveMsg(''); },
    laundrySupportReceived, setLaundrySupportReceived: (v: string) => { setLaundrySupportReceived(v); setSaved(false); setSaveMsg(''); },
    laundryTarget, setLaundryTarget: (v: number) => { setLaundryTarget(v); setSaved(false); setSaveMsg(''); },
    cleaningTotals, laundryTotals,
    snapshots,
    saved, saveMsg, handleSave, handleReset,
    hasData,
  };
}
