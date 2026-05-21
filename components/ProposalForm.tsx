'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { proposalSchema } from '@/lib/proposalSchema';
import ClientInfoForm from './ClientInfoForm';
import { Plus, X } from 'lucide-react';

export default function ProposalForm({ onSubmit, isSubmitting }: any) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});

  const form = useForm({
    resolver: zodResolver(proposalSchema),
    defaultValues: formData,
  });

  const handleStepSubmit = (stepData: any) => {
    setFormData({ ...formData, ...stepData });
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit(formData);
    }
  };

  const steps = [
    {
      title: 'Dados do Cliente',
      component: <ClientInfoForm onSubmit={handleStepSubmit} />,
    },
    {
      title: 'Diagnóstico',
      component: <div className="text-center py-12 text-gray-500">Diagnóstico (em desenvolvimento)</div>,
    },
    {
      title: 'Solução',
      component: <div className="text-center py-12 text-gray-500">Solução (em desenvolvimento)</div>,
    },
    {
      title: 'Casos de Uso',
      component: <div className="text-center py-12 text-gray-500">Casos de Uso (em desenvolvimento)</div>,
    },
    {
      title: 'ROI',
      component: <div className="text-center py-12 text-gray-500">ROI (em desenvolvimento)</div>,
    },
    {
      title: 'Proposta Comercial',
      component: <div className="text-center py-12 text-gray-500">Proposta Comercial (em desenvolvimento)</div>,
    },
    {
      title: 'Roadmap',
      component: <div className="text-center py-12 text-gray-500">Roadmap (em desenvolvimento)</div>,
    },
    {
      title: 'Próximos Passos',
      component: <div className="text-center py-12 text-gray-500">Próximos Passos (em desenvolvimento)</div>,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex-1 mx-1 h-2 rounded-full transition-colors ${
                index <= currentStep ? 'bg-primary' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 text-center mt-2">
          Etapa {currentStep + 1} de {steps.length}: {steps[currentStep].title}
        </p>
      </div>

      {/* Form Content */}
      <div className="min-h-96">
        {steps[currentStep].component}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={() => handleStepSubmit(formData)}
          disabled={isSubmitting}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
        >
          {currentStep === steps.length - 1
            ? isSubmitting
              ? 'Salvando...'
              : 'Finalizar'
            : 'Próximo'}
        </button>
      </div>
    </div>
  );
}
