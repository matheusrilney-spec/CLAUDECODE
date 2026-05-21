import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { renderProposalTemplate } from '@/lib/templateRenderer';
import { formatCurrency } from '@/lib/formatCurrency';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { proposalId } = body;

    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { content: true, lineItems: true },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposta não encontrada' }, { status: 404 });
    }

    const diagnosis = proposal.content?.problems
      ? {
          objectives: proposal.content.objectives,
          problems: JSON.parse(proposal.content.problems),
          impact: null,
          risks: null,
        }
      : null;

    const solution = proposal.content?.solution ? JSON.parse(proposal.content.solution) : null;
    const useCases = proposal.content?.useCases ? JSON.parse(proposal.content.useCases) : null;
    const roi = proposal.content?.roi ? JSON.parse(proposal.content.roi) : null;
    const roadmap = proposal.content?.roadmap ? JSON.parse(proposal.content.roadmap) : null;
    const nextStepsRaw = proposal.content?.nextSteps
      ? JSON.parse(proposal.content.nextSteps)
      : null;

    const hasRdConversas = proposal.lineItems.some(
      (li) => li.productFamily?.includes('Conversas') || li.productName?.includes('Conversas')
    );

    let totalMonthlyPromo = 0;
    let totalMonthlyStandard = 0;
    let totalImplementation = 0;
    let totalEconomy = 0;

    const lineItemsCtx = proposal.lineItems.map((li) => {
      const tableTotal = li.tablePrice * li.quantity;
      const promoPrice = li.promotionalPrice ?? tableTotal - li.discountAmount;
      const standardPrice = li.standardPriceAfterPromo ?? tableTotal;

      if (li.billingType === 'one-time') {
        totalImplementation += tableTotal;
      } else {
        totalMonthlyPromo += promoPrice;
        totalMonthlyStandard += standardPrice;
        if (li.promotionalMonths > 0) {
          totalEconomy += (tableTotal - promoPrice) * li.promotionalMonths;
        }
      }

      return {
        ...li,
        tablePriceFmt: formatCurrency(tableTotal),
        promoFmt: formatCurrency(promoPrice),
        standardFmt: formatCurrency(standardPrice),
      };
    });

    const nextSteps = nextStepsRaw
      ? {
          ...nextStepsRaw,
          scheduledDate: nextStepsRaw.scheduledDate
            ? new Date(nextStepsRaw.scheduledDate).toLocaleDateString('pt-BR')
            : undefined,
        }
      : null;

    const context = {
      companyName: proposal.companyName,
      contactName: proposal.contactName,
      sellerName: proposal.sellerName,
      sellerEmail: proposal.sellerEmail,
      proposalDate: proposal.proposalDate.toLocaleDateString('pt-BR'),
      validUntil: proposal.validUntil.toLocaleDateString('pt-BR'),
      proposalType: proposal.proposalType,
      diagnosis,
      solution,
      useCases: useCases?.length ? useCases : null,
      roi: roi?.cards?.length ? roi : null,
      lineItems: lineItemsCtx.length ? lineItemsCtx : null,
      roadmap: roadmap?.length ? roadmap : null,
      nextSteps,
      hasRdConversas,
      summary: {
        totalMonthlyPromo,
        totalMonthlyStandard,
        totalImplementation,
        totalEconomy,
        totalMonthlyPromoFmt: formatCurrency(totalMonthlyPromo),
        totalMonthlyStandardFmt: formatCurrency(totalMonthlyStandard),
        totalImplementationFmt: formatCurrency(totalImplementation),
        totalEconomyFmt: formatCurrency(totalEconomy),
      },
    };

    const html = renderProposalTemplate(context);
    const slug = proposal.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const date = proposal.proposalDate.toISOString().split('T')[0];

    return NextResponse.json({
      html,
      filename: `proposta-${slug}-${date}.html`,
    });
  } catch (error) {
    console.error('Erro ao exportar HTML:', error);
    return NextResponse.json({ error: 'Erro ao exportar HTML' }, { status: 500 });
  }
}
