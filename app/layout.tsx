import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Montador de Propostas — RD Station',
  description: 'Sistema automático de montagem de propostas comerciais',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-2 text-primary font-bold text-lg">
                <span className="text-2xl">📋</span>
                <span>Montador de Propostas</span>
              </Link>
              <div className="flex gap-6 text-sm font-medium">
                <Link href="/" className="text-gray-600 hover:text-primary transition-colors">Início</Link>
                <Link href="/proposals" className="text-gray-600 hover:text-primary transition-colors">Propostas</Link>
                <Link href="/proposals/new" className="bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-opacity-90 transition-colors">
                  + Nova Proposta
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
