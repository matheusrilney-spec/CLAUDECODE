'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { Plus, X, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/formatCurrency';
import { useEffect, useState } from 'react';

interface PricingItem {
  id: string;
  productFamily: string;
  productCode: string;
  plan: string;
  currency: string;
  billingType: string;
  metric: string;
  tier?: number;
  price: number;
}

interface LineItem {
  productId: string;
  productName: string;
  productFamily: string;
  plan: string;
  metric: string;
  quantity: number;
  tablePrice: number;
  discountPercent: number;
  discountAmount: number;
  promotionalPrice?: number;
  promotionalMonths: number;
  standardPriceAfterPromo?: number;
  billingType: string;
  notes: string;
}

interface Props {
  onSubmit: (data: { lineItems: LineItem[] }) => void;
  initialData?: { lineItems: LineItem[] };
}

const BILLING_LABELS: Record<string, string> = {
  monthly: 'Recorrente Mensal',
  yearly: 'Anual',
  'one-time': 'Implementação (única vez)',
  consumption: 'Consumo',
  addon: 'Addon',
};

const PROMOTIONAL_RULES = [
  { label: '50% OFF por 3 meses', discountPercent: 50, months: 3 },
  { label: '50% OFF por 6 meses', discountPercent: 50, months: 6 },
  { label: 'R$ 1 por 1 mês', fixedPrice: 1, months: 1 },
  { label: '10% OFF anual', discountPercent: 10, months: 12 },
  { label: 'Personalizado', discountPercent: 0, months: 0 },
];

export default function ProductSelector({ onSubmit, initialData }: Props) {
  const [catalog, setCatalog] = useState<PricingItem[]>([]);
  const [families, setFamilies] = useState<string[]>([]);

  const form = useForm<{ lineItems: LineItem[] }>({
    defaultValues: initialData || {
      lineItems: [emptyItem()],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lineItems',
  });

  const lineItems = form.watch('lineItems');

  useEffect(() => {
    fetch('/data/pricingCatalog.json')
      .then((r) => r.json())
      .then((data: PricingItem[]) => {
        setCatalog(data);
        const fams = Array.from(new Set(data.map((d) => d.productFamily)));
        setFamilies(fams);
      })
      .catch(console.error);
  }, []);

  function emptyItem(): LineItem {
    return {
      productId: '',
      productName: '',
      productFamily: '',
      plan: '',
      metric: '',
      quantity: 1,
      tablePrice: 0,
      discountPercent: 0,
      discountAmount: 0,
      promotionalMonths: 0,
      billingType: 'monthly',
      notes: '',
    };
  }

  function getItemsForFamily(family: string) {
    return catalog.filter((c) => c.productFamily === family);
  }

  function handleProductChange(index: number, itemId: string) {
    const item = catalog.find((c) => c.id === itemId);
    if (!item) return;

    const label = item.tier ? `${item.productFamily} ${item.plan} - ${item.tier.toLocaleString('pt-BR')} ${item.metric}` : `${item.productFamily} ${item.plan}`;

    form.setValue(`lineItems.${index}.productId`, item.id);
    form.setValue(`lineItems.${index}.productName`, label);
    form.setValue(`lineItems.${index}.productFamily`, item.productFamily);
    form.setValue(`lineItems.${index}.plan`, item.plan);
    form.setValue(`lineItems.${index}.metric`, item.metric);
    form.setValue(`lineItems.${index}.tablePrice`, item.price);
    form.setValue(`lineItems.${index}.billingType`, item.billingType);
    form.setValue(`lineItems.${index}.standardPriceAfterPromo`, item.price);
    recalcDiscount(index, item.price, form.getValues(`lineItems.${index}.discountPercent`));
  }

  function recalcDiscount(index: number, price: number, discountPct: number) {
    const disc = (price * discountPct) / 100;
    form.setValue(`lineItems.${index}.discountAmount`, disc);
    form.setValue(`lineItems.${index}.promotionalPrice`, price - disc);
  }

  function applyRule(index: number, rule: typeof PROMOTIONAL_RULES[0]) {
    const price = form.getValues(`lineItems.${index}.tablePrice`);
    if (!price) return;

    if (rule.fixedPrice !== undefined) {
      form.setValue(`lineItems.${index}.promotionalPrice`, rule.fixedPrice);
      form.setValue(`lineItems.${index}.discountPercent`, 0);
      form.setValue(`lineItems.${index}.discountAmount`, price - rule.fixedPrice);
    } else if (rule.discountPercent) {
      form.setValue(`lineItems.${index}.discountPercent`, rule.discountPercent);
      recalcDiscount(index, price, rule.discountPercent);
    }
    form.setValue(`lineItems.${index}.promotionalMonths`, rule.months);
    form.setValue(`lineItems.${index}.standardPriceAfterPromo`, price);
  }

  function calcLineTotal(li: LineItem) {
    const base = li.tablePrice * li.quantity;
    const promo = li.promotionalPrice ?? base - (li.discountAmount || 0);
    return { base, promo };
  }

  const hasConversas = lineItems.some(
    (li) => li.productFamily?.includes('Conversas')
  );

  const totalMonthly = lineItems
    .filter((li) => li.billingType !== 'one-time')
    .reduce((s, li) => s + (li.promotionalPrice ?? li.tablePrice * li.quantity - (li.discountAmount || 0)), 0);

  const totalImpl = lineItems
    .filter((li) => li.billingType === 'one-time')
    .reduce((s, li) => s + li.tablePrice * li.quantity, 0);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {hasConversas && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800">
            <strong>RD Conversas selecionado:</strong> Lembre-se de informar ao cliente sobre as tarifas de mensageria da Meta (WhatsApp Business API), cobradas separadamente.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => {
          const li = lineItems[index] || emptyItem();
          const { base, promo } = calcLineTotal(li);

          return (
            <div key={field.id} className="bg-gray-50 rounded-xl border border-gray-200 p-5">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-800">Produto {index + 1}</h4>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Família do Produto</label>
                  <select
                    className="input-base text-sm"
                    onChange={(e) => {
                      form.setValue(`lineItems.${index}.productFamily`, e.target.value);
                      form.setValue(`lineItems.${index}.productId`, '');
                    }}
                    value={li.productFamily}
                  >
                    <option value="">Selecione a família</option>
                    {families.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Produto / Plano</label>
                  <select
                    className="input-base text-sm"
                    value={li.productId}
                    onChange={(e) => handleProductChange(index, e.target.value)}
                  >
                    <option value="">Selecione o produto</option>
                    {getItemsForFamily(li.productFamily).map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.plan}{item.tier ? ` — ${item.tier.toLocaleString('pt-BR')} ${item.metric}` : ''} · {formatCurrency(item.price)}
                      </option>
                    ))}
                  </select>
                  {!li.productId && (
                    <p className="text-xs text-orange-500 mt-1">Selecione um produto do catálogo</p>
                  )}
                  {li.productId && li.tablePrice <= 0 && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Preço não encontrado — revise antes de salvar
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de Cobrança</label>
                  <select {...form.register(`lineItems.${index}.billingType`)} className="input-base text-sm">
                    {Object.entries(BILLING_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Quantidade</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    {...form.register(`lineItems.${index}.quantity`, { valueAsNumber: true })}
                    className="input-base text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Valor Tabela (unitário)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...form.register(`lineItems.${index}.tablePrice`, {
                        valueAsNumber: true,
                        onChange: (e) => recalcDiscount(index, parseFloat(e.target.value) || 0, li.discountPercent),
                      })}
                      className="input-base text-sm pl-8"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Desconto %</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    {...form.register(`lineItems.${index}.discountPercent`, {
                      valueAsNumber: true,
                      onChange: (e) => recalcDiscount(index, li.tablePrice, parseFloat(e.target.value) || 0),
                    })}
                    className="input-base text-sm"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-600 mb-2">Condição Comercial Rápida</label>
                <div className="flex flex-wrap gap-2">
                  {PROMOTIONAL_RULES.map((rule) => (
                    <button
                      key={rule.label}
                      type="button"
                      onClick={() => applyRule(index, rule)}
                      className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-colors"
                    >
                      {rule.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Preço Promocional</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...form.register(`lineItems.${index}.promotionalPrice`, { valueAsNumber: true })}
                      className="input-base text-sm pl-8"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Meses de Promoção</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    {...form.register(`lineItems.${index}.promotionalMonths`, { valueAsNumber: true })}
                    className="input-base text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Valor Padrão Após Promoção</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...form.register(`lineItems.${index}.standardPriceAfterPromo`, { valueAsNumber: true })}
                      className="input-base text-sm pl-8"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Observações comerciais</label>
                <textarea
                  {...form.register(`lineItems.${index}.notes`)}
                  className="input-base text-sm resize-none"
                  rows={2}
                  placeholder="Ex: Inclui 3 horas de treinamento, suporte dedicado..."
                />
              </div>

              <div className="mt-3 flex gap-4 text-sm bg-white rounded-lg p-3 border border-gray-100">
                <div>
                  <span className="text-gray-500">Tabela: </span>
                  <span className="font-medium">{formatCurrency(base)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Promocional: </span>
                  <span className="font-medium text-teal-600">{formatCurrency(promo)}</span>
                </div>
                {li.promotionalMonths > 0 && (
                  <div>
                    <span className="text-gray-500">Após {li.promotionalMonths} meses: </span>
                    <span className="font-medium text-primary">{formatCurrency((li.standardPriceAfterPromo ?? base))}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => append(emptyItem())}
        className="btn-secondary inline-flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Adicionar Produto
      </button>

      {lineItems.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Resumo Comercial</h3>
          <div className="grid grid-cols-2 gap-4">
            {totalMonthly > 0 && (
              <div className="text-center bg-teal-50 rounded-lg p-4">
                <div className="text-sm text-gray-500">Mensalidade Promocional</div>
                <div className="text-2xl font-bold text-teal-700">{formatCurrency(totalMonthly)}</div>
              </div>
            )}
            {totalImpl > 0 && (
              <div className="text-center bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-500">Implementação</div>
                <div className="text-2xl font-bold text-blue-700">{formatCurrency(totalImpl)}</div>
              </div>
            )}
          </div>
        </div>
      )}

      <button type="submit" className="w-full btn-primary py-3 font-semibold">
        Continuar
      </button>
    </form>
  );
}
