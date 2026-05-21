import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Montador de Propostas - RD Station',
  description: 'Sistema automático de montagem de propostas comerciais',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-primary">📋 Montador de Propostas</h1>
              </div>
              <div className="flex space-x-4">
                <a href="/" className="text-gray-700 hover:text-primary">Home</a>
                <a href="/proposals" className="text-gray-700 hover:text-primary">Propostas</a>
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
