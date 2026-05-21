'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface RoiCard {
  title: string;
  description: string;
  metricBefore: string;
  metricAfter: string;
  qualitative: boolean;
  notes: string;
}

interface RoiData {
  cards: RoiCard[];
  summary: string;
}

interface Props {
  onSubmit: (data: RoiData) => void;
  initialData?: RoiData;
}

const QUALITATIVE_TEMPLATES = [
  { title: 'Redução de perda de leads', description: 'Eliminação do risco de leads sem resposta por falta de acompanhamento estruturado.' },
  { title: 'Aumento da velocidade de atendimento', description: 'Redução significativa no tempo de resposta inicial ao lead ou cliente.' },
  { title: 'Melhora na rastreabilidade comercial', description: 'Visibilidade total do funil: origem, etapa e histórico de cada oportunidade.' },
  { title: 'Redução de retrabalho', description: 'Processos automatizados eliminam tarefas manuais repetitivas da equipe.' },
  { title: 'Melhor aproveitamento de mídia paga', description: 'Leads de mídia paga são qualificados e nutridos em vez de desperdiçados.' },
  { title: 'Reativação de base parada', description: 'Monetização de leads antigos sem novo investimento em aquisição.' },
];

export default function RoiForm({ onSubmit, initialData }: Props) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  const form = useForm<RoiData>({
    defaultValues: initialData || { cards: [], summary: '' },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'cards',
  });

  function addTemplate(t: { title: string; description: string }) {
    append({ title: t.title, description: t.description, metricBefore: '', metricAfter: '', qualitative: true, notes: '' });
    setExpandedIdx(fields.length);
  }

  function addEmpty() {
    append({ title: '', description: '', metricBefore: '', metricAfter: '', qualitative: false, notes: '' });
    setExpandedIdx(fields.length);
  }

  const cards = form.watch('cards');

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-green-50 rounded-lg p-4">
        <p className="text-sm font-medium text-green-800 mb-3">Templates de ROI qualitativo:</p>
        <div className="flex flex-wrap gap-2">
          {QUALITATIVE_TEMPLATES.map((t) => (
            <button
              key={t.title}
              type="button"
              onClick={() => addTemplate(t)}
              className="px-3 py-1.5 text-xs bg-white border border-green-300 text-green-700 rounded-full hover:bg-green-100 transition-colors"
            >
              + {t.title}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => {
          const isOpen = expandedIdx === index;
          const card = cards[index];

          return (
            <div key={field.id} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <div
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100"
                onClick={() => setExpandedIdx(isOpen ? null : index)}
              >
                <span className="font-medium text-gray-800">
                  {card?.title || `ROI ${index + 1}`}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); remove(index); }}
                    className="text-red-400 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </div>

              {isOpen && (
                <div className="p-4 border-t border-gray-200 space-y-4 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Título *</label>
                      <input {...form.register(`cards.${index}.title`)} className="input-base text-sm" placeholder="Ex: Redução de perda de leads" />
                    </div>
                    <div className="flex items-end gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" {...form.register(`cards.${index}.qualitative`)} className="w-4 h-4 rounded" />
                        <span className="text-sm text-gray-700">ROI qualitativo (sem números exatos)</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Descrição</label>
                    <textarea {...form.register(`cards.${index}.description`)} className="input-base text-sm resize-none" rows={2} placeholder="Descreva o impacto esperado" />
                  </div>

                  {!card?.qualitative && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Métrica Antes</label>
                        <input {...form.register(`cards.${index}.metricBefore`)} className="input-base text-sm" placeholder="Ex: 20% de conversão" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Métrica Depois (estimada)</label>
                        <input {...form.register(`cards.${index}.metricAfter`)} className="input-base text-sm" placeholder="Ex: 35% de conversão" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Observações / Premissas</label>
                    <input {...form.register(`cards.${index}.notes`)} className="input-base text-sm" placeholder="Ex: Baseado em benchmarks do setor" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button type="button" onClick={addEmpty} className="btn-secondary inline-flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Novo Card de ROI
      </button>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Resumo Geral do ROI</label>
        <textarea {...form.register('summary')} className="input-base resize-none" rows={3} placeholder="Síntese executiva do retorno esperado com a implementação..." />
      </div>

      <button type="submit" className="w-full btn-primary py-3 font-semibold">
        Continuar
      </button>
    </form>
  );
}
