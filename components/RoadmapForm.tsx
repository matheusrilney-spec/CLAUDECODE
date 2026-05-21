'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { Plus, X } from 'lucide-react';

interface RoadmapStep {
  name: string;
  estimatedDays: number;
  responsible: string;
  description: string;
  tasks: string[];
}

interface Props {
  onSubmit: (data: { roadmap: RoadmapStep[] }) => void;
  initialData?: { roadmap: RoadmapStep[] };
}

const DEFAULT_STEPS: RoadmapStep[] = [
  { name: 'Validação e Assinatura', estimatedDays: 3, responsible: 'RD Station', description: 'Alinhamento final da proposta e assinatura do contrato.', tasks: ['Revisão dos termos', 'Assinatura digital', 'Envio de boas-vindas'] },
  { name: 'Kickoff', estimatedDays: 1, responsible: 'RD Station + Cliente', description: 'Reunião de início do projeto com todos os envolvidos.', tasks: ['Apresentação da equipe', 'Alinhamento de expectativas', 'Definição de cronograma', 'Acesso às ferramentas'] },
  { name: 'Configurações Iniciais', estimatedDays: 7, responsible: 'RD Station', description: 'Setup técnico da plataforma e integrações.', tasks: ['Criação da conta', 'Configurações de domínio', 'Integrações básicas', 'Importação de dados'] },
  { name: 'Implementação', estimatedDays: 14, responsible: 'RD Station + Cliente', description: 'Construção dos fluxos, automações e conteúdos.', tasks: ['Criação de landing pages', 'Fluxos de automação', 'Configuração do funil', 'Templates de email'] },
  { name: 'Treinamento', estimatedDays: 5, responsible: 'RD Station', description: 'Capacitação da equipe do cliente.', tasks: ['Treinamento da plataforma', 'Boas práticas', 'Acesso à documentação', 'Dúvidas e suporte'] },
  { name: 'Go-live', estimatedDays: 1, responsible: 'Cliente', description: 'Lançamento oficial das ações e campanhas.', tasks: ['Ativação dos fluxos', 'Monitoramento inicial', 'Ajustes rápidos'] },
  { name: 'Acompanhamento Inicial', estimatedDays: 30, responsible: 'RD Station', description: 'Suporte próximo nas primeiras semanas de operação.', tasks: ['Check-ins semanais', 'Análise de métricas', 'Otimizações', 'Relatório de resultados'] },
];

export default function RoadmapForm({ onSubmit, initialData }: Props) {
  const form = useForm<{ roadmap: RoadmapStep[] }>({
    defaultValues: initialData || { roadmap: DEFAULT_STEPS },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'roadmap',
  });

  const roadmap = form.watch('roadmap');

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="text-sm text-gray-500 bg-blue-50 rounded-lg p-3">
        O roadmap vem pré-preenchido com etapas padrão. Ajuste prazos, responsáveis e tarefas conforme o projeto.
      </div>

      {fields.map((field, index) => {
        const step = roadmap[index];

        return (
          <div key={field.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <input
                  {...form.register(`roadmap.${index}.name`)}
                  className="input-base font-medium text-gray-800"
                  placeholder="Nome da etapa"
                />
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-400 hover:text-red-600 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Duração estimada (dias)</label>
                <input
                  type="number"
                  min="1"
                  {...form.register(`roadmap.${index}.estimatedDays`, { valueAsNumber: true })}
                  className="input-base text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Responsável</label>
                <input
                  {...form.register(`roadmap.${index}.responsible`)}
                  className="input-base text-sm"
                  placeholder="Ex: RD Station + Cliente"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">Descrição</label>
              <textarea
                {...form.register(`roadmap.${index}.description`)}
                className="input-base text-sm resize-none"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Tarefas principais</label>
              <div className="space-y-2">
                {(step?.tasks || []).map((_, taskIdx) => (
                  <div key={taskIdx} className="flex gap-2 items-center">
                    <span className="text-gray-400 text-sm">•</span>
                    <input
                      {...form.register(`roadmap.${index}.tasks.${taskIdx}`)}
                      className="input-base text-sm flex-1"
                      placeholder="Tarefa"
                    />
                    {(step?.tasks || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const tasks = [...(step?.tasks || [])];
                          tasks.splice(taskIdx, 1);
                          form.setValue(`roadmap.${index}.tasks`, tasks);
                        }}
                        className="text-red-400 hover:text-red-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  const tasks = [...(step?.tasks || []), ''];
                  form.setValue(`roadmap.${index}.tasks`, tasks);
                }}
                className="mt-2 text-xs text-primary hover:underline"
              >
                + Adicionar tarefa
              </button>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => append({ name: '', estimatedDays: 7, responsible: '', description: '', tasks: [''] })}
        className="btn-secondary inline-flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Nova Etapa
      </button>

      <button type="submit" className="w-full btn-primary py-3 font-semibold">
        Continuar
      </button>
    </form>
  );
}
