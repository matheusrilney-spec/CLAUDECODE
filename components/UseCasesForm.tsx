'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface UseCase {
  title: string;
  subtitle: string;
  products: string[];
  steps: string[];
  roi: string;
}

interface Props {
  onSubmit: (data: { useCases: UseCase[] }) => void;
  initialData?: { useCases: UseCase[] };
  productsInvolved?: string[];
}

const TEMPLATE_CASES: Record<string, UseCase[]> = {
  'RD Station Marketing': [
    { title: 'Captação de Leads', subtitle: 'Atração e conversão de visitantes', products: ['RD Station Marketing'], steps: ['Criação de landing page', 'Formulário de captura', 'Segmentação automática do lead', 'Trigger de automação de nutrição'], roi: 'Aumento do volume de leads qualificados para o comercial' },
    { title: 'Nutrição de Base', subtitle: 'Relacionamento e educação de leads', products: ['RD Station Marketing'], steps: ['Segmentação por interesse/etapa', 'Envio de email educacional', 'Lead scoring automático', 'Passagem ao comercial quando qualificado'], roi: 'Redução do ciclo de vendas e leads mais preparados para comprar' },
    { title: 'Reativação de Leads Frios', subtitle: 'Aproveitamento da base parada', products: ['RD Station Marketing'], steps: ['Filtro de leads sem atividade', 'Campanha de reengajamento', 'Oferta/conteúdo específico', 'Reclassificação e passagem ao CRM'], roi: 'Receita adicional sem custo de aquisição' },
  ],
  'RD Station CRM': [
    { title: 'Organização do Funil', subtitle: 'Visibilidade total do pipeline', products: ['RD Station CRM'], steps: ['Mapeamento de etapas do processo comercial', 'Cadastro de oportunidades com contexto', 'Definição de critérios por etapa', 'Dashboard de acompanhamento gerencial'], roi: 'Maior previsibilidade de receita e controle do processo' },
    { title: 'Gestão de Follow-up', subtitle: 'Nunca perder um follow-up', products: ['RD Station CRM'], steps: ['Registro de contato e próxima ação', 'Alertas automáticos de follow-up', 'Histórico completo da negociação', 'Registro de motivos de perda'], roi: 'Redução de oportunidades perdidas por falta de acompanhamento' },
  ],
  'RD Conversas': [
    { title: 'Atendimento via WhatsApp', subtitle: 'Canal oficial com múltiplos agentes', products: ['RD Conversas'], steps: ['Ativação do número na API Oficial WhatsApp', 'Configuração de equipes e filas', 'Distribuição automática de atendimentos', 'Integração com CRM para contexto'], roi: 'Escalabilidade no atendimento sem aumentar equipe proporcionalmente' },
    { title: 'Qualificação Automática com IA', subtitle: 'Triagem inteligente antes do comercial', products: ['RD Conversas', 'RD Station CRM'], steps: ['Lead entra pelo WhatsApp', 'IA coleta informações de perfil e interesse', 'Qualificação automática por critérios', 'Oportunidade criada no CRM com contexto completo', 'Vendedor recebe lead pronto para abordagem'], roi: 'Redução de 40-60% no tempo operacional da equipe comercial' },
  ],
};

export default function UseCasesForm({ onSubmit, initialData, productsInvolved = [] }: Props) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  const form = useForm<{ useCases: UseCase[] }>({
    defaultValues: initialData || { useCases: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'useCases',
  });

  function addFromTemplate(uc: UseCase) {
    append(uc);
    setExpandedIdx(fields.length);
  }

  function addEmptyCase() {
    append({ title: '', subtitle: '', products: [], steps: [''], roi: '' });
    setExpandedIdx(fields.length);
  }

  const templateProducts = productsInvolved.length ? productsInvolved : Object.keys(TEMPLATE_CASES);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-800 mb-3">Adicionar caso de uso a partir de template:</p>
        <div className="flex flex-wrap gap-2">
          {templateProducts.flatMap((product) =>
            (TEMPLATE_CASES[product] || []).map((uc) => (
              <button
                key={`${product}-${uc.title}`}
                type="button"
                onClick={() => addFromTemplate(uc)}
                className="px-3 py-1.5 text-xs bg-white border border-blue-300 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
              >
                + {uc.title}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => {
          const isOpen = expandedIdx === index;
          const uc = form.watch(`useCases.${index}`);

          return (
            <div key={field.id} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <div
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100"
                onClick={() => setExpandedIdx(isOpen ? null : index)}
              >
                <div>
                  <span className="font-medium text-gray-800">
                    {uc?.title || `Caso de Uso ${index + 1}`}
                  </span>
                  {uc?.subtitle && (
                    <span className="ml-2 text-sm text-gray-500">— {uc.subtitle}</span>
                  )}
                </div>
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
                      <input {...form.register(`useCases.${index}.title`)} className="input-base text-sm" placeholder="Ex: Qualificação automática de leads" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Subtítulo</label>
                      <input {...form.register(`useCases.${index}.subtitle`)} className="input-base text-sm" placeholder="Ex: Triagem antes do comercial" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Produtos envolvidos</label>
                    <div className="flex flex-wrap gap-2">
                      {['RD Station Marketing', 'RD Station CRM', 'RD Conversas', 'Spotter', 'Mentor IA'].map((p) => {
                        const selected = (uc?.products || []).includes(p);
                        return (
                          <label key={p} className={`cursor-pointer px-3 py-1 rounded-full text-xs border transition-colors ${selected ? 'bg-primary text-white border-primary' : 'bg-white border-gray-300 text-gray-600 hover:border-primary'}`}>
                            <input
                              type="checkbox"
                              value={p}
                              className="sr-only"
                              {...form.register(`useCases.${index}.products`)}
                            />
                            {p}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Fluxo passo a passo</label>
                    <div className="space-y-2">
                      {(uc?.steps || []).map((_, stepIdx) => (
                        <div key={stepIdx} className="flex gap-2 items-center">
                          <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">{stepIdx + 1}</span>
                          <input
                            {...form.register(`useCases.${index}.steps.${stepIdx}`)}
                            className="input-base text-sm flex-1"
                            placeholder={`Passo ${stepIdx + 1}`}
                          />
                          {(uc?.steps || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const steps = [...(uc?.steps || [])];
                                steps.splice(stepIdx, 1);
                                form.setValue(`useCases.${index}.steps`, steps);
                              }}
                              className="text-red-400 hover:text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const steps = [...(uc?.steps || []), ''];
                        form.setValue(`useCases.${index}.steps`, steps);
                      }}
                      className="mt-2 text-xs text-primary hover:underline"
                    >
                      + Adicionar passo
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Ganho / ROI esperado</label>
                    <textarea
                      {...form.register(`useCases.${index}.roi`)}
                      className="input-base text-sm resize-none"
                      rows={2}
                      placeholder="Descreva o ganho esperado com esse caso de uso"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addEmptyCase}
        className="btn-secondary inline-flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Novo Caso de Uso
      </button>

      <button type="submit" className="w-full btn-primary py-3 font-semibold">
        Continuar
      </button>
    </form>
  );
}
