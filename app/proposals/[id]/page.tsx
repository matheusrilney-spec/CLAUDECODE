'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, Download, Copy, Trash2, CheckCircle } from 'lucide-react';
import ProposalForm from '@/components/ProposalForm';
import CommercialSummary from '@/components/CommercialSummary';

interface Proposal {
  id: string;
  companyName: string;
  status: string;
  [key: string]: unknown;
}

const STATUS_OPTIONS = ['Rascunho', 'Enviada', 'Aprovada', 'Perdida'];

export default function ProposalDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const fetchProposal = useCallback(async () => {
    try {
      const res = await fetch(`/api/proposals/${params.id}`);
      if (!res.ok) throw new Error('Proposta não encontrada');
      const data = await res.json();
      setProposal(data);
    } catch {
      setError('Proposta não encontrada');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchProposal();
  }, [fetchProposal]);

  async function handleSave(formData: Record<string, unknown>) {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/proposals/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Erro ao salvar');
      }
      await fetchProposal();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar proposta');
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    await fetch(`/api/proposals/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    await fetchProposal();
  }

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja excluir esta proposta?')) return;
    await fetch(`/api/proposals/${params.id}`, { method: 'DELETE' });
    router.push('/proposals');
  }

  async function handleExportHTML() {
    setExporting(true);
    try {
      const res = await fetch('/api/export/html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId: params.id }),
      });
      const { html, filename } = await res.json();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Erro ao exportar HTML');
    } finally {
      setExporting(false);
    }
  }

  async function handleCopyHTML() {
    try {
      const res = await fetch('/api/export/html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId: params.id }),
      });
      const { html } = await res.json();
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Erro ao copiar HTML');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Carregando proposta...
      </div>
    );
  }

  if (error && !proposal) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/proposals" className="btn-primary">
          Voltar para propostas
        </Link>
      </div>
    );
  }

  const getInitialData = () => {
    if (!proposal) return {};
    const p = proposal as Record<string, unknown> & {
      content?: Record<string, string | null>;
      lineItems?: unknown[];
    };

    const parseJSON = (val: string | null | undefined) => {
      if (!val) return undefined;
      try { return JSON.parse(val); } catch { return undefined; }
    };

    return {
      clientInfo: {
        companyName: p.companyName,
        contactName: p.contactName,
        segment: p.segment,
        website: p.website,
        sellerName: p.sellerName,
        sellerEmail: p.sellerEmail,
        proposalDate: p.proposalDate ? new Date(p.proposalDate as string).toISOString().split('T')[0] : '',
        validUntil: p.validUntil ? new Date(p.validUntil as string).toISOString().split('T')[0] : '',
        proposalType: p.proposalType,
      },
      diagnosis: p.content ? {
        objectives: p.content.objectives,
        problems: parseJSON(p.content.problems) || [],
        impact: '',
        risks: '',
        priority: 'Alta',
        moment: '',
      } : undefined,
      solution: p.content ? parseJSON(p.content.solution) : undefined,
      useCases: p.content ? parseJSON(p.content.useCases) : undefined,
      roi: p.content ? parseJSON(p.content.roi) : undefined,
      lineItems: { lineItems: p.lineItems || [] },
      roadmap: p.content ? parseJSON(p.content.roadmap) : undefined,
      nextSteps: p.content ? parseJSON(p.content.nextSteps) : undefined,
    };
  };

  const li = (proposal as Record<string, unknown> & { lineItems?: unknown[] })?.lineItems ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {proposal?.companyName}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-500">Status:</span>
            <select
              value={String(proposal?.status || 'Rascunho')}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-2 py-1"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/proposals/${params.id}/preview`}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Link>
          <button
            onClick={handleExportHTML}
            disabled={exporting}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Exportando...' : 'Exportar HTML'}
          </button>
          <button
            onClick={handleCopyHTML}
            className="btn-secondary inline-flex items-center gap-2"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiado!' : 'Copiar HTML'}
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 border border-red-200 rounded-lg px-3 py-2 text-sm inline-flex items-center gap-2 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {li.length > 0 && (
        <CommercialSummary lineItems={li as Parameters<typeof CommercialSummary>[0]['lineItems']} />
      )}

      <ProposalForm
        onSubmit={handleSave}
        isSubmitting={saving}
        initialData={getInitialData()}
      />
    </div>
  );
}
