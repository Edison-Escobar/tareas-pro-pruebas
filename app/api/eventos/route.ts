import { escuchar, type Tarea } from '../../../lib/datos';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cod = new TextEncoder();
  let quitar: (() => void) | undefined;
  let latido: ReturnType<typeof setInterval> | undefined;

  const flujo = new ReadableStream({
    start(c) {
      const enviar = (dato: unknown) => {
        // FIX: El canal debía declararse como SSE; text impedía que
        // el EventSource interpretara la respuesta como eventos en vivo.
        c.enqueue(cod.encode(`data: ${JSON.stringify(dato)}\n\n`));
      };

      enviar({ tipo: 'conectado', en: Date.now() });
      latido = setInterval(() => enviar({ tipo: 'latido', en: Date.now() }), 2000);
      quitar = escuchar((t: Tarea) => enviar({ tipo: 'tarea', tarea: t }));
    },
    cancel() {
      if (latido) clearInterval(latido);
      quitar?.();
    },
  });

  return new Response(flujo, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}