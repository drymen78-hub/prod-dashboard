import { useState, useCallback } from 'react';
import { DashboardState, ProcessKey, ProcessStatus, ProcessStatusMap, OrderColor, HandoverSection, KickerSlot } from '../types';
import { DEFAULT_STATE, DEFAULT_NOTES, DEFAULT_KICKERS } from '../constants';

const STORAGE_KEY = 'shift-handover-v3';
const HISTORY_KEY  = 'shift-history-v2';

function load(): DashboardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw) as Partial<DashboardState>;

    let notes: HandoverSection;
    if (typeof (parsed as Record<string, unknown>).notes === 'string') {
      notes = { ...DEFAULT_NOTES, other: (parsed as Record<string, unknown>).notes as string };
    } else {
      notes = { ...DEFAULT_NOTES, ...(parsed.notes ?? {}) };
    }

    return {
      ...structuredClone(DEFAULT_STATE),
      ...parsed,
      staff: { ...DEFAULT_STATE.staff, ...(parsed.staff ?? {}) },
      processStatus: { ...DEFAULT_STATE.processStatus, ...(parsed.processStatus ?? {}) } as ProcessStatusMap,
      notes,
      kickers: (parsed.kickers ?? structuredClone(DEFAULT_KICKERS)) as KickerSlot[],
      workSequence: (parsed.workSequence ?? []) as OrderColor[],
      intensiveCareColors: (parsed.intensiveCareColors ?? []) as OrderColor[],
    };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

function persist(s: DashboardState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

export function useDashboard() {
  const [state, setState] = useState<DashboardState>(load);

  const set = useCallback(<K extends keyof DashboardState>(key: K, val: DashboardState[K]) => {
    setState(s => { const next = { ...s, [key]: val }; persist(next); return next; });
  }, []);

  const updateStaff = useCallback((key: keyof DashboardState['staff'], val: number) => {
    setState(s => {
      const clamped = Math.max(0, Math.round(val * 2) / 2);
      const next = { ...s, staff: { ...s.staff, [key]: clamped } };
      persist(next); return next;
    });
  }, []);

  const updateWorkSequence = useCallback((colors: OrderColor[]) => {
    setState(s => { const next = { ...s, workSequence: colors }; persist(next); return next; });
  }, []);

  const updateProcessStatus = useCallback((key: ProcessKey, status: ProcessStatus) => {
    setState(s => {
      const next = { ...s, processStatus: { ...s.processStatus, [key]: status } };
      persist(next); return next;
    });
  }, []);

  const updateIntensiveCareColors = useCallback((colors: OrderColor[]) => {
    setState(s => { const next = { ...s, intensiveCareColors: colors }; persist(next); return next; });
  }, []);

  const updateNote = useCallback((field: keyof HandoverSection, val: string) => {
    setState(s => {
      const next = { ...s, notes: { ...s.notes, [field]: val } };
      persist(next); return next;
    });
  }, []);

  const updateKicker = useCallback((id: string, field: 'on' | 'slots', val: boolean | number) => {
    setState(s => {
      const next = { ...s, kickers: s.kickers.map(k => k.id === id ? { ...k, [field]: val } : k) };
      persist(next); return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setState(s => {
      const fresh = { ...structuredClone(DEFAULT_STATE), date: s.date };
      persist(fresh); return fresh;
    });
  }, []);

  const totalStaff     = Object.values(state.staff).reduce((a, b) => a + (b || 0), 0);
  const totalCount     = state.totalCount;
  const expectedTotal  = totalCount > 0 && state.avgItemsPerUnit > 0
    ? Math.round(totalCount * state.avgItemsPerUnit) : 0;
  const processingRate = expectedTotal > 0 && state.washMethodCount > 0
    ? +((state.washMethodCount / expectedTotal) * 100).toFixed(1) : 0;

  const saveRecord = useCallback(() => {
    const now = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    set('savedAt', now);

    const notesText = [
      state.notes.incomplete     ? `미완료: ${state.notes.incomplete}` : '',
      state.notes.issues         ? `특이사항: ${state.notes.issues}` : '',
      state.notes.dayTeamRequest ? `주간요청: ${state.notes.dayTeamRequest}` : '',
      state.notes.other          ? `기타: ${state.notes.other}` : '',
    ].filter(Boolean).join(' | ');

    const ps = state.processStatus;
    const record = {
      date: state.date, totalStaff, workHours: state.workHours,
      totalCount, targetCount: state.targetCount,
      washMethodCount: state.washMethodCount, processingRate,
      workSequence: state.workSequence.join(', '),
      classificationColor: ps.classification.color, classificationProgress: ps.classification.progress,
      dryColor: ps.dryCleaning.color, dryProgress: ps.dryCleaning.progress,
      wetColor: ps.wet.color, wetProgress: ps.wet.progress,
      shirtColor: ps.shirts.color, shirtProgress: ps.shirts.progress,
      intensiveCareColors: state.intensiveCareColors.join(', '),
      kickerActive: state.kickers.filter(k => k.on).length,
      kickerSlots: state.kickers.filter(k => k.on).reduce((s, k) => s + (k.slots || 0), 0),
      notes: notesText, savedAt: now,
    };

    const history: typeof record[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    const idx = history.findIndex(r => r.date === state.date);
    if (idx >= 0) history[idx] = record; else history.push(record);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

    const headers = ['날짜', '총인원', '근무시간', '총건수', '목표건수', '세탁건수', '처리율(%)',
      '작업순서', '대분류색', '대분류%', '드라이색', '드라이%',
      '웨트색', '웨트%', '셔츠색', '셔츠%', '집중케어색상',
      '가동키커', '키커슬롯', '메모', '저장시간'];
    const rows = history.map(r => [
      r.date, r.totalStaff, r.workHours, r.totalCount, r.targetCount,
      r.washMethodCount, r.processingRate,
      r.workSequence, r.classificationColor, r.classificationProgress,
      r.dryColor, r.dryProgress, r.wetColor, r.wetProgress,
      r.shirtColor, r.shirtProgress, r.intensiveCareColors,
      r.kickerActive, r.kickerSlots, r.notes, r.savedAt,
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `세탁인계기록_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }, [state, set, totalStaff, totalCount, expectedTotal, processingRate]);

  return {
    state, set,
    updateStaff, updateWorkSequence, updateProcessStatus, updateIntensiveCareColors,
    updateNote, updateKicker,
    handleReset, saveRecord,
    totalStaff, totalCount, expectedTotal, processingRate,
  };
}
