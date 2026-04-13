import { useState, useCallback } from 'react';
import { DashboardState, ProcessStage } from '../types';
import { DEFAULT_STATE, StageField } from '../constants';

const STORAGE_KEY = 'shift-handover-v1';

function load(): DashboardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw) as Partial<DashboardState>;
    return {
      ...structuredClone(DEFAULT_STATE),
      ...parsed,
      staff: { ...DEFAULT_STATE.staff, ...(parsed.staff ?? {}) },
    };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

function persist(s: DashboardState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch { /* ignore */ }
}

export function useDashboard() {
  const [state, setState] = useState<DashboardState>(load);

  const set = useCallback(<K extends keyof DashboardState>(key: K, val: DashboardState[K]) => {
    setState(s => {
      const next = { ...s, [key]: val };
      persist(next);
      return next;
    });
  }, []);

  const updateStaff = useCallback((key: keyof DashboardState['staff'], val: number) => {
    setState(s => {
      const next = { ...s, staff: { ...s.staff, [key]: Math.max(0, val) } };
      persist(next);
      return next;
    });
  }, []);

  const updateWorkOrder = useCallback(
    (id: string, field: 'count' | StageField, val: number | ProcessStage) => {
      setState(s => {
        const next = {
          ...s,
          workOrders: s.workOrders.map(wo =>
            wo.id === id ? { ...wo, [field]: val } : wo
          ),
        };
        persist(next);
        return next;
      });
    },
    []
  );

  const handleReset = useCallback(() => {
    setState(s => {
      const fresh = { ...structuredClone(DEFAULT_STATE), date: s.date };
      persist(fresh);
      return fresh;
    });
  }, []);

  const totalStaff = Object.values(state.staff).reduce((a, b) => a + (b || 0), 0);
  const totalCount = state.workOrders.reduce((a, wo) => a + (wo.count || 0), 0);
  const expectedTotal =
    totalCount > 0 && state.avgItemsPerUnit > 0
      ? Math.round(totalCount * state.avgItemsPerUnit)
      : 0;
  const processingRate =
    expectedTotal > 0 && state.washMethodCount > 0
      ? +((state.washMethodCount / expectedTotal) * 100).toFixed(1)
      : 0;

  return {
    state, set, updateStaff, updateWorkOrder, handleReset,
    totalStaff, totalCount, expectedTotal, processingRate,
  };
}
