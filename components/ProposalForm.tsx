'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import ClientInfoForm from './ClientInfoForm';
import DiagnosisForm from './DiagnosisForm';
import SolutionForm from './SolutionForm';
import UseCasesForm from './UseCasesForm';
import RoiForm from './RoiForm';
import ProductSelector from './ProductSelector';
import RoadmapForm from './RoadmapForm';
import NextStepsForm from './NextStepsForm';
import CommercialSummary from './CommercialSummary';

interface Props {
  onSubmit: (data: Record<string, unknown>) => void;
  isSubmitting?: boolean;
  initialData?: Record<string, unknown>;
}

const STEPS = [
  { id: 'clientInfo', label: 'Cliente' },
  { id: 'diagnosis', label: 'Diagnóstico' },
  { id: 'solution', label: 'Solução' },
  { id: 'useCases', label: 'Casos de Uso' },
  { id: 'roi', label: 'ROI' },
  { id: 'lineItems', label: 'Produtos' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'nextSteps', label: 'Próximos Passos' },
];

export default function ProposalForm({ onSubmit, isSubmitting, initialData }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData || {});

  function saveStep(stepId: string, stepData: unknown) {
    const updated = { ...formData, [stepId]: stepData };
    setFormData(updated);
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit(updated);
    }
  }

  function goBack() {
    setCurrentStep(Math.max(0, currentStep - 1));
  }

  function goToStep(i: number) {
    if (i < currentStep) setCurrentStep(i);
  }

  const ci = formData.clientInfo as { sellerName?: string } | undefined;
  const lineItemsWrapper = formData.lineItems as { lineItems?: Record<string, unknown>[] } | undefined;
  const lineItemsData = lineItemsWrapper?.lineItems ?? [];

  type AnyRecord = Record<string, unknown>;

  function renderStep() {
    switch (STEPS[currentStep].id) {
      case 'clientInfo':
        return (
          <ClientInfoForm
            onSubmit={(d) => saveStep('clientInfo', d)}
            initialData={formData.clientInfo as AnyRecord}
          />
        );

      case 'diagnosis':
        return (
          <DiagnosisForm
            onSubmit={(d) => saveStep('diagnosis', d)}
            initialData={formData.diagnosis as AnyRecord}
          />
        );

      case 'solution':
        return (
          <SolutionForm
            onSubmit={(d) => saveStep('solution', d)}
            initialData={formData.solution as AnyRecord}
          />
        );

      case 'useCases':
        return (
          <UseCasesForm
            onSubmit={(d) => saveStep('useCases', d.useCases)}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            initialData={formData.useCases ? { useCases: formData.useCases as any } : undefined}
          />
        );

      case 'roi':
        return (
          <RoiForm
            onSubmit={(d) => saveStep('roi', d)}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            initialData={formData.roi as any}
          />
        );

      case 'lineItems':
        return (
          <div className="space-y-6">
            <ProductSelector
              onSubmit={(d) => saveStep('lineItems', d)}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              initialData={formData.lineItems ? { lineItems: lineItemsData as any } : undefined}
            />
            {lineItemsData.length > 0 && (
              <CommercialSummary
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                lineItems={lineItemsData as any}
              />
            )}
          </div>
        );

      case 'roadmap':
        return (
          <RoadmapForm
            onSubmit={(d) => saveStep('roadmap', d.roadmap)}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            initialData={formData.roadmap ? { roadmap: formData.roadmap as any } : undefined}
          />
        );

      case 'nextSteps':
        return (
          <NextStepsForm
            onSubmit={(d) => saveStep('nextSteps', d)}
            initialData={formData.nextSteps as Record<string, string> | undefined}
            sellerName={ci?.sellerName}
          />
        );

      default:
        return null;
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-4 overflow-x-auto">
        <div className="flex items-center min-w-max">
          {STEPS.map((step, index) => {
            const isDone = index < currentStep;
            const isActive = index === currentStep;

            return (
              <div key={step.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => goToStep(index)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : isDone
                      ? 'text-green-600 hover:bg-green-50 cursor-pointer'
                      : 'text-gray-400 cursor-default'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border-2 ${
                        isActive ? 'border-white bg-white text-primary' : 'border-gray-300'
                      }`}
                    >
                      {index + 1}
                    </span>
                  )}
                  {step.label}
                </button>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-6 h-0.5 mx-1 ${index < currentStep ? 'bg-green-400' : 'bg-gray-200'}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">{STEPS[currentStep].label}</h2>
          <span className="text-sm text-gray-400">
            Etapa {currentStep + 1} de {STEPS.length}
          </span>
        </div>

        {renderStep()}

        {currentStep > 0 && (
          <div className="mt-4">
            <button
              type="button"
              onClick={goBack}
              className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
            >
              ← Voltar
            </button>
          </div>
        )}
      </div>

      {isSubmitting && (
        <div className="text-center text-gray-500 text-sm">Salvando proposta...</div>
      )}
    </div>
  );
}
