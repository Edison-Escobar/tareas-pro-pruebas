/* Salida de emergencia.
   Si la aplicación ni siquiera compila y no puedes presionar «Entregar»
   en pantalla, corre:  pnpm entregar
   Registra que estuviste aquí, con todas las pruebas en falso y tus notas.
   Vale menos que entregar bien, pero vale más que no entregar nada. */

import { createHash, createHmac } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';

const examen = JSON.parse(await readFile(new URL('../examen.json', import.meta.url), 'utf8'));
const env = Object.fromEntries(
  (await readFile(new URL('../.env.local', import.meta.url), 'utf8'))
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]),
);

const rl = createInterface({ input: process.stdin, output: process.stdout });
const nombre = (await rl.question('Tu nombre completo: ')).trim();
const notas  = (await rl.question('¿Qué alcanzaste a arreglar? ')).trim();
rl.close();

const fuente = await readFile(new URL('../lib/pruebas.ts', import.meta.url), 'utf8');
const integridad = createHash('sha256').update(fuente).digest('hex');

const fila = {
  carne: examen.carne,
  nombre,
  token: examen.token,
  variante: examen.variante,
  integridad,
  pruebas: { entregado_por_consola: true },
  notas,
};

const res = await fetch(env.SUPABASE_URL.replace(/\/+$/, '') + '/rest/v1/entregas', {
  method: 'POST',
  headers: {
    // Solo apikey: las llaves publishable no son JWT.
    apikey: env.SUPABASE_PUBLISHABLE_KEY,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal',
  },
  body: JSON.stringify(fila),
});

console.log(res.ok ? '\nRegistrado.' : '\nFalló: ' + res.status + ' ' + (await res.text()));
// createHmac queda importado a propósito: por consola no hay firma que verificar.
void createHmac;
