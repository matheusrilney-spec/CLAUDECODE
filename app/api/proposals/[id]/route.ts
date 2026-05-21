import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: params.id },
      include: { content: true, lineItems: true },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposta não encontrada' }, { status: 404 });
    }

    return NextResponse.json(proposal);
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return NextResponse.json({ error: 'Erro ao buscar proposta' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { clientInfo, diagnosis, solution, useCases, roi, lineItems, roadmap, nextSteps, status } = body;

    const existing = await prisma.proposal.findUnique({
      where: { id: params.id },
      include: { content: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Proposta não encontrada' }, { status: 404 });
    }

    await prisma.proposalLineItem.deleteMany({ where: { proposalId: params.id } });

    const proposal = await prisma.proposal.update({
      where: { id: params.id },
      data: {
        companyName: clientInfo?.companyName ?? existing.companyName,
        contactName: clientInfo?.contactName ?? existing.contactName,
        segment: clientInfo?.segment ?? existing.segment,
        website: clientInfo?.website ?? existing.website,
        sellerName: clientInfo?.sellerName ?? existing.sellerName,
        sellerEmail: clientInfo?.sellerEmail ?? existing.sellerEmail,
        proposalDate: clientInfo?.proposalDate ? new Date(clientInfo.proposalDate) : existing.proposalDate,
        validUntil: clientInfo?.validUntil ? new Date(clientInfo.validUntil) : existing.validUntil,
        proposalType: clientInfo?.proposalType ?? existing.proposalType,
        status: status ?? existing.status,
        content: {
          upsert: {
            create: {
              objectives: diagnosis?.objectives ?? null,
              problems: diagnosis?.problems ? JSON.stringify(diagnosis.problems) : null,
              solution: solution ? JSON.stringify(solution) : null,
              useCases: useCases ? JSON.stringify(useCases) : null,
              roi: roi ? JSON.stringify(roi) : null,
              roadmap: roadmap ? JSON.stringify(roadmap) : null,
              nextSteps: nextSteps ? JSON.stringify(nextSteps) : null,
            },
            update: {
              objectives: diagnosis?.objectives ?? existing.content?.objectives,
              problems: diagnosis?.problems ? JSON.stringify(diagnosis.problems) : existing.content?.problems,
              solution: solution ? JSON.stringify(solution) : existing.content?.solution,
              useCases: useCases ? JSON.stringify(useCases) : existing.content?.useCases,
              roi: roi ? JSON.stringify(roi) : existing.content?.roi,
              roadmap: roadmap ? JSON.stringify(roadmap) : existing.content?.roadmap,
              nextSteps: nextSteps ? JSON.stringify(nextSteps) : existing.content?.nextSteps,
            },
          },
        },
        lineItems: lineItems
          ? {
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
            }
          : undefined,
      },
      include: { content: true, lineItems: true },
    });

    return NextResponse.json(proposal);
  } catch (error) {
    console.error('Error updating proposal:', error);
    return NextResponse.json({ error: 'Erro ao atualizar proposta' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.proposal.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting proposal:', error);
    return NextResponse.json({ error: 'Erro ao deletar proposta' }, { status: 500 });
  }
}
