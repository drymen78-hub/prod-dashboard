import { ProcessStatusMap } from '../types';
import { PROCESS_KEYS, PROCESS_LABELS } from '../constants';

interface Props {
  totalCount: number;        // 총목표건수 (자동: workSequence 합산)
  avgItemsPerUnit: number;   // 전주 동요일 건당개별수
  washMethodCount: number;   // 야간 세탁분류건수
  expectedTotal: number;     // 예상 총출고 개별수 (자동)
  processingRate: number;    // 처리율 (자동)
  processStatus: ProcessStatusMap;
  onAvgChange: (v: number) => void;
  onWashCountChange: (v: number) => void;
}

export function StatsPanel({
  totalCount, avgItemsPerUnit, washMethodCount, expectedTotal, processingRate,
  processStatus, onAvgChange, onWashCountChange,
}: Props) {
  // 공정 완료/진행중/미진행 집계
  const stats = PROCESS_KEYS.reduce(
    (acc, key) => {
      const { color, progress } = processStatus[key];
      if (!color)            acc.notStarted++;
      else if (progress >= 100) acc.done++;
      else                   acc.inProg++;
      return acc;
    },
    { done: 0, inProg: 0, notStarted: 0 },
  );

  const progressBarColor =
    processingRate >= 80 ? 'linear-gradient(90deg,#22c55e,#16a34a)' :
    processingRate >= 50 ? 'linear-gradient(90deg,#eab308,#ca8a04)' :
                           'linear-gradient(90deg,#f97316,#ea580c)';

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="section-header">
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f97316' }} />
        <h2>처리 통계</h2>
        {processingRate > 0 && (
          <span style={{
            marginLeft: 'auto', fontSize: 12, fontWeight: 800,
            color: processingRate >= 80 ? '#15803d' : processingRate >= 50 ? '#854d0e' : '#dc2626',
          }}>
            {processingRate >= 80 ? '✓ 목표 달성 예상' : processingRate >= 50 ? '▲ 진행 중' : '▼ 주의 필요'}
          </span>
        )}
      </div>

      {/* 공정 현황 스택 바 */}
      <div style={{ padding: '10px 16px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
          공정 현황
          {PROCESS_KEYS.map(key => {
            const { short } = PROCESS_LABELS[key];
            const { color, progress } = processStatus[key];
            if (!color) return null;
            return (
              <span key={key} style={{ fontWeight: 800, color: progress >= 100 ? '#15803d' : '#92400e' }}>
                {short} {progress}%
              </span>
            );
          })}
        </div>
        <div style={{ display: 'flex', height: 22, borderRadius: 6, overflow: 'hidden', gap: 2 }}>
          {stats.done > 0 && (
            <div title={`완료 ${stats.done}개`} style={{
              flex: stats.done, background: '#22c55e',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: '#fff', transition: 'flex 0.3s',
            }}>{stats.done}</div>
          )}
          {stats.inProg > 0 && (
            <div title={`진행중 ${stats.inProg}개`} style={{
              flex: stats.inProg, background: '#f59e0b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: '#fff', transition: 'flex 0.3s',
            }}>{stats.inProg}</div>
          )}
          {stats.notStarted > 0 && (
            <div title={`미진행 ${stats.notStarted}개`} style={{
              flex: stats.notStarted, background: '#cbd5e1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: '#475569', transition: 'flex 0.3s',
            }}>{stats.notStarted}</div>
          )}
          {stats.done === 0 && stats.inProg === 0 && stats.notStarted === 0 && (
            <div style={{ flex: 1, background: '#e2e8f0', borderRadius: 6 }} />
          )}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 4, marginBottom: 10 }}>
          {stats.done > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#15803d', fontWeight: 700 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#22c55e', display: 'inline-block' }} />완료 {stats.done}</span>}
          {stats.inProg > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#92400e', fontWeight: 700 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#f59e0b', display: 'inline-block' }} />진행중 {stats.inProg}</span>}
          {stats.notStarted > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#475569', fontWeight: 700 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#cbd5e1', display: 'inline-block' }} />미진행 {stats.notStarted}</span>}
        </div>
      </div>

      <div style={{ height: 1, background: '#e2e8f0', margin: '0 16px' }} />

      {/* 처리율 계산 공식 표시 */}
      <div style={{ padding: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* 예상 총출고 */}
        <div style={{
          background: '#f8fafc', border: '1.5px solid #e2e8f0',
          borderRadius: 10, padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 3 }}>예상 총출고 개별수</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: expectedTotal > 0 ? '#1e293b' : '#d1d5db' }}>
              {expectedTotal > 0 ? expectedTotal.toLocaleString() : '—'}
              {expectedTotal > 0 && <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginLeft: 3 }}>개</span>}
            </div>
            {totalCount > 0 && avgItemsPerUnit > 0 && (
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>
                목표 {totalCount.toLocaleString()}건 × {avgItemsPerUnit}개/건
              </div>
            )}
          </div>

          {/* 전주 동요일 건당개별수 입력 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b' }}>전주 동요일 건당개별수</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="number" min={0} step={0.1}
                value={avgItemsPerUnit || ''}
                placeholder="0.0"
                onChange={e => onAvgChange(Number(e.target.value))}
                style={{
                  width: 70, height: 34, border: `1.5px solid ${avgItemsPerUnit > 0 ? '#2563eb88' : '#e2e8f0'}`,
                  borderRadius: 8, textAlign: 'center', fontSize: 16, fontWeight: 900,
                  color: '#1e293b', background: '#fff', outline: 'none',
                }}
              />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>개/건</span>
            </div>
          </div>
        </div>

        {/* 야간 처리 + 막대 그래프 */}
        <div style={{
          background: processingRate >= 80 ? '#f0fdf4' : processingRate >= 50 ? '#fefce8' : '#fff7ed',
          border: `1.5px solid ${processingRate >= 80 ? '#86efac' : processingRate >= 50 ? '#fde047' : '#fdba74'}`,
          borderRadius: 10, padding: '10px 14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8, flexWrap: 'wrap' }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 3 }}>야간 세탁분류건수</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input type="number" min={0}
                  value={washMethodCount || ''}
                  placeholder="0"
                  onChange={e => onWashCountChange(Number(e.target.value))}
                  style={{
                    width: 80, height: 34, border: `1.5px solid ${washMethodCount > 0 ? '#f9731688' : '#e2e8f0'}`,
                    borderRadius: 8, textAlign: 'center', fontSize: 16, fontWeight: 900,
                    color: '#1e293b', background: '#fff', outline: 'none',
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>개</span>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b' }}>처리율</span>
                <span style={{ fontSize: 12, fontWeight: 900, color: processingRate >= 80 ? '#15803d' : processingRate >= 50 ? '#854d0e' : '#dc2626' }}>
                  {processingRate > 0 ? `${processingRate}%` : '—'}
                </span>
              </div>
              <div style={{ height: 22, background: '#e2e8f0', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                {processingRate > 0 && (
                  <div style={{
                    height: '100%', width: `${Math.min(100, processingRate)}%`,
                    background: progressBarColor, borderRadius: 6, transition: 'width 0.4s',
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 6,
                  }}>
                    {processingRate >= 15 && (
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{processingRate}%</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {expectedTotal > 0 && washMethodCount > 0 && (
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
              처리율(%) = 야간처리 {washMethodCount.toLocaleString()}개 ÷ 예상총출고 {expectedTotal.toLocaleString()}개 × 100
            </div>
          )}
        </div>
      </div>

      <div style={{ height: 12 }} />
    </div>
  );
}
