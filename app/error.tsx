'use client';

export default function Error({
  error, reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="caja">
      <h1>Algo salió mal</h1>
      <p className="apagado">{error.message}</p>
      <button className="boton" onClick={() => reset()}>Reintentar</button>
    </main>
  );
}
