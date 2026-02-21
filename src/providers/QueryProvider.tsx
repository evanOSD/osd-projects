// src/providers/QueryProvider.tsx

'use client';

import { useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Kita simpan QueryClient di dalam useState agar tidak ter-reset 
  // setiap kali berpindah halaman di Next.js
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
