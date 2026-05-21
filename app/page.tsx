'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Plus, FileText } from 'lucide-react';

interface Proposal {
  id: string;
  companyName: string;
  sellerName: string;
  proposalDate: string;
  status: string;
}

export default function Home() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Montador de Propostas</h1>
        <p className="text-xl mb-8">Crie propostas comerciais automaticamente em minutos</p>
        <Link href="/proposals/new">
          <button className="bg-white text-primary font-bold px-8 py-3 rounded-lg inline-flex items-center gap-2 hover:bg-gray-100">
            <Plus className="w-5 h-5" />
            Nova Proposta
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card text-center">
          <FileText className="w-12 h-12 mx-auto text-primary mb-4" />
          <h3 className="text-lg font-bold mb-2">Rápido</h3>
          <p className="text-gray-600">Crie propostas em minutos, não horas</p>
        </div>
        <div className="card text-center">
          <FileText className="w-12 h-12 mx-auto text-primary mb-4" />
          <h3 className="text-lg font-bold mb-2">Consistente</h3>
          <p className="text-gray-600">Padrão visual uniforme em todas as propostas</p>
        </div>
        <div className="card text-center">
          <FileText className="w-12 h-12 mx-auto text-primary mb-4" />
          <h3 className="text-lg font-bold mb-2">Inteligente</h3>
          <p className="text-gray-600">Cálculos automáticos e preços atualizados</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Últimas Propostas</h2>
          <Link href="/proposals" className="text-primary hover:underline inline-flex items-center gap-1">
            Ver todas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500">Carregando propostas...</p>
        ) : proposals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhuma proposta criada ainda</p>
            <Link href="/proposals/new">
              <button className="btn-primary inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Criar primeira proposta
              </button>
            </Link>
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
                {proposals.slice(0, 5).map((proposal) => (
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
                    <td className="px-6 py-4 text-right">
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
