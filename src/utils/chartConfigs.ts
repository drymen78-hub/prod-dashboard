import {
  Chart,
  BarController, LineController,
  BarElement, LineElement, PointElement,
  CategoryScale, LinearScale,
  Tooltip, Legend,
  ArcElement, DoughnutController,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { ChartConfiguration } from 'chart.js';

Chart.register(
  BarController, LineController,
  BarElement, LineElement, PointElement,
  CategoryScale, LinearScale,
  Tooltip, Legend, ChartDataLabels,
  ArcElement, DoughnutController,
);

const GRID = 'rgba(51,65,85,0.5)';
const TICK = '#64748b';

type DatalabelCtx = { datasetIndex: number; chart: { data: { datasets: { data: number[] }[] } } };

// ── 업무별 생산량 + 시간당 생산량 혼합 ──────────────────────
export function createProductionChartConfig(
  labels: string[],
  counts: number[],
  perHours: number[],
  colors: string[],
  _unit: string,
): ChartConfiguration {
  const maxCount = Math.max(...counts, 1);
  return {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          type: 'bar',
          label: '생산량',
          data: counts,
          backgroundColor: colors.map(c => c + '99'),
          borderColor: colors,
          borderWidth: 1,
          borderRadius: 4,
          yAxisID: 'y',
        } as object,
        {
          type: 'line',
          label: '시간당 생산량',
          data: perHours,
          borderColor: '#fbbf24',
          backgroundColor: '#fbbf2440',
          borderWidth: 2,
          pointBackgroundColor: '#fbbf24',
          pointRadius: 4,
          tension: 0.3,
          yAxisID: 'y2',
        } as object,
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        datalabels: {
          color: '#94a3b8',
          font: { size: 10, weight: 'bold' },
          anchor: 'end',
          align: 'top',
          formatter: (v: number, ctx: DatalabelCtx) => {
            if (ctx.datasetIndex === 0) return v > 0 ? v.toLocaleString() : '';
            return '';
          },
        },
      },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 } } },
        y: {
          grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 } },
          max: Math.ceil(maxCount * 1.25),
        },
        y2: {
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { color: '#fbbf24', font: { size: 10 } },
          title: { display: true, text: '/h', color: '#fbbf24', font: { size: 9 } },
        },
      },
    },
    plugins: [ChartDataLabels],
  } as unknown as ChartConfiguration;
}

// ── 투입시간 도넛 ────────────────────────────────────────────
export function createHoursDoughnutConfig(
  labels: string[],
  hours: number[],
  colors: string[],
): ChartConfiguration {
  return {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: hours,
        backgroundColor: colors.map(c => c + 'cc'),
        borderColor: colors,
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#94a3b8', font: { size: 10 }, boxWidth: 10, padding: 6 },
        },
        datalabels: {
          color: '#f1f5f9',
          font: { size: 10, weight: 'bold' },
          formatter: (v: number, ctx: DatalabelCtx) => {
            const total = (ctx.chart.data.datasets[0].data as number[]).reduce((a, b) => a + b, 0);
            const pct = total > 0 ? Math.round(v / total * 100) : 0;
            return pct >= 5 ? `${pct}%` : '';
          },
        },
        tooltip: {
          callbacks: {
            label: (ctx: { label: string; parsed: number }) => ` ${ctx.label}: ${ctx.parsed}h`,
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  } as unknown as ChartConfiguration;
}

// ── 효율 비교 수평 막대 ──────────────────────────────────────
export function createEfficiencyChartConfig(
  labels: string[],
  efficiencies: number[],
  colors: string[],
): ChartConfiguration {
  return {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: '인시당 생산량',
        data: efficiencies,
        backgroundColor: colors.map(c => c + '99'),
        borderColor: colors,
        borderWidth: 1,
        borderRadius: 4,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        datalabels: {
          color: '#f1f5f9',
          font: { size: 11, weight: 'bold' },
          anchor: 'end',
          align: 'right',
          formatter: (v: number) => v > 0 ? v.toLocaleString() : '',
        },
      },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 } } },
        y: { grid: { display: false }, ticks: { color: '#e2e8f0', font: { size: 11, weight: 'bold' } } },
      },
    },
    plugins: [ChartDataLabels],
  } as unknown as ChartConfiguration;
}

// ── 일별 생산성 추이 (SPC 포함) ─────────────────────────────
export function createTrendChartConfig(
  labels: string[],
  efficiencies: number[],
  color: string,
): ChartConfiguration {
  const mean  = efficiencies.length > 0
    ? efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length : 0;
  const sigma = efficiencies.length >= 3
    ? Math.sqrt(efficiencies.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / efficiencies.length) : 0;
  const ucl   = sigma > 0 ? +(mean + 3 * sigma).toFixed(1) : null;

  const datasets: object[] = [
    {
      type: 'line',
      label: '인시당 생산량',
      data: efficiencies,
      borderColor: color,
      backgroundColor: color + '20',
      borderWidth: 2,
      pointBackgroundColor: efficiencies.map(v => ucl && v > ucl ? '#f87171' : color),
      pointRadius: 5,
      fill: true,
      tension: 0.3,
    },
    {
      type: 'line',
      label: `평균 (${+mean.toFixed(1)})`,
      data: Array(labels.length).fill(+mean.toFixed(1)),
      borderColor: '#94a3b850',
      borderWidth: 1,
      borderDash: [4, 4],
      pointRadius: 0,
      tension: 0,
    },
  ];

  if (ucl) {
    datasets.push({
      type: 'line',
      label: `UCL (${ucl})`,
      data: Array(labels.length).fill(ucl),
      borderColor: '#f9731680',
      borderWidth: 1,
      borderDash: [6, 3],
      pointRadius: 0,
      tension: 0,
    });
  }

  return {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#94a3b8', font: { size: 10 }, boxWidth: 12, padding: 8 },
        },
        datalabels: { display: false },
      },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 } } },
        y: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 } } },
      },
    },
    plugins: [ChartDataLabels],
  } as unknown as ChartConfiguration;
}
