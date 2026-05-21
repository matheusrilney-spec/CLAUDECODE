import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const proposals = await prisma.proposal.findMany({
      orderBy: { createdAt: 'desc' },
      include: { lineItems: true },
    });

    return NextResponse.json(
      proposals.map((p) => ({
        id: p.id,
        companyName: p.companyName,
        contactName: p.contactName,
        sellerName: p.sellerName,
        sellerEmail: p.sellerEmail,
        proposalDate: p.proposalDate,
        validUntil: p.validUntil,
        status: p.status,
        proposalType: p.proposalType,
        monthlyTotal: p.lineItems
          .filter((li) => li.billingType === 'monthly' || li.billingType === 'addon')
          .reduce((sum, li) => sum + li.tablePrice * li.quantity, 0),
        implementationTotal: p.lineItems
          .filter((li) => li.billingType === 'one-time')
          .reduce((sum, li) => sum + li.tablePrice * li.quantity, 0),
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }))
    );
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json({ error: 'Erro ao buscar propostas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientInfo, diagnosis, solution, useCases, roi, lineItems, roadmap, nextSteps } = body;

    if (!clientInfo?.companyName) {
      return NextResponse.json({ error: 'Nome da empresa é obrigatório' }, { status: 400 });
    }
    if (!lineItems || lineItems.length === 0) {
      return NextResponse.json({ error: 'Selecione pelo menos um produto' }, { status: 400 });
    }

    const invalidProduct = lineItems.find(
      (li: { tablePrice: number; productId: string }) => !li.tablePrice || li.tablePrice <= 0
    );
    if (invalidProduct) {
      return NextResponse.json(
        { error: `Preço não encontrado para: ${invalidProduct.productName || invalidProduct.productId}. Revise os produtos selecionados.` },
        { status: 400 }
      );
    }

    const proposal = await prisma.proposal.create({
      data: {
        companyName: clientInfo.companyName,
        contactName: clientInfo.contactName,
        segment: clientInfo.segment || null,
        website: clientInfo.website || null,
        sellerName: clientInfo.sellerName,
        sellerEmail: clientInfo.sellerEmail,
        proposalDate: new Date(clientInfo.proposalDate),
        validUntil: new Date(clientInfo.validUntil),
        proposalType: clientInfo.proposalType || 'Produto único',
        status: 'Rascunho',
        content: {
          create: {
            objectives: diagnosis?.objectives || null,
            problems: diagnosis?.problems ? JSON.stringify(diagnosis.problems) : null,
            solution: solution ? JSON.stringify(solution) : null,
            useCases: useCases ? JSON.stringify(useCases) : null,
            roi: roi ? JSON.stringify(roi) : null,
            roadmap: roadmap ? JSON.stringify(roadmap) : null,
            nextSteps: nextSteps ? JSON.stringify(nextSteps) : null,
          },
        },
        lineItems: {
          create: lineItems.map((li: Record<string, unknown>) => ({
            productId: String(li.productId),
            productName: String(li.productName),
            productFamily: li.productFamily ? String(li.productFamily) : null,
            plan: String(li.plan || ''),
            metric: String(li.metric || ''),
            quantity: Number(li.quantity || 1),
            tablePrice: Number(li.tablePrice || 0),
            discountPercent: Number(li.discountPercent || 0),
            discountAmount: Number(li.discountAmount || 0),
            promotionalPrice: li.promotionalPrice ? Number(li.promotionalPrice) : null,
            promotionalMonths: Number(li.promotionalMonths || 0),
            standardPriceAfterPromo: li.standardPriceAfterPromo
              ? Number(li.standardPriceAfterPromo)
              : null,
            billingType: String(li.billingType || 'monthly'),
            notes: li.notes ? String(li.notes) : null,
          })),
        },
      },
      include: { content: true, lineItems: true },
    });

    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json({ error: 'Erro ao criar proposta' }, { status: 500 });
  }
}
