import React from 'react';
import { useDashboard } from './hooks/useDashboard';
import { Header } from './components/Header';
import { SummaryBar } from './components/SummaryBar';
import { CleaningPanel } from './components/CleaningPanel';
import { LaundryPanel } from './components/LaundryPanel';

export const App: React.FC = () => {
  const {
    reportDate, setReportDate, dateLabel,
    cleaningTasks, updateCleaningTask,
    cleaningSharedHours, setCleaningSharedHours,
    cleaningTarget,      setCleaningTarget,
    laundryStaff, updateLaundryStaff,
    laundryTasks, updateLaundryTask,
    laundrySupportSent,     setLaundrySupportSent,
    laundrySupportReceived, setLaundrySupportReceived,
    laundryTarget, setLaundryTarget,
    cleaningTotals, laundryTotals,
    snapshots,
    saved, saveMsg, handleSave, handleReset,
    hasData,
  } = useDashboard();

  return (
    <div style={{ maxWidth: 1500, margin: '0 auto' }}>
      <Header
        month={dateLabel.month}
        day={dateLabel.day}
        reportDate={reportDate}
        onDateChange={setReportDate}
        hasData={hasData}
        saved={saved}
        saveMsg={saveMsg}
        onSave={handleSave}
        onReset={handleReset}
      />

      <SummaryBar
        cleaningTotals={cleaningTotals}
        laundryTotals={laundryTotals}
        hasData={hasData}
      />

      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <CleaningPanel
          tasks={cleaningTasks}
          onUpdate={updateCleaningTask}
          sharedHours={cleaningSharedHours}
          onSharedHoursChange={setCleaningSharedHours}
          targetOut={cleaningTarget}
          onTargetOutChange={setCleaningTarget}
          totals={cleaningTotals}
          snapshots={snapshots}
        />
        <LaundryPanel
          staff={laundryStaff}
          onStaffChange={updateLaundryStaff}
          tasks={laundryTasks}
          onUpdate={updateLaundryTask}
          supportSent={laundrySupportSent}
          onSupportSentChange={setLaundrySupportSent}
          supportReceived={laundrySupportReceived}
          onSupportReceivedChange={setLaundrySupportReceived}
          targetCustomers={laundryTarget}
          onTargetCustomersChange={setLaundryTarget}
          totals={laundryTotals}
          snapshots={snapshots}
        />
      </div>
    </div>
  );
};
