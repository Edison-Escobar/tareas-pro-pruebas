import { describe, it, expect } from 'vitest';
import { crearTarea } from '../lib/esquemas';

describe('Validación de tareas', () => {
  it('rechaza títulos con menos de 3 caracteres', () => {
    const resultado = crearTarea.safeParse({ titulo: 'ab' });

    expect(resultado.success).toBe(false);
  });

  it('acepta títulos válidos y elimina espacios innecesarios', () => {
    const resultado = crearTarea.safeParse({ titulo: '  Estudiar pruebas  ' });

    expect(resultado.success).toBe(true);

    if (resultado.success) {
      expect(resultado.data.titulo).toBe('Estudiar pruebas');
    }
  });

  it('rechaza títulos con más de 80 caracteres', () => {
    const resultado = crearTarea.safeParse({ titulo: 'a'.repeat(81) });

    expect(resultado.success).toBe(false);
  });
});
