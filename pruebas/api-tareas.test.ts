import { describe, it, expect, beforeEach } from 'vitest';
import { POST, GET } from '../app/api/tareas/route';
import { tareas } from '../lib/datos';

describe('Integración de la API de tareas', () => {
  beforeEach(() => {
    tareas.clear();
  });

  it('crea una tarea y permite consultarla mediante GET', async () => {
    const peticion = new Request('http://localhost/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'Preparar examen' }),
    });

    const respuestaPost = await POST(peticion);
    const tareaCreada = await respuestaPost.json();

    expect(respuestaPost.status).toBe(201);
    expect(tareaCreada.titulo).toBe('Preparar examen');

    const respuestaGet = await GET();
    const lista = await respuestaGet.json();

    expect(respuestaGet.status).toBe(200);
    expect(lista.some((t: { id: string }) => t.id === tareaCreada.id)).toBe(true);
  });

  it('rechaza una tarea inválida sin guardarla', async () => {
    const peticion = new Request('http://localhost/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'ab' }),
    });

    const respuesta = await POST(peticion);
    const cuerpo = await respuesta.json();

    expect(respuesta.status).toBe(400);
    expect(cuerpo.error).toBe('Mínimo 3 caracteres');
    expect(tareas.size).toBe(0);
  });
});
