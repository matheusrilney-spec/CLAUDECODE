'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientInfoSchema } from '@/lib/proposalSchema';
import { useState } from 'react';

interface ClientInfoFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function ClientInfoForm({ onSubmit, initialData }: ClientInfoFormProps) {
  const form = useForm({
    resolver: zodResolver(clientInfoSchema),
    defaultValues: initialData || {
      proposalType: 'Produto único',
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa *</label>
          <input
            {...form.register('companyName')}
            type="text"
            className="input-base"
            placeholder="Ex: Empresa XYZ"
          />
          {form.formState.errors.companyName && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.companyName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Contato *</label>
          <input
            {...form.register('contactName')}
            type="text"
            className="input-base"
            placeholder="Ex: João Silva"
          />
          {form.formState.errors.contactName && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.contactName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Segmento</label>
          <input
            {...form.register('segment')}
            type="text"
            className="input-base"
            placeholder="Ex: Tecnologia, E-commerce"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
          <input
            {...form.register('website')}
            type="url"
            className="input-base"
            placeholder="https://exemplo.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Vendedor *</label>
          <input
            {...form.register('sellerName')}
            type="text"
            className="input-base"
            placeholder="Seu nome"
          />
          {form.formState.errors.sellerName && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.sellerName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">E-mail do Vendedor *</label>
          <input
            {...form.register('sellerEmail')}
            type="email"
            className="input-base"
            placeholder="seu.email@rd.com.br"
          />
          {form.formState.errors.sellerEmail && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.sellerEmail.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Data da Proposta *</label>
          <input
            {...form.register('proposalDate')}
            type="date"
            className="input-base"
          />
          {form.formState.errors.proposalDate && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.proposalDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Válida Até *</label>
          <input
            {...form.register('validUntil')}
            type="date"
            className="input-base"
          />
          {form.formState.errors.validUntil && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.validUntil.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Proposta *</label>
        <select
          {...form.register('proposalType')}
          className="input-base"
        >
          <option>Produto único</option>
          <option>Multiproduto Duo</option>
          <option>Multiproduto Trio</option>
          <option>Projeto customizado</option>
        </select>
        {form.formState.errors.proposalType && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.proposalType.message}</p>
        )}
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
