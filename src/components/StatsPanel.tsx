import { ProcessStatusMap } from '../types';
import { PROCESS_KEYS, PROCESS_LABELS } from '../constants';

interface Props {
  totalCount: number;
  avgItemsPerUnit: number;
  washMethodCount: number;
  expectedTotal: number;
  processingRate: number;
  processStatus: ProcessStatusMap;
  onTotalCountChange: (v: number) => void;
  onAvgChange: (v: number) => void;
  onWashCountChange: (v: number) => void;
}

interface CardProps {
  label: string; value: string; sub?: string;
  accent?: boolean; highlight?: boolean;
  editable?: boolean; onEdit?: (v: number) => void; rawValue?: number;
  step?: string;
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

export function StatsPanel({
  totalCount, avgItemsPerUnit, washMethodCount, expectedTotal, processingRate,
  processStatus, onTotalCountChange, onAvgChange, onWashCountChange,
}: Props) {
  const unprocessed = Math.max(0, expectedTotal - washMethodCount);

  // 공정별 완료/진행중/미진행 집계
  const processStats = PROCESS_KEYS.reduce(
    (acc, key) => {
      const { color, progress } = processStatus[key];
      if (!color) { acc.notStarted++; }
      else if (progress >= 100) { acc.done++; }
      else { acc.inProg++; }
      return acc;
    },
    { done: 0, inProg: 0, notStarted: 0 },
  );
  const totalProc = PROCESS_KEYS.length; // 4

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

      {/* 공정 진행 현황 가로 막대 차트 */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
          공정 현황 — {totalProc}개 공정 (
          {PROCESS_KEYS.map(key => {
            const { short } = PROCESS_LABELS[key];
            const { color, progress } = processStatus[key];
            if (!color) return null;
            return (
              <span key={key} style={{ marginLeft: 6, fontWeight: 800,
                color: progress >= 100 ? '#15803d' : '#92400e' }}>
                {short} {progress}%
              </span>
            );
          })}
          )
        </div>

        {/* 스택 바 */}
        <div style={{ display: 'flex', height: 22, borderRadius: 6, overflow: 'hidden', gap: 2 }}>
          {processStats.done > 0 && (
            <div title={`완료 ${processStats.done}개 공정`} style={{
              flex: processStats.done, background: '#22c55e',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: '#fff',
              transition: 'flex 0.3s',
            }}>
              {processStats.done}
            </div>
          )}
          {processStats.inProg > 0 && (
            <div title={`진행중 ${processStats.inProg}개 공정`} style={{
              flex: processStats.inProg, background: '#f59e0b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: '#fff',
              transition: 'flex 0.3s',
            }}>
              {processStats.inProg}
            </div>
          )}
          {processStats.notStarted > 0 && (
            <div title={`미진행 ${processStats.notStarted}개 공정`} style={{
              flex: processStats.notStarted, background: '#cbd5e1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: '#475569',
              transition: 'flex 0.3s',
            }}>
              {processStats.notStarted}
            </div>
          )}
          {/* 공정 데이터가 없을 때 빈 바 */}
          {processStats.done === 0 && processStats.inProg === 0 && processStats.notStarted === 0 && (
            <div style={{ flex: 1, background: '#e2e8f0', borderRadius: 6 }} />
          )}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 5, marginBottom: 12 }}>
          {processStats.done > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#15803d', fontWeight: 700 }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#22c55e' }} />
              완료 {processStats.done}
            </span>
          )}
          {processStats.inProg > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#92400e', fontWeight: 700 }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#f59e0b' }} />
              진행중 {processStats.inProg}
            </span>
          )}
          {processStats.notStarted > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#475569', fontWeight: 700 }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#cbd5e1' }} />
              미진행 {processStats.notStarted}
            </span>
          )}
        </div>
      </div>

      <div style={{ height: 1, background: '#e2e8f0', margin: '0 16px' }} />

      {/* 입력 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, padding: '12px 16px' }}>
        <StatCard label="총 투입 건수" value={`${totalCount}`} sub="건"
          editable onEdit={onTotalCountChange} rawValue={totalCount || undefined} />
        <StatCard label="건당 평균 개별수" value={`${avgItemsPerUnit}`} sub="개/건"
          editable onEdit={onAvgChange} rawValue={avgItemsPerUnit || undefined} step="0.1" />
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
          <div style={{ height: 20, background: '#e2e8f0', borderRadius: 7, overflow: 'hidden', position: 'relative', display: 'flex' }}>
            <div style={{
              height: '100%', width: `${Math.min(100, processingRate)}%`,
              borderRadius: 7, transition: 'width 0.4s',
              background: processingRate >= 80
                ? 'linear-gradient(90deg,#22c55e,#16a34a)'
                : processingRate >= 50
                  ? 'linear-gradient(90deg,#eab308,#ca8a04)'
                  : 'linear-gradient(90deg,#f97316,#ea580c)',
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8,
            }}>
              {processingRate >= 15 && (
                <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{processingRate}%</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 하단 요약 */}
      {totalCount > 0 && (
        <div style={{
          borderTop: '1px solid #e2e8f0', background: '#f8fafc',
          borderRadius: '0 0 12px 12px',
          display: 'grid',
          gridTemplateColumns: avgItemsPerUnit > 0 && washMethodCount > 0 && expectedTotal > 0
            ? 'repeat(3,1fr)' : avgItemsPerUnit > 0 ? 'repeat(2,1fr)' : '1fr',
        }}>
          <div style={{ padding: '12px 16px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>총 투입 건수</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#1e293b', lineHeight: 1 }}>
              {totalCount.toLocaleString()}
              <span style={{ fontSize: 14, fontWeight: 700, color: '#64748b', marginLeft: 3 }}>건</span>
            </div>
          </div>
          {avgItemsPerUnit > 0 && (
            <div style={{ padding: '12px 16px', textAlign: 'center',
              borderRight: washMethodCount > 0 && expectedTotal > 0 ? '1px solid #e2e8f0' : undefined }}>
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
