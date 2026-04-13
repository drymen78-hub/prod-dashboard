import { OrderColor, ProcessStage, WorkOrder, DashboardState } from '../types';

export interface ColorInfo {
  bg: string;
  text: string;
  light: string;
  label: string;
}

export const ORDER_COLOR_MAP: Record<OrderColor, ColorInfo> = {
  파랑: { bg: '#2563eb', text: '#fff', light: '#eff6ff', label: '파랑' },
  주황: { bg: '#ea580c', text: '#fff', light: '#fff7ed', label: '주황' },
  골드: { bg: '#b45309', text: '#fff', light: '#fffbeb', label: '골드' },
  분홍: { bg: '#db2777', text: '#fff', light: '#fdf2f8', label: '분홍' },
  검정: { bg: '#374151', text: '#fff', light: '#f9fafb', label: '검정' },
  노랑: { bg: '#ca8a04', text: '#fff', light: '#fefce8', label: '노랑' },
  민트: { bg: '#059669', text: '#fff', light: '#f0fdf4', label: '민트' },
  보라: { bg: '#7c3aed', text: '#fff', light: '#f5f3ff', label: '보라' },
  초록: { bg: '#16a34a', text: '#fff', light: '#f0fdf4', label: '초록' },
};

export interface StageInfo {
  bg: string;
  text: string;
  border: string;
  label: string;
  weight: number;
}

export const STAGE_MAP: Record<ProcessStage, StageInfo> = {
  '':   { bg: '#f8fafc', text: '#94a3b8', border: '#e2e8f0', label: '—',    weight: 0   },
  초반: { bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd', label: '초반', weight: 25  },
  중반: { bg: '#fef9c3', text: '#854d0e', border: '#fde047', label: '중반', weight: 50  },
  후반: { bg: '#ffedd5', text: '#c2410c', border: '#fdba74', label: '후반', weight: 75  },
  완료: { bg: '#dcfce7', text: '#15803d', border: '#86efac', label: '완료', weight: 100 },
};

export const STAGE_ORDER: ProcessStage[] = ['', '초반', '중반', '후반', '완료'];

export const ORDER_COLORS: OrderColor[] = [
  '파랑', '주황', '골드', '분홍', '검정', '노랑', '민트', '보라', '초록',
];

export const DEFAULT_WORK_ORDERS: WorkOrder[] = ORDER_COLORS.map((color, i) => ({
  id: String(i + 1),
  color,
  count: 0,
  classification: '' as ProcessStage,
  dryCleaning:    '' as ProcessStage,
  wet:            '' as ProcessStage,
  shirts:         '' as ProcessStage,
  intensiveCare:  '' as ProcessStage,
}));

export const DEFAULT_STATE: DashboardState = {
  date: new Date().toISOString().slice(0, 10),
  staff: { classification: 0, machine: 0, qc: 0, wet: 0, dryShirts: 0, support: 0 },
  workOrders: DEFAULT_WORK_ORDERS,
  avgItemsPerUnit: 0,
  washMethodCount: 0,
  notes: '',
  savedAt: '',
};

export const STAFF_POSITIONS: Array<{
  key: keyof DashboardState['staff'];
  label: string;
}> = [
  { key: 'classification', label: '분류'        },
  { key: 'machine',        label: '기계'        },
  { key: 'qc',             label: 'QC'          },
  { key: 'wet',            label: '웨트'        },
  { key: 'dryShirts',      label: '건조&셔츠'   },
  { key: 'support',        label: '지원 및 기타' },
];

export type StageField =
  | 'classification'
  | 'dryCleaning'
  | 'wet'
  | 'shirts'
  | 'intensiveCare';

export const STAGE_COLUMNS: Array<{ key: StageField; label: string }> = [
  { key: 'classification', label: '대분류'       },
  { key: 'dryCleaning',   label: '드라이클리닝'  },
  { key: 'wet',           label: '웨트'          },
  { key: 'shirts',        label: '셔츠'          },
  { key: 'intensiveCare', label: '집중케어세탁'  },
];
