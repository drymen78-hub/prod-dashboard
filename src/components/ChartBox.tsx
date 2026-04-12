import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js';
import type { ChartConfiguration } from 'chart.js';

interface Props {
  config: ChartConfiguration;
  height?: string;
}

export const ChartBox: React.FC<Props> = ({ config, height = '200px' }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    chartRef.current?.destroy();
    chartRef.current = new Chart(ref.current, config);
    return () => { chartRef.current?.destroy(); };
  }, [config]);

  return <canvas ref={ref} style={{ height, width: '100%' }} />;
};
