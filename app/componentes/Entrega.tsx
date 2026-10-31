'use client';

import { useState } from 'react';
import examen from '../../examen.json';
import { correr, type Resultado } from '../../lib/pruebas';

const NOMBRES: Record<string, string> = {
  p1_lista:        'La lista llega del servidor y es la que se ve',
  p2_validacion:   'El servidor rechaza un título inválido',
  p3_se_actualiza: 'Al crear, la lista se actualiza sola',
  p4_marcar:       'Marcar una tarea como hecha responde bien',
  p5_en_vivo:      'El canal en vivo entrega mensajes',
  p6_portada:      'La portada reserva su espacio y no va en diferido',
  p7_contraste:    'El botón principal pasa 4.5 a 1',
};

async function firmar(cuerpo: string, token: string) {
  const bytes = new TextEncoder().encode(cuerpo);
  const llave = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(token),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const firma = await crypto.subtle.sign('HMAC', llave, bytes);
  return Array.from(new Uint8Array(firma))
    .map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function Entrega({
  crear, selloLista,
}: { crear: (t: string) => Promise<unknown>; selloLista: () => number }) {
  const [nombre, setNombre] = useState('');
  const [notas, setNotas] = useState('');
  const [fase, setFase] = useState<'listo' | 'corriendo' | 'ok' | 'error'>('listo');
  const [msj, setMsj] = useState('');
  const [res, setRes] = useState<Resultado | null>(null);
  const [respaldo, setRespaldo] = useState<string | null>(null);

  async function entregar() {
    if (nombre.trim().length < 3) { setMsj('Escribe tu nombre completo.'); return; }
    setFase('corriendo');
    setMsj('Corriendo las pruebas… toma unos 10 segundos.');

    const pruebas = await correr({ crear, selloLista });
    setRes(pruebas);

    try {
      const integridad: string =
        (await (await fetch('/api/integridad')).json()).sha256;

      // Se firma y se manda EXACTAMENTE esta cadena, con sus espacios.
      // El servidor tiene que leerla cruda o la firma no cuadra.
      const cuerpo = JSON.stringify(
        { nombre: nombre.trim(), pruebas, integridad, notas }, null, 2,
      );
      setRespaldo(cuerpo);

      const firma = await firmar(cuerpo, examen.token);
      const res = await fetch('/api/entrega', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-firma': firma },
        body: cuerpo,
      });
      if (!res.ok) throw new Error((await res.text()).slice(0, 200));

      setFase('ok');
      setMsj('Entregado. Ya quedó registrado.');
    } catch (e) {
      setFase('error');
      setMsj(e instanceof Error ? e.message : 'No se pudo entregar');
    }
  }

  function bajar() {
    const texto = respaldo ?? JSON.stringify({ nombre, res, notas }, null, 2);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([texto], { type: 'application/json' }));
    a.download = examen.carne + '-entrega.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
  }

  return (
    <section className="entrega">
      <h2>Entregar</h2>
      <p className="apagado">
        Corre las pruebas y manda el resultado. Puedes entregar las veces que
        quieras: se califica la última.
      </p>

      <div className="fila">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre completo"
          autoComplete="off"
        />
        <button className="boton" onClick={entregar} disabled={fase === 'corriendo'}>
          {fase === 'corriendo' ? 'Corriendo…' : 'Entregar'}
        </button>
      </div>

      <textarea
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
        placeholder="Opcional: si no lograste arreglar algo, cuéntame qué averiguaste."
        rows={3}
      />

      {msj ? <p className={fase === 'error' ? 'error' : 'apagado'}>{msj}</p> : null}

      {res ? (
        <ul className="resultados">
          {Object.entries(res).map(([k, v]) => (
            <li key={k} className={v ? 'si' : 'no'}>
              <span className="marca">{v ? '✓' : '✗'}</span>
              {NOMBRES[k] ?? k}
            </li>
          ))}
        </ul>
      ) : null}

      {res ? (
        <button className="boton secundario" onClick={bajar}>
          Descargar respaldo de mi entrega
        </button>
      ) : null}
    </section>
  );
}
