import React, { useRef, useCallback, useState } from 'react';
import html2canvas from 'html2canvas';
import { useDashboard } from './hooks/useDashboard';
import { ShiftHeader } from './components/ShiftHeader';
import { StaffPanel } from './components/StaffPanel';
import { WorkOrderTable } from './components/WorkOrderTable';
import { StatsPanel } from './components/StatsPanel';
import { HandoverNotes } from './components/HandoverNotes';
import { KickerPanel } from './components/KickerPanel';
import { StageField } from './constants';
import { ProcessStage, OrderColor } from './types';
import { saveToSheets } from './utils/saveToSheets';

type ToastType = 'success' | 'error' | 'loading';
interface Toast { msg: string; type: ToastType }

export const App: React.FC = () => {
  const {
    state, set, updateStaff, updateWorkOrder, updateWorkOrderColor,
    updateNote, updateKicker, handleReset,
    totalStaff, totalCount, expectedTotal, processingRate,
    saveRecord,
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
  }, [state.date]);

  const handleSaveSheets = useCallback(async () => {
    showToast('Google Sheets에 저장 중…', 'loading');
    try {
      await saveToSheets(state, totalStaff, processingRate);
      showToast('✓ Google Sheets 저장 완료', 'success');
    } catch (e) {
      showToast(`저장 실패: ${e instanceof Error ? e.message : '알 수 없는 오류'}`, 'error', 5000);
    }
  }, [state, totalStaff, processingRate, showToast]);

  const toastBg: Record<ToastType, string> = {
    success: '#059669', error: '#dc2626', loading: '#1e3a5f',
  };

  return (
    <div style={{ maxWidth: 1360, margin: '0 auto', fontFamily: "'Malgun Gothic', 'Segoe UI', Arial, sans-serif" }}>
      {/* 토스트 알림 */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          background: toastBg[toast.type], color: '#fff',
          borderRadius: 12, padding: '12px 28px',
          fontSize: 14, fontWeight: 700, zIndex: 9999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', gap: 8,
          animation: 'fadeInUp 0.2s ease',
          whiteSpace: 'nowrap',
        }}>
          {toast.type === 'loading' && (
            <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          )}
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <ShiftHeader
        date={state.date}
        savedAt={state.savedAt}
        totalStaff={totalStaff}
        onDateChange={d => set('date', d)}
        onReset={handleReset}
        onCapture={handleCapture}
        onSave={saveRecord}
        onSaveSheets={handleSaveSheets}
      />
      <div
        ref={contentRef}
        style={{ background: '#dde3ec', padding: '4px 0 6px', borderRadius: 8 }}
      >
        <StaffPanel
          staff={state.staff}
          totalStaff={totalStaff}
          targetCount={state.targetCount}
          workHours={state.workHours}
          onUpdate={updateStaff}
          onTargetChange={v => set('targetCount', v)}
          onWorkHoursChange={v => set('workHours', v)}
        />
        <WorkOrderTable
          workOrders={state.workOrders}
          totalCount={totalCount}
          onCountChange={(id, count) => updateWorkOrder(id, 'count', count)}
          onStageChange={(id: string, field: StageField, stage: ProcessStage) =>
            updateWorkOrder(id, field, stage)
          }
          onColorChange={(id: string, color: OrderColor) => updateWorkOrderColor(id, color)}
        />
        <StatsPanel
          avgItemsPerUnit={state.avgItemsPerUnit}
          washMethodCount={state.washMethodCount}
          totalCount={totalCount}
          expectedTotal={expectedTotal}
          processingRate={processingRate}
          workOrders={state.workOrders}
          onAvgChange={v => set('avgItemsPerUnit', v)}
          onWashCountChange={v => set('washMethodCount', v)}
        />
        <KickerPanel kickers={state.kickers} onUpdate={updateKicker} />
        <HandoverNotes notes={state.notes} onUpdate={updateNote} />
      </div>
      <div style={{ height: 20 }} />
    </div>
  );
};
