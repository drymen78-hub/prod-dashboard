/// <reference types="vite/client" />
import { DashboardState } from '../types';
import { STAGE_MAP } from '../constants';
import type { StageField } from '../constants';

const SCRIPT_URL = import.meta.env.VITE_SHEETS_SCRIPT_URL as string;

const DAY_KR = ['일', '월', '화', '수', '목', '금', '토'];

function colorsForField(state: DashboardState, field: StageField): string {
  return state.workOrders
    .filter(wo => wo.count > 0 && wo[field] !== '')
    .map(wo => wo.color)
    .join(', ');
}

function avgProgressForField(state: DashboardState, field: StageField): number {
  const relevant = state.workOrders.filter(wo => wo.count > 0 && wo[field] !== '');
  if (relevant.length === 0) return 0;
  return Math.round(
    relevant.reduce((s, wo) => s + STAGE_MAP[wo[field]].weight, 0) / relevant.length
  );
}

export function buildSheetsPayload(
  state: DashboardState,
  totalStaff: number,
  processingRate: number,
) {
  const d = new Date(state.date + 'T00:00:00');
  const activeOrders = state.workOrders.filter(wo => wo.count > 0);

  return {
    date: state.date,
    dayOfWeek: DAY_KR[d.getDay()],
    staff: totalStaff,
    hours: state.workHours,
    processed: state.washMethodCount,
    target: state.targetCount,
    progressRate: processingRate,
    workOrderColors: activeOrders.length,
    preSortColor:    colorsForField(state, 'classification'),
    dryColor:        colorsForField(state, 'dryCleaning'),
    dryProgress:     avgProgressForField(state, 'dryCleaning'),
    focusCareColors: state.workOrders.filter(wo => wo.count > 0 && wo.intensiveCare !== '').length,
    wetColor:        colorsForField(state, 'wet'),
    wetProgress:     avgProgressForField(state, 'wet'),
    shirtColor:      colorsForField(state, 'shirts'),
    shirtProgress:   avgProgressForField(state, 'shirts'),
    kickerActive: state.kickers.filter(k => k.on).length,
    kickerSlots:  state.kickers.filter(k => k.on).reduce((s, k) => s + (k.slots || 0), 0),
  };
}

export async function saveToSheets(
  state: DashboardState,
  totalStaff: number,
  processingRate: number,
): Promise<void> {
  if (!SCRIPT_URL) throw new Error('VITE_SHEETS_SCRIPT_URL이 설정되지 않았습니다.');

  const payload = buildSheetsPayload(state, totalStaff, processingRate);

  // Apps Script는 CORS preflight를 지원하지 않으므로 no-cors 모드로 전송
  // no-cors에서는 응답 본문을 읽을 수 없지만 데이터는 전달됨
  await fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
