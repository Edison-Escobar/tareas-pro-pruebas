import { NextResponse } from 'next/server';
import { agregar, listar } from '../../../lib/datos';
import { crearTarea } from '../../../lib/esquemas';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(listar());
}

export async function POST(req: Request) {
  const cuerpo = await req.json().catch(() => null);

  // El navegador es comodidad; esta línea es la integridad de los datos.
  const revisado = crearTarea.safeParse(cuerpo);
  if (!revisado.success) {
    return NextResponse.json(
      { error: revisado.error.issues[0]?.message ?? 'Datos inválidos' },
      { status: 400 },
    );
  }

  const tarea = agregar(revisado.data.titulo);
  return NextResponse.json(tarea, { status: 201 });
}
