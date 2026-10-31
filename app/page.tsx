import Image from 'next/image';
import examen from '../examen.json';
import Panel from './componentes/Panel';

export default function Page() {
  return (
    <main className="caja">
      {/* FIX: La portada debe usar next/image donde reserva su espacio y asi se pueda
      cargar como prioridad. */}
      <Image
        src="/portada.jpg"
        alt="Escritorio con notas y una laptop"
        data-prueba="portada"
        className="portada"
        width={1200}
        height={675}
        priority
      />

      <header className="encabezado">
        <h1>Tareas Pro</h1>
        <p className="apagado">
          Examen Parcial II · carné {examen.carne} · variante {examen.variante}
        </p>
      </header>

      <Panel />
    </main>
  );
}