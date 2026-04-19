import { useState, useCallback } from 'react';
import { DashboardState, ProcessStage, OrderColor, HandoverSection, KickerSlot } from '../types';
import { DEFAULT_STATE, DEFAULT_NOTES, DEFAULT_KICKERS, StageField } from '../constants';

const STORAGE_KEY = 'shift-handover-v2';
const HISTORY_KEY = 'shift-history-v1';

function load(): DashboardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw) as Partial<DashboardState>;

    // notes 마이그레이션: 이전 버전에서 string이었던 경우 처리
    let notes: HandoverSection;
    if (typeof (parsed as any).notes === 'string') {
      notes = { ...DEFAULT_NOTES, other: (parsed as any).notes as string };
    } else {
      notes = { ...DEFAULT_NOTES, ...(parsed.notes ?? {}) };
    }

    return {
      ...structuredClone(DEFAULT_STATE),
      ...parsed,
      staff: { ...DEFAULT_STATE.staff, ...(parsed.staff ?? {}) },
      notes,
      kickers: (parsed.kickers ?? structuredClone(DEFAULT_KICKERS)) as KickerSlot[],
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
      // 0.5 단위 허용, 음수 방지
      const clamped = Math.max(0, Math.round(val * 2) / 2);
      const next = { ...s, staff: { ...s.staff, [key]: clamped } };
      persist(next); return next;
    });
  }, []);

  const updateWorkOrder = useCallback(
    (id: string, field: 'count' | StageField, val: number | ProcessStage) => {
      setState(s => {
        const next = {
          ...s,
          workOrders: s.workOrders.map(wo => wo.id === id ? { ...wo, [field]: val } : wo),
        };
        persist(next); return next;
      });
    }, []
  );

  const updateWorkOrderColor = useCallback((id: string, color: OrderColor) => {
    setState(s => {
      const next = {
        ...s,
        workOrders: s.workOrders.map(wo => wo.id === id ? { ...wo, color } : wo),
      };
      persist(next); return next;
    });
  }, []);

  const updateNote = useCallback((field: keyof HandoverSection, val: string) => {
    setState(s => {
      const next = { ...s, notes: { ...s.notes, [field]: val } };
      persist(next); return next;
    });
  }, []);

  const updateKicker = useCallback((id: string, field: 'on' | 'slots', val: boolean | number) => {
    setState(s => {
      const next = {
        ...s,
        kickers: s.kickers.map(k => k.id === id ? { ...k, [field]: val } : k),
      };
      persist(next); return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setState(s => {
      const fresh = { ...structuredClone(DEFAULT_STATE), date: s.date };
      persist(fresh); return fresh;
    });
  }, []);

  const totalStaff = Object.values(state.staff).reduce((a, b) => a + (b || 0), 0);
  const totalCount = state.workOrders.reduce((a, wo) => a + (wo.count || 0), 0);
  const expectedTotal =
    totalCount > 0 && state.avgItemsPerUnit > 0
      ? Math.round(totalCount * state.avgItemsPerUnit) : 0;
  const processingRate =
    expectedTotal > 0 && state.washMethodCount > 0
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

    const record = {
      date: state.date, totalStaff,
      classification: state.staff.classification, machine: state.staff.machine,
      qc: state.staff.qc, wet: state.staff.wet, dryShirts: state.staff.dryShirts,
      support: state.staff.support, totalCount,
      avgItemsPerUnit: state.avgItemsPerUnit, expectedTotal,
      washMethodCount: state.washMethodCount, processingRate,
      notes: notesText, savedAt: now,
    };

    const history: typeof record[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    const idx = history.findIndex(r => r.date === state.date);
    if (idx >= 0) history[idx] = record; else history.push(record);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

    const headers = ['날짜', '총인원', '분류', '기계', 'QC', '웨트', '건조&셔츠', '지원',
      '총건수', '건당평균', '예상개별수', '세탁건수', '처리율(%)', '메모', '저장시간'];
    const rows = history.map(r => [
      r.date, r.totalStaff, r.classification, r.machine, r.qc,
      r.wet, r.dryShirts, r.support, r.totalCount,
      r.avgItemsPerUnit, r.expectedTotal, r.washMethodCount,
      r.processingRate, r.notes, r.savedAt,
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `세탁인계기록_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }, [state, set, totalStaff, totalCount, expectedTotal, processingRate]);

  return {
    state, set,
    updateStaff, updateWorkOrder, updateWorkOrderColor,
    updateNote, updateKicker,
    handleReset, saveRecord,
    totalStaff, totalCount, expectedTotal, processingRate,
  };
}
