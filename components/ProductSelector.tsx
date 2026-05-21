'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { Plus, X, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/formatCurrency';

const SAMPLE_PRODUCTS = [
  { id: 'rdsm-pro', name: 'RD Station Marketing Pro', price: 1121, metric: 'leads' },
  { id: 'rdcrm-std', name: 'RD Station CRM Standard', price: 890, metric: 'usuarios' },
  { id: 'rdconv-starter', name: 'RD Conversas Starter', price: 206, metric: 'atendimentos' },
];

export default function ProductSelector({ onSubmit, initialData }: any) {
  const form = useForm({
    defaultValues: initialData || {
      lineItems: [{
        productId: '',
        productName: '',
        plan: '',
        metric: '',
        quantity: 1,
        tablePrice: 0,
        discountPercent: 0,
        discountAmount: 0,
        billingType: 'monthly',
        notes: '',
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lineItems',
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Produtos Selecionados</h3>
        
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-gray-900">Produto {index + 1}</h4>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <select
                  {...form.register(`lineItems.${index}.productId`)}
                  className="input-base"
                >
                  <option value="">Selecione produto</option>
                  {SAMPLE_PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <input
                  {...form.register(`lineItems.${index}.quantity`, { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className="input-base"
                  placeholder="Quantidade"
                />
                <select
                  {...form.register(`lineItems.${index}.billingType`)}
                  className="input-base"
                >
                  <option value="monthly">Mensal</option>
                  <option value="yearly">Anual</option>
                  <option value="one-time">Implementação</option>
                </select>
                <input
                  {...form.register(`lineItems.${index}.discountPercent`, { valueAsNumber: true })}
                  type="number"
                  min="0"
                  max="100"
                  className="input-base"
                  placeholder="Desconto %"
                />
              </div>

              <textarea
                {...form.register(`lineItems.${index}.notes`)}
                className="input-base resize-none"
                rows={2}
                placeholder="Observações comerciais"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            append({
              productId: '',
              productName: '',
              plan: '',
              metric: '',
              quantity: 1,
              tablePrice: 0,
              discountPercent: 0,
              discountAmount: 0,
              billingType: 'monthly',
              notes: '',
            })
          }
          className="mt-4 btn-secondary inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar Produto
        </button>
      </div>

      <button
        type="submit"
        className="w-full btn-primary py-3 font-semibold"
      >
        Continuar
      </button>
    </form>
  );
}
