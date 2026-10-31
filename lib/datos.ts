// Almacén en memoria. No hay base de datos local a propósito: lo único que
// viaja a Supabase es tu entrega final.

export type Tarea = {
  id: string;
  titulo: string;
  hecha: boolean;
  creada: number;
};

type Oyente = (t: Tarea) => void;

const g = globalThis as unknown as {
  __tareas?: Map<string, Tarea>;
  __oyentes?: Set<Oyente>;
};

if (!g.__tareas) {
  g.__tareas = new Map();
  const semilla = ['Revisar el PR de pagos', 'Escribir las pruebas del webhook', 'Medir el LCP de la portada'];
  semilla.forEach((titulo, i) => {
    const id = 't' + (i + 1);
    g.__tareas!.set(id, { id, titulo, hecha: false, creada: Date.now() - (3 - i) * 60000 });
  });
}
if (!g.__oyentes) g.__oyentes = new Set();

export const tareas = g.__tareas!;
const oyentes = g.__oyentes!;

export function listar(): Tarea[] {
  return Array.from(tareas.values()).sort((a, b) => b.creada - a.creada);
}

export function agregar(titulo: string): Tarea {
  const t: Tarea = {
    id: 't' + Math.random().toString(36).slice(2, 9),
    titulo,
    hecha: false,
    creada: Date.now(),
  };
  tareas.set(t.id, t);
  avisar(t);
  return t;
}

export function marcar(id: string, hecha: boolean): Tarea | null {
  const t = tareas.get(id);
  if (!t) return null;
  t.hecha = hecha;
  avisar(t);
  return t;
}

export function escuchar(fn: Oyente): () => void {
  oyentes.add(fn);
  return () => { oyentes.delete(fn); };
}

function avisar(t: Tarea) {
  oyentes.forEach((fn) => { try { fn(t); } catch { /* un oyente roto no tumba a los demás */ } });
}
