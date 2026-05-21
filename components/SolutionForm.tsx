'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { solutionSchema } from '@/lib/proposalSchema';
import { Plus, X } from 'lucide-react';

const PRODUCTS = [
  'RD Station Marketing',
  'RD Station CRM',
  'RD Conversas',
  'Spotter',
  'Mentor IA',
];

export default function SolutionForm({ onSubmit, initialData }: any) {
  const form = useForm({
    resolver: zodResolver(solutionSchema),
    defaultValues: initialData || {
      summary: '',
      productsInvolved: [],
      connection: '',
      deliveries: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'deliveries',
  });

  const productsInvolved = form.watch('productsInvolved');

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Resumo da Solução *</label>
        <textarea
          {...form.register('summary')}
          className="input-base resize-none"
          rows={4}
          placeholder="Descreva a solução proposta de forma clara e executiva"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Produtos Envolvidos *</label>
        <div className="grid grid-cols-2 gap-3">
          {PRODUCTS.map((product) => (
            <label key={product} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                value={product}
                {...form.register('productsInvolved')}
                className="w-4 h-4 rounded border-gray-300 text-primary"
              />
              <span className="text-sm text-gray-700">{product}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Como os Produtos se Conectam *</label>
        <textarea
          {...form.register('connection')}
          className="input-base resize-none"
          rows={3}
          placeholder="Explique como os produtos trabalham juntos"
        />
      </div>

      {productsInvolved.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Entregas por Produto</h3>
            <button
              type="button"
              onClick={() => append({ productName: '', deliveries: [] })}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar Entregas
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <select
                    {...form.register(`deliveries.${index}.productName`)}
                    className="input-base flex-1"
                  >
                    <option value="">Selecione um produto</option>
                    {productsInvolved.map((p: string) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {/* Deliveries would be added here */}
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full btn-primary py-3 font-semibold"
      >
        Continuar
      </button>
    </form>
  );
}
