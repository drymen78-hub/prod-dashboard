import { OrderColor, ProcessStatusMap, DashboardState, HandoverSection, KickerSlot, LaundryState } from '../types';

export interface ColorInfo { bg: string; text: string; label: string; }

export const ORDER_COLOR_MAP: Record<OrderColor, ColorInfo> = {
  파랑: { bg: '#2563eb', text: '#fff', label: '파랑' },
  주황: { bg: '#ea580c', text: '#fff', label: '주황' },
  골드: { bg: '#b45309', text: '#fff', label: '골드' },
  분홍: { bg: '#db2777', text: '#fff', label: '분홍' },
  검정: { bg: '#374151', text: '#fff', label: '검정' },
  노랑: { bg: '#ca8a04', text: '#fff', label: '노랑' },
  민트: { bg: '#059669', text: '#fff', label: '민트' },
  보라: { bg: '#7c3aed', text: '#fff', label: '보라' },
  초록: { bg: '#16a34a', text: '#fff', label: '초록' },
};

export const ORDER_COLORS: OrderColor[] = [
  '파랑', '주황', '골드', '분홍', '검정', '노랑', '민트', '보라', '초록',
];

export const PROCESS_LABELS: Record<string, { label: string; short: string }> = {
  classification: { label: '대분류',      short: '대분류' },
  dryCleaning:    { label: '드라이클리닝', short: '드라이' },
  wet:            { label: '웨트세탁',    short: '웨트'   },
  shirts:         { label: '셔츠세탁',    short: '셔츠'   },
};

export const PROCESS_KEYS = ['classification', 'dryCleaning', 'wet', 'shirts'] as const;

const DEFAULT_PROCESS_STATUS: ProcessStatusMap = {
  classification: { color: '', progress: 0 },
  dryCleaning:    { color: '', progress: 0 },
  wet:            { color: '', progress: 0 },
  shirts:         { color: '', progress: 0 },
};

export const DEFAULT_NOTES: HandoverSection = {
  incomplete: '', issues: '', dayTeamRequest: '', other: '',
};

export const DEFAULT_LAUNDRY: LaundryState = {
  staff: 0,
  foldingDryBox: 0,
  livingDryRT: 0,
  breakdown35kg: 0,
  breakdown50kg: 0,
  breakdown2stage: 0,
  breakdown60kg: 0,
};

export const MACHINE_TOTALS = {
  breakdown35kg:  { label: '35kg 세탁기',  total: 17, unit: '대' },
  breakdown50kg:  { label: '50kg 세탁기',  total: 5,  unit: '대' },
  breakdown2stage: { label: '2단 건조기',  total: 80, unit: '대' },
  breakdown60kg:  { label: '60kg 건조기',  total: 6,  unit: '대' },
} as const;

export const DEFAULT_KICKERS: KickerSlot[] = [1, 2, 3, 4].map(i => ({
  id: String(i), on: false, slots: 0,
}));

export const DEFAULT_STATE: DashboardState = {
  date: new Date().toISOString().slice(0, 10),
  staff: { classification: 0, machine: 0, qc: 0, wet: 0, dryShirts: 0, support: 0 },
  workSequence: [],
  processStatus: DEFAULT_PROCESS_STATUS,
  intensiveCareColors: [],
  totalCount: 0,
  avgItemsPerUnit: 0,
  washMethodCount: 0,
  targetCount: 0,
  workHours: 0,
  laundry: DEFAULT_LAUNDRY,
  notes: DEFAULT_NOTES,
  kickers: DEFAULT_KICKERS,
  savedAt: '',
};

export const STAFF_POSITIONS: Array<{ key: keyof DashboardState['staff']; label: string }> = [
  { key: 'classification', label: '분류'        },
  { key: 'machine',        label: '기계'        },
  { key: 'qc',             label: 'QC'          },
  { key: 'wet',            label: '웨트'        },
  { key: 'dryShirts',      label: '건조&셔츠'   },
  { key: 'support',        label: '지원 및 기타' },
];
