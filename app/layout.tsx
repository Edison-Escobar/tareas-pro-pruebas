import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import Proveedores from './proveedores';

export const metadata: Metadata = {
  title: 'Tareas Pro · Examen Parcial II',
  description: 'Programación IV · USPG',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Proveedores>{children}</Proveedores>
      </body>
    </html>
  );
}
