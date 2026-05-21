import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: params.id },
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

    return NextResponse.json(proposal);
  } catch (error) {
    console.error('Erro ao buscar proposta:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar proposta' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const proposal = await prisma.proposal.update({
      where: { id: params.id },
      data: body,
      include: {
        content: true,
        lineItems: true,
      },
    });

    return NextResponse.json(proposal);
  } catch (error) {
    console.error('Erro ao atualizar proposta:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar proposta' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.proposal.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar proposta:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar proposta' },
      { status: 500 }
    );
  }
}
