// ── 클리닝파트 ────────────────────────────────────────────
export type CleaningTaskId = '분류' | '기계' | '웨트' | '건조&셔츠' | 'QC';

export interface CleaningTask {
  id: CleaningTaskId;
  label: string;
  description: string;
  unit: string;
  staff: number;
  count: number;        // 분류·QC만 의미 있음 (나머지는 UI에서 입력 비활성)
  qcHours?: number;     // QC 전용 별도 시간 (id==='QC'일 때만 사용)
  stainCheck?: number;  // 분류·QC 모두 사용
}

// ── 런드리파트 ────────────────────────────────────────────
export type LaundryTaskId = '생활빨래건조' | '이불건조';

export interface LaundryTask {
  id: LaundryTaskId;
  label: string;
  description: string;
  unit: string;
  count: number;
  hours: number;
}

export interface LaundryData {
  staff: number;
  tasks: LaundryTask[];
}

// ── 일별 기록 ─────────────────────────────────────────────
export interface DailySnapshot {
  date: string;         // YYYY-MM-DD
  label: string;        // MM/DD
  // 클리닝 합계
  cleaningStaff: number;
  cleaningTotal: number;        // 분류 생산량
  cleaningHours: number;        // 총 투입시간(인시)
  cleaningEfficiency: number;   // 인시당 생산량 (분류+기계)/인원
  stainCheckCount: number;      // 분류 얼룩체크 건수
  qcStainCheckCount?: number;   // QC 얼룩체크 건수
  // 런드리 합계
  laundryStaff: number;
  laundryBoxes: number;         // 생활빨래건조 박스
  laundryRolls: number;         // 이불건조 롤테이너
  laundryHours: number;
}

// ── 계산된 생산성 지표 ────────────────────────────────────
export interface TaskMetrics {
  perHour: number;
  perPerson: number;
  efficiency: number;
}
