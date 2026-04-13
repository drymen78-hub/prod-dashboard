import React, { useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { useDashboard } from './hooks/useDashboard';
import { ShiftHeader } from './components/ShiftHeader';
import { StaffPanel } from './components/StaffPanel';
import { WorkOrderTable } from './components/WorkOrderTable';
import { StatsPanel } from './components/StatsPanel';
import { HandoverNotes } from './components/HandoverNotes';
import { StageField } from './constants';
import { ProcessStage, OrderColor } from './types';

export const App: React.FC = () => {
  const {
    state, set, updateStaff, updateWorkOrder, updateWorkOrderColor, handleReset,
    totalStaff, totalCount, expectedTotal, processingRate,
    saveRecord,
  } = useDashboard();

  const contentRef = useRef<HTMLDivElement>(null);

  const handleCapture = useCallback(async () => {
    const el = contentRef.current;
    if (!el) return;

    // 캡처 전 배경 잠깐 흰색으로 변경
    const prev = el.style.background;
    el.style.background = '#ffffff';

    const canvas = await html2canvas(el, {
      scale: 3,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      removeContainer: true,
    });

    el.style.background = prev;

    const link = document.createElement('a');
    link.download = `세탁인계_${state.date}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [state.date]);

  return (
    <div style={{ maxWidth: 1360, margin: '0 auto', fontFamily: "'Malgun Gothic', 'Segoe UI', Arial, sans-serif" }}>
      <ShiftHeader
        date={state.date}
        savedAt={state.savedAt}
        totalStaff={totalStaff}
        onDateChange={d => set('date', d)}
        onReset={handleReset}
        onCapture={handleCapture}
        onSave={saveRecord}
      />
      <div
        ref={contentRef}
        style={{ background: '#dde3ec', padding: '4px 0 6px', borderRadius: 8 }}
      >
        <StaffPanel staff={state.staff} totalStaff={totalStaff} onUpdate={updateStaff} />
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
          onAvgChange={v => set('avgItemsPerUnit', v)}
          onWashCountChange={v => set('washMethodCount', v)}
        />
        <HandoverNotes notes={state.notes} onChange={v => set('notes', v)} />
      </div>
      <div style={{ height: 20 }} />
    </div>
  );
};
