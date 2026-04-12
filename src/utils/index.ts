import type { TaskMetrics } from '../types';

export function calcMetrics(count: number, staff: number, hours: number): TaskMetrics {
  const perHour    = hours > 0 ? +(count / hours).toFixed(1) : 0;
  const perPerson  = staff > 0 ? +(count / staff).toFixed(1) : 0;
  const efficiency = staff > 0 && hours > 0 ? +(count / staff / hours).toFixed(1) : 0;
  return { perHour, perPerson, efficiency };
}

export function formatDateLabel(date: string): { month: string; day: string } {
  const d = new Date(date + 'T00:00:00');
  return {
    month: String(d.getMonth() + 1),
    day:   String(d.getDate()),
  };
}

export function n(v: number | string): number {
  const val = typeof v === 'string' ? parseFloat(v) : v;
  return isNaN(val) ? 0 : val;
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}
