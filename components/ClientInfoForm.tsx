'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientInfoSchema, ClientInfo } from '@/lib/proposalSchema';

interface ClientInfoFormProps {
  onSubmit: (data: ClientInfo) => void;
  initialData?: Partial<ClientInfo>;
}

export default function ClientInfoForm({ onSubmit, initialData }: ClientInfoFormProps) {
  const form = useForm<ClientInfo>({
    resolver: zodResolver(clientInfoSchema),
    defaultValues: {
      proposalType: 'Produto único',
      ...initialData,
    },
  });

  const err = form.formState.errors;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa *</label>
          <input {...form.register('companyName')} type="text" className="input-base" placeholder="Ex: Empresa XYZ" />
          {err.companyName && <p className="text-red-500 text-sm mt-1">{String(err.companyName.message)}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Contato *</label>
          <input {...form.register('contactName')} type="text" className="input-base" placeholder="Ex: João Silva" />
          {err.contactName && <p className="text-red-500 text-sm mt-1">{String(err.contactName.message)}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Segmento</label>
          <input {...form.register('segment')} type="text" className="input-base" placeholder="Ex: Tecnologia, E-commerce" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
          <input {...form.register('website')} type="url" className="input-base" placeholder="https://exemplo.com" />
          {err.website && <p className="text-red-500 text-sm mt-1">{String(err.website.message)}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Vendedor *</label>
          <input {...form.register('sellerName')} type="text" className="input-base" placeholder="Seu nome" />
          {err.sellerName && <p className="text-red-500 text-sm mt-1">{String(err.sellerName.message)}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">E-mail do Vendedor *</label>
          <input {...form.register('sellerEmail')} type="email" className="input-base" placeholder="seu.email@rd.com.br" />
          {err.sellerEmail && <p className="text-red-500 text-sm mt-1">{String(err.sellerEmail.message)}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Data da Proposta *</label>
          <input {...form.register('proposalDate')} type="date" className="input-base" />
          {err.proposalDate && <p className="text-red-500 text-sm mt-1">{String(err.proposalDate.message)}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Válida Até *</label>
          <input {...form.register('validUntil')} type="date" className="input-base" />
          {err.validUntil && <p className="text-red-500 text-sm mt-1">{String(err.validUntil.message)}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Proposta *</label>
        <select {...form.register('proposalType')} className="input-base">
          <option>Produto único</option>
          <option>Multiproduto Duo</option>
          <option>Multiproduto Trio</option>
          <option>Projeto customizado</option>
        </select>
        {err.proposalType && <p className="text-red-500 text-sm mt-1">{String(err.proposalType.message)}</p>}
      </div>

      <button type="submit" className="w-full btn-primary py-3 font-semibold">
        Continuar
      </button>
    </form>
  );
}
