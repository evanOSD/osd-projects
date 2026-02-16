// src/components/layout/shared/Toaster.tsx

'use client'

import { Toaster as HotToaster } from 'react-hot-toast'

const Toaster = () => {
  return (
    <HotToaster
      position='top-right'
      toastOptions={{
        duration: 5000,
        style: {
          background: 'var(--mui-palette-background-paper)',
          color: 'var(--mui-palette-text-primary)',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          fontWeight: 500,
          border: '1px solid var(--mui-palette-divider)'
        }
      }}
    />
  )
}

export default Toaster
