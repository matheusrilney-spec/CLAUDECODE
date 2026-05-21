import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const proposals = await prisma.proposal.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        companyName: true,
        sellerName: true,
        proposalDate: true,
        status: true,
      },
    });

    return NextResponse.json(proposals);
  } catch (error) {
    console.error('Erro ao buscar propostas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar propostas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientInfo, ...rest } = body;

    const proposal = await prisma.proposal.create({
      data: {
        companyName: clientInfo.companyName,
        contactName: clientInfo.contactName,
        segment: clientInfo.segment,
        website: clientInfo.website,
        sellerName: clientInfo.sellerName,
        sellerEmail: clientInfo.sellerEmail,
        proposalDate: new Date(clientInfo.proposalDate),
        validUntil: new Date(clientInfo.validUntil),
        proposalType: clientInfo.proposalType,
        status: 'Rascunho',
      },
    });

    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar proposta:', error);
    return NextResponse.json(
      { error: 'Erro ao criar proposta' },
      { status: 500 }
    );
  }
}
