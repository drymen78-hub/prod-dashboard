// 바코드 색상 (선입선출 작업 식별자)
export type OrderColor =
  | '파랑'
  | '주황'
  | '골드'
  | '분홍'
  | '검정'
  | '노랑'
  | '민트'
  | '보라'
  | '초록';

export type ProcessStage = '' | '초반' | '중반' | '후반' | '완료';

export interface WorkOrder {
  id: string;
  color: OrderColor;
  count: number;
  classification: ProcessStage;
  dryCleaning: ProcessStage;
  wet: ProcessStage;
  shirts: ProcessStage;
  intensiveCare: ProcessStage;
}

export interface StaffCounts {
  classification: number;
  machine: number;
  qc: number;
  wet: number;
  dryShirts: number;
  support: number;
}

export interface DashboardState {
  date: string;
  staff: StaffCounts;
  workOrders: WorkOrder[];
  avgItemsPerUnit: number;
  washMethodCount: number;
  notes: string;
  savedAt: string;
}
