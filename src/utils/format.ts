export function formatPrice(value: number, currency?: string | null): string {
  const c = currency || 'CUP';
  const formatted = new Intl.NumberFormat('es-CU', {
    style: 'currency',
    currency: c,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: c === 'USD' ? 2 : 0,
  }).format(value);
  if (c !== 'CUP') return `${formatted} ${c}`;
  return formatted;
}
