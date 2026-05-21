import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { renderTemplate, createDefaultTemplate } from '@/lib/templateRenderer';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { proposalId } = body;

    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        content: true,
        lineItems: true,
      },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposta não encontrada' },
        { status: 404 }
      );
    }

    const template = createDefaultTemplate();
    const context = {
      companyName: proposal.companyName,
      contactName: proposal.contactName,
      sellerName: proposal.sellerName,
      proposalDate: proposal.proposalDate.toLocaleDateString('pt-BR'),
      validUntil: proposal.validUntil.toLocaleDateString('pt-BR'),
      objectives: proposal.content?.objectives || '',
      problems: [],
      solutionSummary: proposal.content?.solution || '',
      lineItems: proposal.lineItems || [],
      nextSteps: proposal.content?.nextSteps || '',
      year: new Date().getFullYear(),
    };

    const html = renderTemplate(template, context);

    return NextResponse.json({
      html,
      filename: `proposta-${proposal.companyName}-${new Date().toISOString().split('T')[0]}.html`,
    });
  } catch (error) {
    console.error('Erro ao exportar HTML:', error);
    return NextResponse.json(
      { error: 'Erro ao exportar HTML' },
      { status: 500 }
    );
  }
}
