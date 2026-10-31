import { Buffer } from 'node:buffer';
import { createHmac, timingSafeEqual } from 'node:crypto';
import examen from '../../../examen.json';
import { supabaseServidor } from '../../../lib/supabase';

export const dynamic = 'force-dynamic';

type Cuerpo = {
  nombre: string;
  pruebas: Record<string, boolean>;
  integridad: string;
  notas?: string;
};

export async function POST(req: Request) {
  // El cuerpo CRUDO, tal como llegó. Si lo parseas y lo vuelves a armar,
  // la firma deja de cuadrar: es exactamente lo que pasa con los webhooks.
  const crudo = await req.text();
  const recibida = req.headers.get('x-firma') ?? '';
  const esperada = createHmac('sha256', examen.token).update(crudo).digest('hex');

  const a = Buffer.from(recibida, 'utf8');
  const b = Buffer.from(esperada, 'utf8');
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return Response.json({ error: 'Firma inválida' }, { status: 400 });
  }

  let datos: Cuerpo;
  try { datos = JSON.parse(crudo) as Cuerpo; }
  catch { return Response.json({ error: 'Cuerpo ilegible' }, { status: 400 }); }

  const sb = supabaseServidor();
  const { error } = await sb.from('entregas').insert({
    carne: examen.carne,
    nombre: datos.nombre,
    token: examen.token,
    variante: examen.variante,
    integridad: datos.integridad,
    pruebas: datos.pruebas,
    notas: datos.notas ?? null,
  });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
