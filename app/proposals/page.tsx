'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';

interface Proposal {
  id: string;
  companyName: string;
  sellerName: string;
  proposalDate: string;
  status: string;
}

export default function ProposalsList() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const response = await fetch('/api/proposals');
      if (response.ok) {
        const data = await response.json();
        setProposals(data);
      }
    } catch (error) {
      console.error('Erro ao carregar propostas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProposals = filter === 'all' 
    ? proposals 
    : proposals.filter(p => p.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Propostas</h1>
        <Link href="/proposals/new">
          <button className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nova Proposta
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex gap-2 mb-6">
          {['all', 'Rascunho', 'Enviada', 'Aprovada', 'Perdida'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'Todas' : status}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-500">Carregando propostas...</p>
        ) : filteredProposals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma proposta encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cliente</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Vendedor</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Data</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProposals.map((proposal) => (
                  <tr key={proposal.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{proposal.companyName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{proposal.sellerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(proposal.proposalDate).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        proposal.status === 'Rascunho' ? 'bg-yellow-100 text-yellow-800' :
                        proposal.status === 'Enviada' ? 'bg-blue-100 text-blue-800' :
                        proposal.status === 'Aprovada' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {proposal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <Link href={`/proposals/${proposal.id}`} className="text-primary hover:underline text-sm font-medium">
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
