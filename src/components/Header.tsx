import React from 'react';
import { COLORS } from '../constants';

interface Props {
  month: string;
  day: string;
  reportDate: string;
  onDateChange: (d: string) => void;
  hasData: boolean;
  saved: boolean;
  saveMsg: string;
  onSave: () => void;
  onReset: () => void;
}

const Btn: React.FC<{
  onClick?: () => void;
  style?: React.CSSProperties;
  children: React.ReactNode;
  title?: string;
}> = ({ onClick, style, children, title }) => (
  <button onClick={onClick} title={title} style={{
    background: '#1e293b', border: '1px solid #334155',
    borderRadius: 6, color: '#94a3b8',
    padding: '5px 12px', fontSize: 12, fontWeight: 700,
    cursor: 'pointer', whiteSpace: 'nowrap',
    transition: 'all 0.15s',
    ...style,
  }}>{children}</button>
);

export const Header: React.FC<Props> = ({
  month, day, reportDate, onDateChange,
  hasData, saved, saveMsg, onSave, onReset,
}) => (
  <div style={{ marginBottom: 10 }}>
    {/* 시스템 타이틀 바 */}
    <div style={{
      background: '#0f172a', border: '1px solid #334155',
      borderRadius: '10px 10px 0 0', padding: '6px 16px',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: hasData ? '#4ade80' : '#475569',
        boxShadow: hasData ? '0 0 6px #4ade80' : 'none',
      }} />
      <span style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '0.08em' }}>
        야간책임운영실 · 야간세탁운영팀 · 업무마감 대시보드
      </span>
      {hasData && !saved && (
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#f97316', fontWeight: 700 }}>● 미저장</span>
      )}
      {saved && (
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#4ade80', fontWeight: 700 }}>● 저장됨</span>
      )}
    </div>

    {/* 메인 헤더 */}
    <div style={{
      background: '#1e293b', border: '1px solid #334155',
      borderTop: 'none', borderRadius: '0 0 10px 10px',
      padding: '10px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 8,
    }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
          <span style={{ color: COLORS.cleaning }}>{month}월 {day}일</span>
          <span style={{ color: '#94a3b8', fontSize: 15, fontWeight: 600, marginLeft: 8 }}>
            업무마감 현황
          </span>
        </h1>
        <div style={{ fontSize: 11, color: '#475569', marginTop: 3, fontWeight: 600 }}>
          개별클리닝파트 · 런드리파트
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="date"
          value={reportDate}
          onChange={e => onDateChange(e.target.value)}
          style={{
            background: '#0f172a', border: '1px solid #334155',
            borderRadius: 6, color: '#94a3b8',
            padding: '5px 10px', fontSize: 12, fontWeight: 600, outline: 'none',
          }}
        />
        {hasData && (
          <Btn
            onClick={onSave}
            style={{ background: '#1e3a5f', border: '1px solid #2563eb', color: COLORS.cleaning }}
          >
            💾 저장
          </Btn>
        )}
        {saveMsg && (
          <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.success }}>{saveMsg}</span>
        )}
        {hasData && (
          <Btn onClick={onReset} title="초기화">🔄</Btn>
        )}
      </div>
    </div>
  </div>
);
