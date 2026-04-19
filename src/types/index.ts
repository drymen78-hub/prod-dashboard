export type OrderColor =
  | '파랑' | '주황' | '골드' | '분홍' | '검정'
  | '노랑' | '민트' | '보라' | '초록' | '회색';

export type ProcessKey = 'classification' | 'dryCleaning' | 'wet' | 'shirts';

export interface ProcessStatus {
  color: OrderColor | '';
  progress: number;
}

export type ProcessStatusMap = Record<ProcessKey, ProcessStatus>;

export interface StaffCounts {
  classification: number;
  machine: number;
  qc: number;
  wet: number;
  pretreatment: number;
  dryShirts: number;
  support: number;
}

export interface HandoverSection {
  incomplete: string;     // 장비 특이사항
  issues: string;         // 인원 특이사항
  dayTeamRequest: string; // 지원 현황
  other: string;          // 기타 특이사항
}

export interface KickerSlot {
  id: string;
  on: boolean;
  slots: number;
}

export interface LaundryState {
  staff: number;
  foldingDryBox: number;
  livingDryRT: number;
}

export interface DashboardState {
  date: string;
  staff: StaffCounts;
  workSequence: OrderColor[];
  workSequenceCounts: Partial<Record<OrderColor, number>>;
  processStatus: ProcessStatusMap;
  intensiveCareColors: OrderColor[];
  avgItemsPerUnit: number;
  washMethodCount: number;
  targetCount: number;
  workHours: number;
  laundry: LaundryState;
  notes: HandoverSection;
  kickers: KickerSlot[];
  savedAt: string;
}
