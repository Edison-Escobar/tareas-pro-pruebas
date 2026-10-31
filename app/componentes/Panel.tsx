'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Tarea } from '../../lib/datos';
import EnVivo from './EnVivo';
import Entrega from './Entrega';
import Formulario from './Formulario';
import Lista from './Lista';

async function traerTareas(): Promise<Tarea[]> {
  const res = await fetch('/api/tareas', { cache: 'no-store' });
  console.log('Consulta de tareas:', res.status, res.ok);

  if (!res.ok) throw new Error('No se pudo traer la lista');

  const datos = await res.json();
  console.log('Tareas recibidas:', datos);

  return datos;
}

export default function Panel() {
  const qc = useQueryClient();

  const consulta = useQuery({
    queryKey: ['tareas'],
    queryFn: traerTareas,
  });

  console.log('Estado TanStack:', {
    isPending: consulta.isPending,
    isError: consulta.isError,
    isSuccess: consulta.isSuccess,
    error: consulta.error,
    data: consulta.data,
  });

  const crear = useMutation({
    mutationFn: async (titulo: string) => {
      const res = await fetch('/api/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo }),
      });
      if (!res.ok) {
        const cuerpo = await res.json().catch(() => ({}));
        throw new Error(cuerpo.error ?? 'No se pudo crear');
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tareas'] });
    },
  });

  return (
    <section className="panel">
      <Formulario onCrear={(t) => crear.mutateAsync(t)} />

      {consulta.isPending
        ? <p className="apagado">Cargando…</p>
        : consulta.isError
          ? <p className="error">{(consulta.error as Error).message}</p>
          : <Lista tareas={consulta.data ?? []} />}

      <EnVivo />

      <Entrega
        crear={(t) => crear.mutateAsync(t)}
        selloLista={() => qc.getQueryState(['tareas'])?.dataUpdatedAt ?? 0}
      />
    </section>
  );
}
