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
    background: '#1a2f50',
    border: '1px solid #3a5a90',
    borderRadius: 8,
    color: '#b8cfe8',
    padding: '7px 16px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s',
    ...style,
  }}>{children}</button>
);

export const Header: React.FC<Props> = ({
  month, day, reportDate, onDateChange,
  hasData, saved, saveMsg, onSave, onReset,
}) => (
  <div style={{ marginBottom: 12 }}>
    {/* 시스템 타이틀 바 */}
    <div style={{
      background: '#0f1e32',
      border: '1px solid #2e4a7a',
      borderRadius: '12px 12px 0 0',
      padding: '7px 18px',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 9, height: 9, borderRadius: '50%',
        background: hasData ? '#4ade80' : '#3b5998',
        boxShadow: hasData ? '0 0 8px #4ade80' : 'none',
      }} />
      <span style={{ fontSize: 12, fontWeight: 700, color: '#7a9cc0', letterSpacing: '0.06em' }}>
        야간책임운영실 · 야간세탁운영팀 · 업무마감 대시보드
      </span>
      {hasData && !saved && (
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#fb923c', fontWeight: 800 }}>● 미저장</span>
      )}
      {saved && (
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#4ade80', fontWeight: 800 }}>● 저장됨</span>
      )}
    </div>

    {/* 메인 헤더 */}
    <div style={{
      background: '#1a2f50',
      border: '1px solid #2e4a7a',
      borderTop: 'none',
      borderRadius: '0 0 12px 12px',
      padding: '14px 18px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 10,
    }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0, lineHeight: 1.2, color: '#f0f6ff' }}>
          <span style={{ color: COLORS.cleaning }}>{month}월 {day}일</span>
          <span style={{ color: '#b8cfe8', fontSize: 18, fontWeight: 700, marginLeft: 10 }}>
            업무마감 현황
          </span>
        </h1>
        <div style={{ fontSize: 13, color: '#7a9cc0', marginTop: 4, fontWeight: 600 }}>
          개별클리닝파트 · 런드리파트
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="date"
          value={reportDate}
          onChange={e => onDateChange(e.target.value)}
          style={{
            background: '#0f1e32',
            border: '1px solid #3a5a90',
            borderRadius: 8,
            color: '#b8cfe8',
            padding: '7px 12px',
            fontSize: 14,
            fontWeight: 600,
            outline: 'none',
          }}
        />
        {hasData && (
          <Btn
            onClick={onSave}
            style={{ background: '#1e3a5f', border: '1px solid #3b82f6', color: '#93c5fd' }}
          >
            💾 저장
          </Btn>
        )}
        {saveMsg && (
          <span style={{ fontSize: 14, fontWeight: 800, color: COLORS.success }}>{saveMsg}</span>
        )}
        {hasData && (
          <Btn onClick={onReset} title="초기화" style={{ padding: '7px 12px', fontWeight: 600 }}>🔄 초기화</Btn>
        )}
      </div>
    </div>
  </div>
);
