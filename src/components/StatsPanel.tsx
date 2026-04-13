interface Props {
  avgItemsPerUnit: number; washMethodCount: number; totalCount: number;
  expectedTotal: number; processingRate: number;
  onAvgChange: (v: number) => void; onWashCountChange: (v: number) => void;
}

interface CardProps {
  label: string; value: string; sub?: string;
  accent?: boolean; highlight?: boolean;
  editable?: boolean; onEdit?: (v: number) => void; rawValue?: number;
}

function StatCard({ label, value, sub, accent, highlight, editable, onEdit, rawValue }: CardProps) {
  return (
    <div style={{ background: highlight ? 'linear-gradient(135deg,#1e3a5f,#1a3050)' : '#f8fafc', border: `1px solid ${highlight ? '#2563eb' : '#e2e8f0'}`, borderRadius: 10, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: highlight ? '#93c5fd' : '#64748b', letterSpacing: 0.5, textTransform: 'uppercase' }}>{label}</div>
      {editable && onEdit ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input type="number" min={0} step="0.1" value={rawValue ?? ''} placeholder="0" onChange={e => onEdit(Number(e.target.value))}
            style={{ width: 70, border: 'none', borderBottom: '2px solid #2563eb', background: 'transparent', fontSize: 20, fontWeight: 800, color: highlight ? '#fff' : '#1e293b', padding: '2px 0', outline: 'none' }} />
          {sub && <span style={{ fontSize: 11, color: highlight ? '#93c5fd' : '#64748b', fontWeight: 600 }}>{sub}</span>}
        </div>
      ) : (
        <div style={{ fontSize: 22, fontWeight: 800, color: accent ? '#f97316' : highlight ? '#fff' : '#1e293b', letterSpacing: 0.5 }}>
          {value}
          {sub && <span style={{ fontSize: 12, fontWeight: 600, color: highlight ? '#93c5fd' : '#64748b', marginLeft: 4 }}>{sub}</span>}
        </div>
      )}
    </div>
  );
}

export function StatsPanel({ avgItemsPerUnit, washMethodCount, totalCount, expectedTotal, processingRate, onAvgChange, onWashCountChange }: Props) {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="section-header">
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f97316' }} />
        <h2>처리 통계</h2>
        {processingRate > 0 && (
          <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: processingRate >= 80 ? '#15803d' : processingRate >= 50 ? '#854d0e' : '#dc2626' }}>
            {processingRate >= 80 ? '✓ 목표 달성 예상' : processingRate >= 50 ? '▲ 진행 중' : '▼ 주의 필요'}
          </span>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, padding: '16px 18px' }}>
        <StatCard label="전주 동요일 건당 평균 개별수" value={avgItemsPerUnit > 0 ? `${avgItemsPerUnit}` : '—'} sub="건/개" editable onEdit={onAvgChange} rawValue={avgItemsPerUnit || undefined} />
        <StatCard label="예상 전체 개별수" value={expectedTotal > 0 ? expectedTotal.toLocaleString() : '—'} sub="개" />
        <StatCard label="세탁방법 건수" value={washMethodCount > 0 ? washMethodCount.toLocaleString() : '—'} sub="건" editable onEdit={onWashCountChange} rawValue={washMethodCount || undefined} />
        <StatCard label="예상 처리율" value={processingRate > 0 ? `${processingRate}%` : '—'} accent={processingRate > 0 && processingRate < 60} highlight={processingRate >= 80} />
      </div>
      {processingRate > 0 && (
        <div style={{ padding: '0 18px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>처리율 진행도</span>
            <span style={{ fontSize: 10, color: '#64748b' }}>{washMethodCount.toLocaleString()} / {expectedTotal.toLocaleString()} 개</span>
          </div>
          <div style={{ height: 12, background: '#e2e8f0', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
            <div style={{ height: '100%', width: `${Math.min(100, processingRate)}%`, borderRadius: 6, transition: 'width 0.4s',
              background: processingRate >= 80 ? 'linear-gradient(90deg,#22c55e,#16a34a)' : processingRate >= 50 ? 'linear-gradient(90deg,#eab308,#ca8a04)' : 'linear-gradient(90deg,#f97316,#ea580c)' }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '60%', width: 2, background: 'rgba(0,0,0,0.25)', borderRadius: 1 }} />
          </div>
          <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 2, textAlign: 'right' }}>↑ 60% 목표</div>
        </div>
      )}
      {totalCount > 0 && (
        <div style={{ borderTop: '1px solid #e2e8f0', padding: '10px 18px', background: '#f8fafc', borderRadius: '0 0 12px 12px', display: 'flex', gap: 24 }}>
          <div style={{ fontSize: 11, color: '#64748b' }}><span style={{ fontWeight: 600 }}>총 투입 건수:</span> <span style={{ fontWeight: 800, color: '#1e293b' }}>{totalCount.toLocaleString()}건</span></div>
          {avgItemsPerUnit > 0 && <div style={{ fontSize: 11, color: '#64748b' }}><span style={{ fontWeight: 600 }}>예상 개별 총계:</span> <span style={{ fontWeight: 800, color: '#1e293b' }}>{expectedTotal.toLocaleString()}개</span></div>}
          {washMethodCount > 0 && expectedTotal > 0 && <div style={{ fontSize: 11, color: '#64748b' }}><span style={{ fontWeight: 600 }}>미처리 예상:</span> <span style={{ fontWeight: 800, color: '#dc2626' }}>{Math.max(0, expectedTotal - washMethodCount).toLocaleString()}개</span></div>}
        </div>
      )}
    </div>
  );
}
