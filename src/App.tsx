import React, { useRef, useCallback, useState } from 'react';
import html2canvas from 'html2canvas';
import { useDashboard } from './hooks/useDashboard';
import { ShiftHeader } from './components/ShiftHeader';
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

function SectionLabel({ emoji, title, color }: { emoji: string; title: string; color: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 16px', marginBottom: 4,
      background: color, borderRadius: 8,
    }}>
      <span style={{ fontSize: 16 }}>{emoji}</span>
      <span style={{ fontSize: 14, fontWeight: 900, color: '#fff', letterSpacing: 0.5 }}>{title}</span>
    </div>
  );
}

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
    <div style={{ maxWidth: 1360, margin: '0 auto', fontFamily: "'Malgun Gothic', 'Segoe UI', Arial, sans-serif" }}>
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
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* 1. 헤더 */}
      <ShiftHeader
        date={state.date} savedAt={state.savedAt}
        onDateChange={d => set('date', d)}
        onReset={handleReset} onCapture={handleCapture}
      />

      <div ref={contentRef} style={{ background: '#dde3ec', padding: '8px 8px 10px', borderRadius: 8 }}>

        {/* 2. 개별클리닝파트 */}
        <SectionLabel emoji="🧪" title="개별클리닝파트" color="#1e3a5f" />
        <StaffPanel
          staff={state.staff} totalStaff={totalStaff}
          targetCount={state.targetCount} workHours={state.workHours}
          onUpdate={updateStaff}
          onTargetChange={v => set('targetCount', v)}
          onWorkHoursChange={v => set('workHours', v)}
        />
        <WorkOrderSection
          workSequence={state.workSequence}
          workSequenceCounts={state.workSequenceCounts}
          processStatus={state.processStatus}
          intensiveCareColors={state.intensiveCareColors}
          onSequenceChange={updateWorkSequence}
          onSequenceCountChange={updateWorkSequenceCount}
          onProcessStatusChange={(key: ProcessKey, status: ProcessStatus) => updateProcessStatus(key, status)}
          onIntensiveCareChange={updateIntensiveCareColors}
        />
        <StatsPanel
          totalCount={totalCount}
          avgItemsPerUnit={state.avgItemsPerUnit}
          washMethodCount={state.washMethodCount}
          expectedTotal={expectedTotal}
          processingRate={processingRate}
          processStatus={state.processStatus}
          onAvgChange={v => set('avgItemsPerUnit', v)}
          onWashCountChange={v => set('washMethodCount', v)}
        />
        <KickerPanel kickers={state.kickers} onUpdate={updateKicker} />

        {/* 3. 런드리파트 */}
        <SectionLabel emoji="🧺" title="런드리파트" color="#0e7490" />
        <LaundrySectionPanel laundry={state.laundry} onUpdate={updateLaundry} />

        {/* 4. 인수인계 메모 (공통) */}
        <SectionLabel emoji="💬" title="인수인계 메모 (공통)" color="#6d28d9" />
        <HandoverNotes notes={state.notes} onUpdate={updateNote} />
      </div>

      <div style={{ height: 20 }} />
    </div>
  );
};
