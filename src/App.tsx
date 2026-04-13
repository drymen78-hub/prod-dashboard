import React from 'react';
import { useDashboard } from './hooks/useDashboard';
import { ShiftHeader } from './components/ShiftHeader';
import { StaffPanel } from './components/StaffPanel';
import { WorkOrderTable } from './components/WorkOrderTable';
import { StatsPanel } from './components/StatsPanel';
import { HandoverNotes } from './components/HandoverNotes';
import { StageField } from './constants';
import { ProcessStage } from './types';

export const App: React.FC = () => {
  const {
    state, set, updateStaff, updateWorkOrder, handleReset,
    totalStaff, totalCount, expectedTotal, processingRate,
  } = useDashboard();

  return (
    <div style={{ maxWidth: 1020, margin: '0 auto', fontFamily: "'Malgun Gothic', 'Segoe UI', Arial, sans-serif" }}>
      <ShiftHeader
        date={state.date}
        savedAt={state.savedAt}
        totalStaff={totalStaff}
        onDateChange={d => set('date', d)}
        onReset={handleReset}
      />
      <StaffPanel staff={state.staff} totalStaff={totalStaff} onUpdate={updateStaff} />
      <WorkOrderTable
        workOrders={state.workOrders}
        totalCount={totalCount}
        onCountChange={(id, count) => updateWorkOrder(id, 'count', count)}
        onStageChange={(id: string, field: StageField, stage: ProcessStage) => updateWorkOrder(id, field, stage)}
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
      <div style={{ height: 32 }} />
    </div>
  );
};
