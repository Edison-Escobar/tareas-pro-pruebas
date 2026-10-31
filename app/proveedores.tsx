//FIX Agregue el 'use client'; para poder levantar el local host.

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

export default function Proveedores({ children }: { children: ReactNode }) {
  const [cliente] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 5000, retry: 1 } } }),
  );
  return <QueryClientProvider client={cliente}>{children}</QueryClientProvider>;
}
