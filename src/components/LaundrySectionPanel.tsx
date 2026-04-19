import { LaundryState } from '../types';
import { MACHINE_TOTALS } from '../constants';

interface Props {
  laundry: LaundryState;
  onUpdate: (field: keyof LaundryState, val: number) => void;
}

type MachineKey = keyof typeof MACHINE_TOTALS;

const WASHER_KEYS: MachineKey[]  = ['breakdown35kg', 'breakdown50kg'];
const DRYER_KEYS:  MachineKey[]  = ['breakdown2stage', 'breakdown60kg'];

function NumInput({
  value, onChange, unit, disabled,
}: {
  value: number; onChange: (v: number) => void; unit: string; disabled?: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <input
        type="number" min={0}
        value={value || ''}
        placeholder="0"
        disabled={disabled}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          width: 58, height: 32,
          border: `1.5px solid ${disabled ? '#e2e8f0' : '#94a3b8'}`,
          borderRadius: 6, textAlign: 'center',
          fontSize: 15, fontWeight: 900, color: '#1e293b',
          background: disabled ? '#f1f5f9' : '#fff', outline: 'none',
        }}
      />
      <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>{unit}</span>
    </div>
  );
}

function MachineRow({ machineKey, laundry, onUpdate }: {
  machineKey: MachineKey;
  laundry: LaundryState;
  onUpdate: (field: keyof LaundryState, val: number) => void;
}) {
  const { label, total } = MACHINE_TOTALS[machineKey];
  const broken = laundry[machineKey] || 0;
  const working = total - broken;
  const hasBroken = broken > 0;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 12px',
      background: hasBroken ? '#fef2f2' : '#f8fafc',
      border: `1.5px solid ${hasBroken ? '#fca5a5' : '#e2e8f0'}`,
      borderRadius: 8,
    }}>
      {/* 장비명 */}
      <div style={{ minWidth: 100, flexShrink: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: hasBroken ? '#dc2626' : '#475569' }}>
          {label}
        </div>
        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>
          총 {total}대 · 가동 {working}대
        </div>
      </div>

      {/* 고장 입력 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>고장</span>
        <NumInput
          value={broken}
          onChange={v => onUpdate(machineKey, Math.min(v, total))}
          unit="대"
        />
      </div>

      {/* 상태 배지 */}
      {hasBroken && (
        <span style={{
          marginLeft: 'auto', fontSize: 11, fontWeight: 800,
          background: '#fee2e2', color: '#dc2626',
          borderRadius: 20, padding: '2px 10px',
        }}>
          ⚠ {broken}대 고장
        </span>
      )}
      {!hasBroken && (
        <span style={{
          marginLeft: 'auto', fontSize: 11, fontWeight: 700,
          background: '#dcfce7', color: '#15803d',
          borderRadius: 20, padding: '2px 10px',
        }}>
          정상
        </span>
      )}
    </div>
  );
}

export function LaundrySectionPanel({ laundry, onUpdate }: Props) {
  const totalBroken =
    (laundry.breakdown35kg || 0) + (laundry.breakdown50kg || 0) +
    (laundry.breakdown2stage || 0) + (laundry.breakdown60kg || 0);

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="section-header">
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0891b2' }} />
        <h2>런드리파트</h2>
        {totalBroken > 0 && (
          <span style={{
            marginLeft: 10, fontSize: 11, fontWeight: 800,
            background: '#fee2e2', color: '#dc2626',
            borderRadius: 20, padding: '2px 10px',
          }}>
            장비 고장 {totalBroken}대
          </span>
        )}
      </div>

      <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* 인원 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          background: laundry.staff > 0 ? '#0891b20f' : '#f8fafc',
          border: `1.5px solid ${laundry.staff > 0 ? '#0891b244' : '#e2e8f0'}`,
          borderRadius: 10, padding: '12px 16px',
        }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: laundry.staff > 0 ? '#0e7490' : '#94a3b8', minWidth: 40 }}>
            👥 인원
          </span>
          <NumInput value={laundry.staff} onChange={v => onUpdate('staff', v)} unit="명" />
          {laundry.staff > 0 && (
            <span style={{ fontSize: 20, fontWeight: 900, color: '#0e7490', marginLeft: 4 }}>
              {laundry.staff}
              <span style={{ fontSize: 13, marginLeft: 2, fontWeight: 700 }}>명</span>
            </span>
          )}
        </div>

        {/* 작업 현황 */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', marginBottom: 8, paddingLeft: 2 }}>
            📦 작업 현황
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {/* 폴딩인계 건조 */}
            <div style={{
              background: laundry.foldingDryBox > 0 ? '#f0fdf4' : '#f8fafc',
              border: `1.5px solid ${laundry.foldingDryBox > 0 ? '#86efac' : '#e2e8f0'}`,
              borderRadius: 10, padding: '12px 14px',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>폴딩인계 건조</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <NumInput
                  value={laundry.foldingDryBox}
                  onChange={v => onUpdate('foldingDryBox', v)}
                  unit="box"
                />
                {laundry.foldingDryBox > 0 && (
                  <span style={{ fontSize: 22, fontWeight: 900, color: '#15803d' }}>
                    {laundry.foldingDryBox}
                    <span style={{ fontSize: 13, marginLeft: 2, fontWeight: 700, color: '#64748b' }}>box</span>
                  </span>
                )}
              </div>
            </div>

            {/* 리빙건조 완성 */}
            <div style={{
              background: laundry.livingDryRT > 0 ? '#eff6ff' : '#f8fafc',
              border: `1.5px solid ${laundry.livingDryRT > 0 ? '#93c5fd' : '#e2e8f0'}`,
              borderRadius: 10, padding: '12px 14px',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>리빙건조 완성</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <NumInput
                  value={laundry.livingDryRT}
                  onChange={v => onUpdate('livingDryRT', v)}
                  unit="RT"
                />
                {laundry.livingDryRT > 0 && (
                  <span style={{ fontSize: 22, fontWeight: 900, color: '#1d4ed8' }}>
                    {laundry.livingDryRT}
                    <span style={{ fontSize: 13, marginLeft: 2, fontWeight: 700, color: '#64748b' }}>RT</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 장비 현황 */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', marginBottom: 8, paddingLeft: 2 }}>
            ⚙️ 장비 현황
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* 세탁기 */}
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', paddingLeft: 4, marginBottom: 2 }}>
              세탁기
            </div>
            {WASHER_KEYS.map(k => (
              <MachineRow key={k} machineKey={k} laundry={laundry} onUpdate={onUpdate} />
            ))}
            {/* 건조기 */}
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', paddingLeft: 4, marginTop: 4, marginBottom: 2 }}>
              건조기
            </div>
            {DRYER_KEYS.map(k => (
              <MachineRow key={k} machineKey={k} laundry={laundry} onUpdate={onUpdate} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
