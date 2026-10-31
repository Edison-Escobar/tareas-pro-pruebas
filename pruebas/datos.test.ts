import { describe, it, expect, beforeEach } from 'vitest';
import { tareas, agregar, listar, marcar, escuchar } from '../lib/datos';

describe('Gestión de tareas', () => {
  beforeEach(() => {
    tareas.clear();
  });

  it('agrega una tarea con estado pendiente', () => {
    const tarea = agregar('Estudiar Vitest');

    expect(tarea.titulo).toBe('Estudiar Vitest');
    expect(tarea.hecha).toBe(false);
    expect(tareas.has(tarea.id)).toBe(true);
  });

  it('lista las tareas registradas', () => {
    agregar('Primera tarea');
    agregar('Segunda tarea');

    const resultado = listar();

    expect(resultado).toHaveLength(2);
    expect(resultado.map((t) => t.titulo)).toContain('Primera tarea');
    expect(resultado.map((t) => t.titulo)).toContain('Segunda tarea');
  });

  it('marca una tarea como completada', () => {
    const tarea = agregar('Terminar pruebas');

    const resultado = marcar(tarea.id, true);

    expect(resultado?.hecha).toBe(true);
  });

  it('devuelve null cuando la tarea no existe', () => {
    const resultado = marcar('no-existe', true);

    expect(resultado).toBeNull();
  });
});

  it('notifica a los oyentes cuando se agrega una tarea', () => {
    let notificacion = '';
    const cancelar = escuchar((tarea) => {
      notificacion = tarea.titulo;
    });

    agregar('Probar notificaciones');

    expect(notificacion).toBe('Probar notificaciones');
    cancelar();
  });

  it('deja de notificar después de cancelar la suscripción', () => {
    let notificaciones = 0;
    const cancelar = escuchar(() => {
      notificaciones++;
    });

    cancelar();
    agregar('Tarea sin notificación');

    expect(notificaciones).toBe(0);
  });

