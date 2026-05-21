'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Copy, CheckCircle } from 'lucide-react';

export default function ProposalPreview({ params }: { params: { id: string } }) {
  const [html, setHtml] = useState('');
  const [filename, setFilename] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const loadPreview = useCallback(async () => {
    try {
      const res = await fetch('/api/export/html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId: params.id }),
      });
      if (!res.ok) throw new Error('Erro ao gerar preview');
      const data = await res.json();
      setHtml(data.html);
      setFilename(data.filename);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar preview');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadPreview();
  }, [loadPreview]);

  function handleDownload() {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3 bg-white rounded-xl border border-gray-200 p-4">
        <Link
          href={`/proposals/${params.id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar à proposta
        </Link>

        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            disabled={!html}
            className="btn-primary inline-flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            Baixar HTML
          </button>
          <button
            onClick={handleCopy}
            disabled={!html}
            className="btn-secondary inline-flex items-center gap-2 text-sm"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiado!' : 'Copiar HTML'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-gray-500">
          Gerando preview da proposta...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {html && !loading && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ height: '80vh' }}>
          <iframe
            srcDoc={html}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Preview da Proposta"
          />
        </div>
      )}
    </div>
  );
}
