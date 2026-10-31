'use client';

import { useState, type FormEvent } from 'react';
import { crearTarea } from '../../lib/esquemas';

export default function Formulario({
  onCrear,
}: { onCrear: (titulo: string) => Promise<unknown> }) {
  const [titulo, setTitulo] = useState('');
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const revisado = crearTarea.safeParse({ titulo });
    if (!revisado.success) {
      setAviso(revisado.error.issues[0]?.message ?? 'Título inválido');
      return;
    }
    setAviso(null);
    setEnviando(true);
    try {
      await onCrear(revisado.data.titulo);
      setTitulo('');
    } catch (err) {
      setAviso(err instanceof Error ? err.message : 'No se pudo crear');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="forma" onSubmit={enviar}>
      <label className="etiqueta" htmlFor="titulo">Nueva tarea</label>
      <div className="fila">
        <input
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Mínimo 3 caracteres"
          autoComplete="off"
        />
        <button className="boton" data-prueba="accion" type="submit" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Agregar'}
        </button>
      </div>
      {aviso ? <p className="error" role="alert">{aviso}</p> : null}
    </form>
  );
}
