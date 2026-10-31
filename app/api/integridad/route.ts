import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const ruta = path.join(process.cwd(), 'lib', 'pruebas.ts');
  const texto = await readFile(ruta, 'utf8');
  const sha256 = createHash('sha256').update(texto).digest('hex');
  return Response.json({ sha256 });
}
