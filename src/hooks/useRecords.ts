import { useState, useCallback } from 'react';
import type { DailySnapshot } from '../types';
import { STORAGE_KEYS } from '../constants';

function load(): DailySnapshot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SNAPSHOTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(records: DailySnapshot[]) {
  localStorage.setItem(STORAGE_KEYS.SNAPSHOTS, JSON.stringify(records));
}

export function useRecords() {
  const [snapshots, setSnapshots] = useState<DailySnapshot[]>(load);

  const upsert = useCallback((snap: DailySnapshot) => {
    setSnapshots(prev => {
      const next = prev.filter(r => r.date !== snap.date);
      next.push(snap);
      next.sort((a, b) => a.date.localeCompare(b.date));
      // 최근 30일만 보관
      const trimmed = next.slice(-30);
      save(trimmed);
      return trimmed;
    });
  }, []);

  return { snapshots, upsert };
}
