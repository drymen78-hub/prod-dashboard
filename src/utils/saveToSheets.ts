/// <reference types="vite/client" />
import { DashboardState } from '../types';
import { PROCESS_KEYS } from '../constants';

const SCRIPT_URL = import.meta.env.VITE_SHEETS_SCRIPT_URL as string;

const DAY_KR = ['일', '월', '화', '수', '목', '금', '토'];

export function buildSheetsPayload(
  state: DashboardState,
  totalStaff: number,
  processingRate: number,
) {
  const d = new Date(state.date + 'T00:00:00');
  const ps = state.processStatus;

  return {
    date:         state.date,
    dayOfWeek:    DAY_KR[d.getDay()],
    staff:        totalStaff,
    hours:        state.workHours,
    processed:    state.washMethodCount,
    target:       state.targetCount,
    progressRate: processingRate,
    workOrderColors: state.workSequence.length,
    preSortColor:    ps.classification.color,
    preSortProgress: ps.classification.progress,
    dryColor:        ps.dryCleaning.color,
    dryProgress:     ps.dryCleaning.progress,
    focusCareColors: state.intensiveCareColors.length,
    wetColor:        ps.wet.color,
    wetProgress:     ps.wet.progress,
    shirtColor:      ps.shirts.color,
    shirtProgress:   ps.shirts.progress,
    kickerActive: state.kickers.filter(k => k.on).length,
    kickerSlots:  state.kickers.filter(k => k.on).reduce((s, k) => s + (k.slots || 0), 0),
    // summary
    processDone:  PROCESS_KEYS.filter(k => ps[k].color && ps[k].progress >= 100).length,
    processInProg: PROCESS_KEYS.filter(k => ps[k].color && ps[k].progress < 100 && ps[k].progress > 0).length,
  };
}

export async function saveToSheets(
  state: DashboardState,
  totalStaff: number,
  processingRate: number,
): Promise<void> {
  if (!SCRIPT_URL) throw new Error('VITE_SHEETS_SCRIPT_URL이 설정되지 않았습니다.');

  const payload = buildSheetsPayload(state, totalStaff, processingRate);

  // no-cors 모드에서는 Content-Type: application/json이 브라우저에 의해 차단됨.
  // 헤더 없이 body만 전송하면 text/plain으로 전달되며,
  // Apps Script에서 e.postData.contents 로 JSON 파싱 가능.
  await fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(payload),
  });
}
