import { ProcessStatusMap } from '../types';
import { PROCESS_KEYS, PROCESS_LABELS } from '../constants';

interface Props {
  totalCount: number;
  avgItemsPerUnit: number;
  washMethodCount: number;
  expectedTotal: number;
  processingRate: number;
  processStatus: ProcessStatusMap;
  onAvgChange: (v: number) => void;
  onWashCountChange: (v: number) => void;
}

export function StatsPanel({
  totalCount, avgItemsPerUnit, washMethodCount, expectedTotal, processingRate,
  processStatus, onAvgChange, onWashCountChange,
}: Props) {
  const rateColor =
    processingRate >= 80 ? '#15803d' :
    processingRate >= 50 ? '#854d0e' : '#dc2626';

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="section-header">
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f97316' }} />
        <h2>처리 통계</h2>
        {processingRate > 0 && (
          <span style={{ marginLeft: 'auto', fontSize: 15, fontWeight: 900, color: rateColor }}>
            {processingRate >= 80 ? '✓ 목표 달성 예상' : processingRate >= 50 ? '▲ 진행 중' : '▼ 주의 필요'}
          </span>
        )}
      </div>

      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* 공정 현황 텍스트 */}
        <div style={{
          background: '#f8fafc', border: '1.5px solid #e2e8f0',
          borderRadius: 10, padding: '12px 16px',
          display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
        }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#64748b' }}>공정 현황</span>
          {PROCESS_KEYS.map(key => {
            const { short } = PROCESS_LABELS[key];
            const { color, progress } = processStatus[key];
            if (!color) return (
              <span key={key} style={{ fontSize: 14, fontWeight: 700, color: '#cbd5e1' }}>
                {short} —
              </span>
            );
            return (
              <span key={key} style={{
                fontSize: 15, fontWeight: 900,
                color: progress >= 100 ? '#15803d' : '#92400e',
              }}>
                {short} {progress}%
              </span>
            );
          })}
        </div>

        {/* 예상 총출고 + 건당개별수 */}
        <div style={{
          background: '#f8fafc', border: '1.5px solid #e2e8f0',
          borderRadius: 10, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>예상 총출고 개별수</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: expectedTotal > 0 ? '#1e293b' : '#d1d5db' }}>
              {expectedTotal > 0 ? expectedTotal.toLocaleString() : '—'}
              {expectedTotal > 0 && <span style={{ fontSize: 15, fontWeight: 700, color: '#64748b', marginLeft: 4 }}>개</span>}
            </div>
            {totalCount > 0 && avgItemsPerUnit > 0 && (
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                목표 {totalCount.toLocaleString()}건 × {avgItemsPerUnit}개/건
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>전주 동요일 건당개별수</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="number" min={0} step={0.1}
                value={avgItemsPerUnit || ''}
                placeholder="0.0"
                onChange={e => onAvgChange(Number(e.target.value))}
                style={{
                  width: 80, height: 38, border: `1.5px solid ${avgItemsPerUnit > 0 ? '#2563eb88' : '#e2e8f0'}`,
                  borderRadius: 8, textAlign: 'center', fontSize: 18, fontWeight: 900,
                  color: '#1e293b', background: '#fff', outline: 'none',
                }}
              />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#64748b' }}>개/건</span>
            </div>
          </div>
        </div>

        {/* 야간 처리율 */}
        <div style={{
          background: processingRate >= 80 ? '#f0fdf4' : processingRate >= 50 ? '#fefce8' : '#fff7ed',
          border: `1.5px solid ${processingRate >= 80 ? '#86efac' : processingRate >= 50 ? '#fde047' : '#fdba74'}`,
          borderRadius: 10, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>야간 세탁분류건수</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="number" min={0}
                value={washMethodCount || ''}
                placeholder="0"
                onChange={e => onWashCountChange(Number(e.target.value))}
                style={{
                  width: 90, height: 38, border: `1.5px solid ${washMethodCount > 0 ? '#f9731688' : '#e2e8f0'}`,
                  borderRadius: 8, textAlign: 'center', fontSize: 18, fontWeight: 900,
                  color: '#1e293b', background: '#fff', outline: 'none',
                }}
              />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#64748b' }}>개</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>처리율</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: processingRate > 0 ? rateColor : '#d1d5db' }}>
              {processingRate > 0 ? `${processingRate}%` : '—'}
            </div>
            {expectedTotal > 0 && washMethodCount > 0 && (
              <div style={{ fontSize: 12, color: '#94a3b8' }}>
                {washMethodCount.toLocaleString()} ÷ {expectedTotal.toLocaleString()} × 100
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
