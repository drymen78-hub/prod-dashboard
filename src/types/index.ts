export type OrderColor =
  | '파랑' | '주황' | '골드' | '분홍' | '검정'
  | '노랑' | '민트' | '보라' | '초록';

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
  dryShirts: number;
  support: number;
}

export interface HandoverSection {
  incomplete: string;
  issues: string;
  dayTeamRequest: string;
  other: string;
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
  breakdown35kg: number;
  breakdown50kg: number;
  breakdown2stage: number;
  breakdown60kg: number;
}

export interface DashboardState {
  date: string;
  staff: StaffCounts;
  workSequence: OrderColor[];
  processStatus: ProcessStatusMap;
  intensiveCareColors: OrderColor[];
  totalCount: number;
  avgItemsPerUnit: number;
  washMethodCount: number;
  targetCount: number;
  workHours: number;
  laundry: LaundryState;
  notes: HandoverSection;
  kickers: KickerSlot[];
  savedAt: string;
}
