'use client';

import { useEffect, useState } from 'react';

export default function EnVivo() {
  const [ultimo, setUltimo] = useState('conectando…');

  useEffect(() => {
    const fuente = new EventSource('/api/eventos');

    fuente.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data);
        setUltimo(
          d.tipo === 'tarea'
            ? 'nueva: ' + d.tarea.titulo
            : 'canal vivo · ' + new Date(d.en).toLocaleTimeString(),
        );
      } catch { setUltimo('mensaje ilegible'); }
    };
    fuente.onerror = () => setUltimo('canal caído');

    // Sin esta limpieza, cada montaje abre otra conexión y ninguna se cierra.
    return () => fuente.close();
  }, []);

  return <p className="vivo" data-prueba="vivo">{ultimo}</p>;
}
