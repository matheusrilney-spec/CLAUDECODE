'use client';

import { useForm } from 'react-hook-form';

interface NextSteps {
  immediateAction: string;
  scheduledDate: string;
  clientResponsible: string;
  rdResponsible: string;
  financialFlow: string;
  contractingDeadline: string;
  finalNotes: string;
}

interface Props {
  onSubmit: (data: NextSteps) => void;
  initialData?: Partial<NextSteps>;
  sellerName?: string;
}

export default function NextStepsForm({ onSubmit, initialData, sellerName }: Props) {
  const form = useForm<NextSteps>({
    defaultValues: {
      immediateAction: '',
      scheduledDate: '',
      clientResponsible: '',
      rdResponsible: sellerName || '',
      financialFlow: '',
      contractingDeadline: '',
      finalNotes: '',
      ...initialData,
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Próximo passo imediato *</label>
        <textarea
          {...form.register('immediateAction', { required: true })}
          className="input-base resize-none"
          rows={3}
          placeholder="Ex: Reunião de validação da proposta com diretor comercial para alinhamento final e assinatura do contrato."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Data e horário combinados</label>
          <input
            type="datetime-local"
            {...form.register('scheduledDate')}
            className="input-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prazo para contratação</label>
          <input
            {...form.register('contractingDeadline')}
            className="input-base"
            placeholder="Ex: Até 30/06/2026"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Responsável (Cliente) *</label>
          <input
            {...form.register('clientResponsible', { required: true })}
            className="input-base"
            placeholder="Nome do responsável no cliente"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Responsável (RD Station) *</label>
          <input
            {...form.register('rdResponsible', { required: true })}
            className="input-base"
            placeholder="Seu nome"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fluxo financeiro</label>
        <textarea
          {...form.register('financialFlow')}
          className="input-base resize-none"
          rows={2}
          placeholder="Ex: Nota fiscal emitida após assinatura. Pagamento via boleto com vencimento em 30 dias."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Observações finais</label>
        <textarea
          {...form.register('finalNotes')}
          className="input-base resize-none"
          rows={3}
          placeholder="Condições especiais, informações adicionais, alertas importantes..."
        />
      </div>

      <button type="submit" className="w-full btn-primary py-3 font-semibold">
        Finalizar e Salvar Proposta
      </button>
    </form>
  );
}
