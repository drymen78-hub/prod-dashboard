export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function n(v: number | string): number {
  const val = typeof v === 'string' ? parseFloat(v) : v;
  return isNaN(val) ? 0 : val;
}
