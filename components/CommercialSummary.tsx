'use client';

import { formatCurrency } from '@/lib/formatCurrency';

interface LineItem {
  productName: string;
  plan: string;
  quantity: number;
  tablePrice: number;
  discountPercent: number;
  discountAmount: number;
  promotionalPrice?: number;
  promotionalMonths: number;
  standardPriceAfterPromo?: number;
  billingType: string;
  metric?: string;
}

interface Props {
  lineItems: LineItem[];
}

const BILLING_LABELS: Record<string, string> = {
  monthly: 'Recorrente',
  yearly: 'Anual',
  'one-time': 'Implementação',
  consumption: 'Consumo',
  addon: 'Addon',
};

export default function CommercialSummary({ lineItems }: Props) {
  if (!lineItems || lineItems.length === 0) return null;

  let totalMonthlyTable = 0;
  let totalMonthlyPromo = 0;
  let totalMonthlyStandard = 0;
  let totalImplementation = 0;

  const rows = lineItems.map((li) => {
    const base = li.tablePrice * li.quantity;
    const promo = li.promotionalPrice ?? base - (li.discountAmount || 0);
    const standard = li.standardPriceAfterPromo ?? base;

    if (li.billingType === 'one-time') {
      totalImplementation += base;
    } else {
      totalMonthlyTable += base;
      totalMonthlyPromo += promo;
      totalMonthlyStandard += standard;
    }

    return { ...li, base, promo, standard };
  });

  const totalEconomy3 = (totalMonthlyTable - totalMonthlyPromo) * 3;
  const totalEconomy6 = (totalMonthlyTable - totalMonthlyPromo) * 6;
  const totalAnnual = totalMonthlyPromo * 3 + totalMonthlyStandard * 9 + totalImplementation;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <h3 className="font-bold text-gray-800">Resumo Comercial</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-800 text-white text-xs">
              <th className="px-4 py-3 text-left">Produto</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-right">Tabela</th>
              <th className="px-4 py-3 text-right">Desc.</th>
              <th className="px-4 py-3 text-right">Promocional</th>
              <th className="px-4 py-3 text-right">Padrão</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3">
                  <div className="font-medium">{row.productName}</div>
                  {row.quantity > 1 && <div className="text-xs text-gray-400">{row.quantity}× {formatCurrency(row.tablePrice)}</div>}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    row.billingType === 'one-time' ? 'bg-blue-100 text-blue-700' :
                    row.billingType === 'monthly' ? 'bg-green-100 text-green-700' :
                    row.billingType === 'addon' ? 'bg-purple-100 text-purple-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {BILLING_LABELS[row.billingType] || row.billingType}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(row.base)}</td>
                <td className="px-4 py-3 text-right text-red-500">
                  {row.discountPercent > 0 ? `-${row.discountPercent}%` : '—'}
                </td>
                <td className="px-4 py-3 text-right font-bold text-teal-700">
                  {formatCurrency(row.promo)}
                  {row.promotionalMonths > 0 && (
                    <div className="text-xs text-gray-400 font-normal">{row.promotionalMonths} meses</div>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-medium">{formatCurrency(row.standard)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-200 p-6 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {totalMonthlyPromo > 0 && (
            <div className="bg-teal-50 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">Mensalidade Promocional</div>
              <div className="text-xl font-bold text-teal-700">{formatCurrency(totalMonthlyPromo)}</div>
            </div>
          )}
          {totalMonthlyStandard > 0 && totalMonthlyStandard !== totalMonthlyPromo && (
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">Mensalidade Padrão</div>
              <div className="text-xl font-bold text-blue-700">{formatCurrency(totalMonthlyStandard)}</div>
            </div>
          )}
          {totalImplementation > 0 && (
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">Implementação</div>
              <div className="text-xl font-bold text-purple-700">{formatCurrency(totalImplementation)}</div>
            </div>
          )}
          {totalAnnual > 0 && (
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">Total 1º Ano</div>
              <div className="text-xl font-bold text-green-700">{formatCurrency(totalAnnual)}</div>
            </div>
          )}
        </div>

        {totalEconomy3 > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Economia gerada: <span className="font-bold text-green-600">{formatCurrency(totalEconomy3)}</span> nos primeiros 3 meses ·{' '}
            <span className="font-bold text-green-600">{formatCurrency(totalEconomy6)}</span> em 6 meses
          </div>
        )}
      </div>
    </div>
  );
}
