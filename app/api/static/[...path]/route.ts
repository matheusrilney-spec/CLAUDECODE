import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  _request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = path.join(process.cwd(), 'data', ...params.path);
    if (!filePath.startsWith(path.join(process.cwd(), 'data'))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const ext = path.extname(filePath);
    const contentType = ext === '.json' ? 'application/json' : 'text/plain';

    return new NextResponse(content, {
      headers: { 'Content-Type': contentType },
    });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
