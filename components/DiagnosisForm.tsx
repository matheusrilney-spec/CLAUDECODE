'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { diagnosisSchema } from '@/lib/proposalSchema';
import { Plus, X } from 'lucide-react';

export default function DiagnosisForm({ onSubmit, initialData }: any) {
  const form = useForm({
    resolver: zodResolver(diagnosisSchema),
    defaultValues: initialData || {
      objectives: '',
      problems: [{ title: '', description: '', severity: 'Crítico', commercialFlag: false }],
      impact: '',
      risks: '',
      priority: 'Alta',
      moment: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'problems',
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Objetivo Principal *</label>
        <textarea
          {...form.register('objectives')}
          className="input-base resize-none"
          rows={3}
          placeholder="Qual é o principal objetivo do cliente com essa solução?"
        />
        {form.formState.errors.objectives && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.objectives.message}</p>
        )}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Problemas Identificados *</h3>
          <button
            type="button"
            onClick={() => append({ title: '', description: '', severity: 'Atenção', commercialFlag: false })}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Problema
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-gray-900">Problema {index + 1}</h4>
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
              <div className="space-y-3">
                <input
                  {...form.register(`problems.${index}.title`)}
                  type="text"
                  className="input-base"
                  placeholder="Título do problema"
                />
                <textarea
                  {...form.register(`problems.${index}.description`)}
                  className="input-base resize-none"
                  rows={2}
                  placeholder="Descrição detalhada"
                />
                <select
                  {...form.register(`problems.${index}.severity`)}
                  className="input-base"
                >
                  <option>Crítico</option>
                  <option>Atenção</option>
                  <option>Oportunidade</option>
                </select>
              </div>
            </div>
          ))}
        </div>
        {form.formState.errors.problems && (
          <p className="text-red-500 text-sm mt-2">{form.formState.errors.problems.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Impacto dos Problemas *</label>
          <textarea
            {...form.register('impact')}
            className="input-base resize-none"
            rows={3}
            placeholder="Como esses problemas impactam o negócio?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Riscos de Não Agir *</label>
          <textarea
            {...form.register('risks')}
            className="input-base resize-none"
            rows={3}
            placeholder="Quais são os riscos se nada for feito?"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade *</label>
          <select
            {...form.register('priority')}
            className="input-base"
          >
            <option>Baixa</option>
            <option>Média</option>
            <option>Alta</option>
            <option>Crítica</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Momento Atual da Empresa *</label>
          <textarea
            {...form.register('moment')}
            className="input-base resize-none"
            rows={2}
            placeholder="Contexto do momento atual"
          />
        </div>
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
