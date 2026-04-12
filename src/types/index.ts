// ── 클리닝파트 ────────────────────────────────────────────
export type CleaningTaskId = '분류' | '기계' | '웨트' | '건조' | '셔츠' | 'QC';

export interface CleaningTask {
  id: CleaningTaskId;
  label: string;        // 표시명
  description: string;  // 업무 설명
  unit: string;         // 생산단위
  staff: number;        // 담당 인원
  count: number;        // 생산량
  hours: number;        // 투입시간 (h)
  stainCheck?: number;  // 얼룩체크 건수 (분류 업무 전용)
}

// ── 런드리파트 ────────────────────────────────────────────
export type LaundryTaskId = '세탁' | '생활빨래건조' | '이불건조';

export interface LaundryTask {
  id: LaundryTaskId;
  label: string;
  description: string;
  unit: string;
  count: number;       // 생산량
  hours: number;       // 투입시간 (h)
}

export interface LaundryData {
  staff: number;       // 파트 전체 인원
  tasks: LaundryTask[];
}

// ── 일별 기록 ─────────────────────────────────────────────
export interface DailySnapshot {
  date: string;       // YYYY-MM-DD
  label: string;      // MM/DD
  // 클리닝 합계
  cleaningStaff: number;
  cleaningTotal: number;
  cleaningHours: number;
  cleaningEfficiency: number; // 인시당 생산량
  stainCheckCount: number;    // 얼룩체크 건수
  // 런드리 합계
  laundryStaff: number;
  laundryBoxes: number;     // 생활빨래건조 박스
  laundryRolls: number;     // 이불건조 롤테이너
  laundryHours: number;
}

// ── 계산된 생산성 지표 ────────────────────────────────────
export interface TaskMetrics {
  perHour: number;      // 시간당 생산량
  perPerson: number;    // 인당 생산량
  efficiency: number;   // 인시당 생산량 (count / staff / hours)
}
