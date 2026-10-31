import { NextResponse } from 'next/server';
import { marcar } from '../../../../lib/datos';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cuerpo = (await req.json().catch(() => ({}))) as { hecha?: boolean };

  const tarea = marcar(id, cuerpo.hecha !== false);
  if (!tarea) return NextResponse.json({ error: 'No existe' }, { status: 404 });

  return NextResponse.json(tarea);
}
