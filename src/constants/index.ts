import type { CleaningTask, LaundryTask } from '../types';

// ── 색상 테마 ─────────────────────────────────────────────
export const COLORS = {
  background: '#080f1e',
  card:       '#1e293b',
  border:     '#334155',
  text: {
    primary:   '#f1f5f9',
    secondary: '#94a3b8',
    muted:     '#475569',
  },
  cleaning: '#60a5fa',   // 클리닝 파트 (blue)
  laundry:  '#34d399',   // 런드리 파트 (green)
  success:  '#4ade80',
  warn:     '#f97316',
  alert:    '#f87171',
  rate:     '#fbbf24',
} as const;

// ── 클리닝파트 기본 업무 ──────────────────────────────────
export const CLEANING_TASKS_DEFAULT: CleaningTask[] = [
  { id: '분류', label: '분류',  description: '세탁방법 구분',        unit: '건',  staff: 0, count: 0, hours: 0, stainCheck: 0 },
  { id: '기계', label: '기계',  description: '드라이클리닝 투입/회수', unit: '건',  staff: 0, count: 0, hours: 0 },
  { id: '웨트', label: '웨트',  description: '물세탁 전처리+세탁기',   unit: '건',  staff: 0, count: 0, hours: 0 },
  { id: '건조', label: '건조',  description: '기계+자연건조',          unit: '건',  staff: 0, count: 0, hours: 0 },
  { id: '셔츠', label: '셔츠',  description: '셔츠 건조 후 카트 담기', unit: '카트', staff: 0, count: 0, hours: 0 },
  { id: 'QC',  label: 'QC',    description: '드라이클리닝 검수',      unit: '건',  staff: 0, count: 0, hours: 0 },
];

// ── 런드리파트 기본 업무 ──────────────────────────────────
export const LAUNDRY_TASKS_DEFAULT: LaundryTask[] = [
  { id: '세탁',        label: '세탁',        description: '생활빨래+리빙 물세탁', unit: '건',     count: 0, hours: 0 },
  { id: '생활빨래건조', label: '생활빨래건조', description: '고객구분 후 2단건조기', unit: '박스',   count: 0, hours: 0 },
  { id: '이불건조',    label: '이불건조',     description: '리빙류 대형건조기',     unit: '롤테이너', count: 0, hours: 0 },
];

// ── 로컬스토리지 키 ───────────────────────────────────────
export const STORAGE_KEYS = {
  SNAPSHOTS: 'prod_snapshots',
} as const;

// ── 업무별 색상 ───────────────────────────────────────────
export const CLEANING_TASK_COLORS: Record<string, string> = {
  '분류': '#60a5fa',
  '기계': '#818cf8',
  '웨트': '#a78bfa',
  '건조': '#34d399',
  '셔츠': '#fbbf24',
  'QC':  '#f87171',
};

export const LAUNDRY_TASK_COLORS: Record<string, string> = {
  '세탁':        '#34d399',
  '생활빨래건조': '#60a5fa',
  '이불건조':    '#f97316',
};
