'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { solutionSchema } from '@/lib/proposalSchema';
import { X } from 'lucide-react';

const PRODUCTS = [
  'RD Station Marketing',
  'RD Station CRM',
  'RD Conversas',
  'Spotter',
  'Mentor IA',
];

const DELIVERIES_BY_PRODUCT: Record<string, string[]> = {
  'RD Station Marketing': [
    'Landing pages', 'Formulários de captura', 'Automação de marketing',
    'Segmentação de base', 'Nutrição de leads', 'Lead scoring',
    'Integração com mídia paga', 'Relatórios e dashboards',
  ],
  'RD Station CRM': [
    'Pipeline comercial', 'Gestão de oportunidades', 'Histórico de interação',
    'Motivos de perda', 'Atividades e follow-ups', 'Previsibilidade comercial',
    'Relatórios de vendas', 'Integração com Marketing',
  ],
  'RD Conversas': [
    'WhatsApp API Oficial', 'Multiatendimento', 'IA conversacional',
    'Distribuição de atendimentos', 'Tags e filas', 'Integração com CRM/Marketing',
    'Relatórios de atendimento', 'Chatbot de triagem',
  ],
  'Spotter': [
    'Prospecção de empresas', 'Dados enriquecidos de leads', 'Filtros de segmentação',
    'Exportação para CRM', 'Análise de mercado',
  ],
  'Mentor IA': [
    'Sugestões de próximas ações', 'Análise preditiva', 'Insights de pipeline',
    'Recomendações de conteúdo', 'IA de qualificação',
  ],
};

export default function SolutionForm({ onSubmit, initialData }: {
  onSubmit: (data: unknown) => void;
  initialData?: Record<string, unknown>;
}) {
  const form = useForm({
    resolver: zodResolver(solutionSchema),
    defaultValues: (initialData as {
      summary?: string;
      productsInvolved?: string[];
      connection?: string;
      deliveries?: Array<{ productName: string; deliveries: string[] }>;
    }) || {
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

  const productsInvolved: string[] = form.watch('productsInvolved') || [];

  function addProductDeliveries(product: string) {
    const existing = fields.findIndex((f) => (f as { productName: string }).productName === product);
    if (existing >= 0) return;
    const suggestions = DELIVERIES_BY_PRODUCT[product] || [];
    append({ productName: product, deliveries: suggestions });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Resumo da Solução *</label>
        <textarea
          {...form.register('summary')}
          className="input-base resize-none"
          rows={4}
          placeholder="Descreva a solução proposta de forma clara e executiva. Como os produtos vão resolver os problemas identificados?"
        />
        {form.formState.errors.summary && (
          <p className="text-red-500 text-sm mt-1">{String(form.formState.errors.summary.message)}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Produtos Envolvidos *</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PRODUCTS.map((product) => {
            const isSelected = productsInvolved.includes(product);
            return (
              <label key={product} className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg border-2 transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                <input
                  type="checkbox"
                  value={product}
                  {...form.register('productsInvolved')}
                  className="w-4 h-4 rounded border-gray-300 text-primary"
                  onChange={(e) => {
                    if (e.target.checked) addProductDeliveries(product);
                  }}
                />
                <span className="text-sm text-gray-700 font-medium">{product}</span>
              </label>
            );
          })}
        </div>
        {form.formState.errors.productsInvolved && (
          <p className="text-red-500 text-sm mt-1">{String(form.formState.errors.productsInvolved.message)}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Como os Produtos se Integram *</label>
        <textarea
          {...form.register('connection')}
          className="input-base resize-none"
          rows={3}
          placeholder="Explique como os produtos trabalham juntos para entregar o resultado esperado..."
        />
      </div>

      {fields.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Principais Entregas por Produto</h3>
          {fields.map((field, index) => {
            const f = field as { productName: string; deliveries: string[] };
            const deliveries: string[] = form.watch(`deliveries.${index}.deliveries`) || [];

            return (
              <div key={field.id} className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-800">{f.productName}</h4>
                  <button type="button" onClick={() => remove(index)} className="text-red-400 hover:text-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {(DELIVERIES_BY_PRODUCT[f.productName] || []).map((delivery) => {
                    const isSelected = deliveries.includes(delivery);
                    return (
                      <label key={delivery} className={`flex items-center gap-1.5 cursor-pointer text-xs p-1.5 rounded border transition-colors ${isSelected ? 'border-teal-400 bg-teal-50 text-teal-800' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            const current = [...deliveries];
                            if (e.target.checked) {
                              form.setValue(`deliveries.${index}.deliveries`, [...current, delivery]);
                            } else {
                              form.setValue(`deliveries.${index}.deliveries`, current.filter((d) => d !== delivery));
                            }
                          }}
                          className="w-3 h-3"
                        />
                        {delivery}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button type="submit" className="w-full btn-primary py-3 font-semibold">
        Continuar
      </button>
    </form>
  );
}
