// src/components/ui/Toaster.tsx

'use client'

import { Toaster as HotToaster } from 'react-hot-toast'

export function Toaster() {
  return (
    <HotToaster
      position='top-center'
      toastOptions={{
        // Durasi default
        duration: 4000,
        // Styling dasar untuk kotak Toast-nya (Otomatis ikuti Light/Dark Mode)
        style: {
          background: 'hsl(var(--surface))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500'
        },
        // Styling spesifik untuk tipe Success
        success: {
          iconTheme: {
            primary: 'hsl(var(--success))',
            secondary: 'hsl(var(--success-foreground))'
          }
        },
        // Styling spesifik untuk tipe Error (Danger)
        error: {
          duration: 4000,
          iconTheme: {
            primary: 'hsl(var(--danger))',
            secondary: 'hsl(var(--danger-foreground))'
          }
        },
        // Styling spesifik untuk tipe Loading
        loading: {
          iconTheme: {
            primary: 'hsl(var(--primary))',
            secondary: 'hsl(var(--surface))'
          }
        }
      }}
    />
  )
}
