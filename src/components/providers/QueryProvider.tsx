// src/components/providers/QueryProvider.tsx

'use client'

import { QueryClient, QueryClientProvider, MutationCache } from '@tanstack/react-query'
import { useState } from 'react'
import { useError } from '@/context/ErrorContext'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const { showError } = useError()

  const [queryClient] = useState(
    () =>
      new QueryClient({
        // JARING PENANGKAP ERROR GLOBAL
        mutationCache: new MutationCache({
          onError: (error: any) => {
            // Memanggil fungsi dari ErrorContext untuk memunculkan Modal
            showError(error.message || 'Terjadi kesalahan sistem yang tidak diketahui.')
          }
        }),
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false
          }
        }
      })
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
