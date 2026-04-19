import React, { useRef, useCallback, useState } from 'react';
import html2canvas from 'html2canvas';
import { useDashboard } from './hooks/useDashboard';
import { ShiftHeader } from './components/ShiftHeader';
import { DashboardBanner } from './components/DashboardBanner';
import { KpiRibbon } from './components/KpiRibbon';
import { StaffPanel } from './components/StaffPanel';
import { WorkOrderSection } from './components/WorkOrderSection';
import { StatsPanel } from './components/StatsPanel';
import { KickerPanel } from './components/KickerPanel';
import { LaundrySectionPanel } from './components/LaundrySectionPanel';
import { HandoverNotes } from './components/HandoverNotes';
import { saveToSheets } from './utils/saveToSheets';
import { ProcessKey, ProcessStatus } from './types';

type ToastType = 'success' | 'error' | 'loading';
interface Toast { msg: string; type: ToastType }

export const App: React.FC = () => {
  const {
    state, set, updateStaff,
    updateWorkSequence, updateWorkSequenceCount,
    updateProcessStatus, updateIntensiveCareColors,
    updateNote, updateLaundry, updateKicker, handleReset,
    totalStaff, totalCount, expectedTotal, processingRate,
  } = useDashboard();

  const contentRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [editMode, setEditMode] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string, type: ToastType, duration = 3000) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, type });
    if (type !== 'loading') {
      toastTimer.current = setTimeout(() => setToast(null), duration);
    }
  }, []);

  const handleCapture = useCallback(async () => {
    showToast('Google Sheets에 저장 중…', 'loading');
    try {
      await saveToSheets(state, totalStaff, processingRate);
      showToast('✓ 저장 완료, 캡처 중…', 'success', 1500);
    } catch {
      showToast('Sheets 저장 실패 — 캡처만 진행합니다', 'error', 2000);
    }
    await new Promise(r => setTimeout(r, 600));
    const el = contentRef.current;
    if (!el) return;
    const prev = el.style.background;
    el.style.background = '#ffffff';
    const canvas = await html2canvas(el, {
      scale: 3, backgroundColor: '#ffffff', useCORS: true, logging: false, removeContainer: true,
    });
    el.style.background = prev;
    const link = document.createElement('a');
    link.download = `세탁인계_${state.date}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('✓ 캡처 완료', 'success');
  }, [state, totalStaff, processingRate, showToast]);

  const toastBg: Record<ToastType, string> = {
    success: '#059669', error: '#dc2626', loading: '#1e3a5f',
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', fontFamily: "'Pretendard', -apple-system, 'Malgun Gothic', sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          background: toastBg[toast.type], color: '#fff',
          borderRadius: 12, padding: '12px 28px',
          fontSize: 14, fontWeight: 700, zIndex: 9999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
        }}>
          {toast.type === 'loading' && (
            <span style={{
              display: 'inline-block', width: 14, height: 14,
              border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff',
              borderRadius: '50%', animation: 'spin 0.7s linear infinite',
            }} />
          )}
          {toast.msg}
        </div>
      )}

      {/* 컨트롤 바 (캡처 제외) */}
      <ShiftHeader
        date={state.date}
        editMode={editMode}
        onDateChange={d => set('date', d)}
        onReset={handleReset}
        onCapture={handleCapture}
        onEditToggle={() => setEditMode(m => !m)}
      />

      {/* 캡처 영역 */}
      <div
        ref={contentRef}
        style={{ background: '#f0f2f5', padding: '14px 14px 16px', borderRadius: 10 }}
      >
        {/* 비주얼 헤더 */}
        <DashboardBanner date={state.date} savedAt={state.savedAt} />

        {/* KPI 리본 */}
        <KpiRibbon
          processingRate={processingRate}
          washMethodCount={state.washMethodCount}
          expectedTotal={expectedTotal}
          totalCount={totalCount}
          targetCount={state.targetCount}
          totalStaff={totalStaff}
          staffCounts={state.staff}
          kickers={state.kickers}
        />

        {/* 2컬럼 메인 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 12 }}>

          {/* ── 좌: 공정별 진행률 + 품질 체크 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <WorkOrderSection
              workSequence={state.workSequence}
              workSequenceCounts={state.workSequenceCounts}
              intensiveCareColors={state.intensiveCareColors}
              editMode={editMode}
              onSequenceChange={updateWorkSequence}
              onSequenceCountChange={updateWorkSequenceCount}
              onIntensiveCareChange={updateIntensiveCareColors}
            />
            <StatsPanel
              processStatus={state.processStatus}
              avgItemsPerUnit={state.avgItemsPerUnit}
              washMethodCount={state.washMethodCount}
              totalCount={totalCount}
              expectedTotal={expectedTotal}
              processingRate={processingRate}
              editMode={editMode}
              onProcessStatusChange={(key: ProcessKey, status: ProcessStatus) => updateProcessStatus(key, status)}
              onAvgChange={v => set('avgItemsPerUnit', v)}
              onWashCountChange={v => set('washMethodCount', v)}
            />
          </div>

          {/* ── 우: 인원 + 키커 + 런드리 + 메모 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <StaffPanel
              staff={state.staff}
              totalStaff={totalStaff}
              editMode={editMode}
              onUpdate={updateStaff}
            />
            <KickerPanel
              kickers={state.kickers}
              editMode={editMode}
              onUpdate={updateKicker}
            />
            <LaundrySectionPanel
              laundry={state.laundry}
              editMode={editMode}
              onUpdate={updateLaundry}
            />
            <HandoverNotes
              notes={state.notes}
              editMode={editMode}
              onUpdate={updateNote}
            />
          </div>

        </div>
      </div>

      <div style={{ height: 20 }} />
    </div>
  );
};
