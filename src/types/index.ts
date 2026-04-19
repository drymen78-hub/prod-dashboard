// 바코드 색상 (선입선출 작업 식별자)
export type OrderColor =
  | '파랑' | '주황' | '골드' | '분홍' | '검정'
  | '노랑' | '민트' | '보라' | '초록';

export type ProcessStage = '' | '초반' | '중반' | '후반' | '완료';

export interface WorkOrder {
  id: string;
  color: OrderColor;
  count: number;
  classification: ProcessStage;
  dryCleaning: ProcessStage;
  intensiveCare: ProcessStage; // 드라이클리닝 셀 내부 배지로 표시
  wet: ProcessStage;
  shirts: ProcessStage;
}

export interface StaffCounts {
  classification: number;
  machine: number;
  qc: number;
  wet: number;
  dryShirts: number;
  support: number;
}

// 인수인계 메모 4개 섹션
export interface HandoverSection {
  incomplete: string;      // 미완료 항목
  issues: string;          // 특이사항
  dayTeamRequest: string;  // 주간팀 요청
  other: string;           // 기타
}

// 키커 운영 현황
export interface KickerSlot {
  id: string;
  on: boolean;
  slots: number;
}

export interface DashboardState {
  date: string;
  staff: StaffCounts;
  workOrders: WorkOrder[];
  avgItemsPerUnit: number;
  washMethodCount: number;
  targetCount: number;   // 목표건수
  workHours: number;     // 근무시간
  notes: HandoverSection;
  kickers: KickerSlot[];
  savedAt: string;
}
