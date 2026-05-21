export function formatCurrency(value: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9,-]/g, '').replace('.', '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}
