'use client';

import type { Tarea } from '../../lib/datos';

export default function Lista({ tareas }: { tareas: Tarea[] }) {
  if (tareas.length === 0) return <p className="apagado">Todavía no hay tareas.</p>;

  return (
    <ul className="lista" data-prueba="lista">
      {tareas.map((t) => (
        <li key={t.id} data-tarea={t.id} className={t.hecha ? 'hecha' : ''}>
          <span className="titulo">{t.titulo}</span>
          {t.hecha ? <span className="sello">hecha</span> : null}
        </li>
      ))}
    </ul>
  );
}
