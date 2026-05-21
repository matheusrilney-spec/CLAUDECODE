'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProposalForm from '@/components/ProposalForm';

export default function NewProposal() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const proposal = await response.json();
        router.push(`/proposals/${proposal.id}`);
      } else {
        alert('Erro ao criar proposta');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao criar proposta');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Nova Proposta</h1>
      <ProposalForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
