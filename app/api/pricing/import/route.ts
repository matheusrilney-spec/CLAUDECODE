import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo não fornecido' },
        { status: 400 }
      );
    }

    // TODO: Implement pricing import logic
    // This will be implemented with XLSX parsing

    return NextResponse.json(
      { error: 'Importação ainda não implementada' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Erro ao importar preços:', error);
    return NextResponse.json(
      { error: 'Erro ao importar preços' },
      { status: 500 }
    );
  }
}
