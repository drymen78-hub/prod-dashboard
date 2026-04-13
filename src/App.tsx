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
    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    });
    const link = document.createElement('a');
    link.download = `세탁인계_${state.date}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [state.date]);

  return (
    <div style={{ maxWidth: 1020, margin: '0 auto', fontFamily: "'Malgun Gothic', 'Segoe UI', Arial, sans-serif" }}>
      <ShiftHeader
        date={state.date}
        savedAt={state.savedAt}
        totalStaff={totalStaff}
        onDateChange={d => set('date', d)}
        onReset={handleReset}
        onCapture={handleCapture}
        onSave={saveRecord}
      />
      <div ref={contentRef} style={{ background: '#e8edf2', padding: '4px 0 8px' }}>
        <StaffPanel staff={state.staff} totalStaff={totalStaff} onUpdate={updateStaff} />
        <WorkOrderTable
          workOrders={state.workOrders}
          totalCount={totalCount}
          onCountChange={(id, count) => updateWorkOrder(id, 'count', count)}
          onStageChange={(id: string, field: StageField, stage: ProcessStage) => updateWorkOrder(id, field, stage)}
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
      <div style={{ height: 32 }} />
    </div>
  );
};
