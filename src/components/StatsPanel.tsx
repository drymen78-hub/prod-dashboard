import { WorkOrder } from '../types';
import { STAGE_MAP } from '../constants';

interface Props {
  avgItemsPerUnit: number; washMethodCount: number; totalCount: number;
  expectedTotal: number; processingRate: number;
  workOrders: WorkOrder[];
  onAvgChange: (v: number) => void; onWashCountChange: (v: number) => void;
}

interface CardProps {
  label: string; value: string; sub?: string;
  accent?: boolean; highlight?: boolean;
  editable?: boolean; onEdit?: (v: number) => void; rawValue?: number;
  step?: string;
}

function calcProgress(wo: WorkOrder): number {
  const fields = ['classification', 'dryCleaning', 'intensiveCare', 'wet', 'shirts'] as const;
  const active = fields.filter(f => wo[f] !== '');
  if (active.length === 0) return 0;
  return Math.round(active.reduce((s, f) => s + STAGE_MAP[wo[f]].weight, 0) / active.length);
}

function StatCard({ label, value, sub, accent, highlight, editable, onEdit, rawValue, step }: CardProps) {
  return (
    <div style={{
      background: highlight ? 'linear-gradient(135deg,#1e3a5f,#1a3050)' : '#f8fafc',
      border: `1.5px solid ${highlight ? '#2563eb' : '#e2e8f0'}`,
      borderRadius: 10, padding: '12px 14px',
      display: 'flex', flexDirection: 'column', gap: 5,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: highlight ? '#93c5fd' : '#64748b', letterSpacing: 0.5 }}>{label}</div>
      {editable && onEdit ? (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
          <input type="number" min={0} step={step ?? '1'} value={rawValue ?? ''} placeholder="0"
            onChange={e => onEdit(Number(e.target.value))}
            style={{
              width: 90, border: 'none', borderBottom: `2px solid #2563eb`,
              background: 'transparent', fontSize: 28, fontWeight: 900,
              color: highlight ? '#fff' : '#1e293b', padding: '2px 0', outline: 'none',
            }} />
          {sub && <span style={{ fontSize: 13, color: highlight ? '#93c5fd' : '#64748b', fontWeight: 700 }}>{sub}</span>}
        </div>
      ) : (
        <div style={{ fontSize: 28, fontWeight: 900, color: accent ? '#f97316' : highlight ? '#fff' : '#1e293b', lineHeight: 1 }}>
          {value}
          {sub && <span style={{ fontSize: 13, fontWeight: 700, color: highlight ? '#93c5fd' : '#64748b', marginLeft: 4 }}>{sub}</span>}
        </div>
      )}
    </div>
  );
}

export function StatsPanel({ avgItemsPerUnit, washMethodCount, totalCount, expectedTotal, processingRate, workOrders, onAvgChange, onWashCountChange }: Props) {
  const unprocessed = Math.max(0, expectedTotal - washMethodCount);

  // 작업지시 진행 현황 집계
  const activeOrders = workOrders.filter(wo => wo.count > 0);
  const doneCount   = activeOrders.filter(wo => calcProgress(wo) === 100).length;
  const inProgCount = activeOrders.filter(wo => { const p = calcProgress(wo); return p > 0 && p < 100; }).length;
  const notStarted  = activeOrders.filter(wo => calcProgress(wo) === 0).length;
  const totalActive = activeOrders.length;

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="section-header">
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f97316' }} />
        <h2>처리 통계</h2>
        {processingRate > 0 && (
          <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 800,
            color: processingRate >= 80 ? '#15803d' : processingRate >= 50 ? '#854d0e' : '#dc2626' }}>
            {processingRate >= 80 ? '✓ 목표 달성 예상' : processingRate >= 50 ? '▲ 진행 중' : '▼ 주의 필요'}
          </span>
        )}
      </div>

      {/* 작업지시 현황 가로 막대 차트 */}
      {totalActive > 0 && (
        <div style={{ padding: '12px 16px 8px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
            작업지시 현황 — 활성 {totalActive}개
          </div>
          {/* 스택 바 */}
          <div style={{ display: 'flex', height: 22, borderRadius: 6, overflow: 'hidden', gap: 2 }}>
            {doneCount > 0 && (
              <div title={`완료 ${doneCount}개`} style={{
                flex: doneCount, background: '#22c55e',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 800, color: '#fff',
                minWidth: 24, transition: 'flex 0.3s',
              }}>
                {doneCount}
              </div>
            )}
            {inProgCount > 0 && (
              <div title={`진행중 ${inProgCount}개`} style={{
                flex: inProgCount, background: '#f59e0b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 800, color: '#fff',
                minWidth: 24, transition: 'flex 0.3s',
              }}>
                {inProgCount}
              </div>
            )}
            {notStarted > 0 && (
              <div title={`미진행 ${notStarted}개`} style={{
                flex: notStarted, background: '#cbd5e1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 800, color: '#475569',
                minWidth: 24, transition: 'flex 0.3s',
              }}>
                {notStarted}
              </div>
            )}
          </div>
          {/* 범례 */}
          <div style={{ display: 'flex', gap: 12, marginTop: 5 }}>
            {doneCount > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#15803d', fontWeight: 700 }}>
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#22c55e' }} />
                완료 {doneCount}
              </span>
            )}
            {inProgCount > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#92400e', fontWeight: 700 }}>
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#f59e0b' }} />
                진행중 {inProgCount}
              </span>
            )}
            {notStarted > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#475569', fontWeight: 700 }}>
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#cbd5e1' }} />
                미진행 {notStarted}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 구분선 */}
      {totalActive > 0 && <div style={{ height: 1, background: '#e2e8f0', margin: '0 16px' }} />}

      {/* 상단: 입력 카드 + 예상처리율 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, padding: '12px 16px' }}>
        <StatCard label="건당 평균 개별수 (전주 동요일)" value={`${avgItemsPerUnit}`} sub="개/건"
          editable onEdit={onAvgChange} rawValue={avgItemsPerUnit || undefined} step="0.1" />
        <StatCard label="예상 전체 개별수" value={expectedTotal > 0 ? expectedTotal.toLocaleString() : '—'} sub="개" />
        <StatCard label="세탁방법 건수" value={`${washMethodCount}`} sub="건"
          editable onEdit={onWashCountChange} rawValue={washMethodCount || undefined} />
        <StatCard label="예상 처리율" value={processingRate > 0 ? `${processingRate}%` : '—'}
          accent={processingRate > 0 && processingRate < 60} highlight={processingRate >= 80} />
      </div>

      {/* 처리율 바 */}
      {processingRate > 0 && (
        <div style={{ padding: '0 16px 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>처리율 진행도</span>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
              {washMethodCount.toLocaleString()} / {expectedTotal.toLocaleString()} 개
            </span>
          </div>
          <div style={{ height: 14, background: '#e2e8f0', borderRadius: 7, overflow: 'hidden', position: 'relative' }}>
            <div style={{
              height: '100%', width: `${Math.min(100, processingRate)}%`,
              borderRadius: 7, transition: 'width 0.4s',
              background: processingRate >= 80
                ? 'linear-gradient(90deg,#22c55e,#16a34a)'
                : processingRate >= 50
                  ? 'linear-gradient(90deg,#eab308,#ca8a04)'
                  : 'linear-gradient(90deg,#f97316,#ea580c)',
            }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '60%', width: 2, background: 'rgba(0,0,0,0.2)' }} />
            <span style={{
              position: 'absolute', left: '61%', top: '50%', transform: 'translateY(-50%)',
              fontSize: 9, color: '#475569', fontWeight: 700,
            }}>목표60%</span>
          </div>
        </div>
      )}

      {/* 하단 핵심 수치 */}
      {totalCount > 0 && (
        <div style={{
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc', borderRadius: '0 0 12px 12px',
          display: 'grid',
          gridTemplateColumns: avgItemsPerUnit > 0 && washMethodCount > 0 && expectedTotal > 0 ? 'repeat(3,1fr)' : avgItemsPerUnit > 0 ? 'repeat(2,1fr)' : '1fr',
        }}>
          <div style={{ padding: '12px 16px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>총 투입 건수</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#1e293b', lineHeight: 1 }}>
              {totalCount.toLocaleString()}
              <span style={{ fontSize: 14, fontWeight: 700, color: '#64748b', marginLeft: 3 }}>건</span>
            </div>
          </div>
          {avgItemsPerUnit > 0 && (
            <div style={{ padding: '12px 16px', textAlign: 'center', borderRight: washMethodCount > 0 && expectedTotal > 0 ? '1px solid #e2e8f0' : undefined }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>예상 개별 총계</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#1e293b', lineHeight: 1 }}>
                {expectedTotal.toLocaleString()}
                <span style={{ fontSize: 14, fontWeight: 700, color: '#64748b', marginLeft: 3 }}>개</span>
              </div>
            </div>
          )}
          {washMethodCount > 0 && expectedTotal > 0 && (
            <div style={{ padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>미처리 예상</div>
              <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1, color: unprocessed > 0 ? '#dc2626' : '#15803d' }}>
                {unprocessed.toLocaleString()}
                <span style={{ fontSize: 14, fontWeight: 700, color: '#64748b', marginLeft: 3 }}>개</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
