// src/components/ui/tablecomponents/TableSave.tsx

'use client'

import { Save, Loader2 } from 'lucide-react'

interface TableSaveProps {
  onClick?: () => void
  isLoading?: boolean
  disabled?: boolean
}

export function TableSave({ onClick, isLoading = false, disabled = false }: TableSaveProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled || isLoading}
      // --- PERBAIKAN TEMA: Gunakan bg-success dan text-success-foreground ---
      className='flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-success text-success-foreground hover:bg-success/80 disabled:bg-muted/50 disabled:cursor-not-allowed transition-colors outline-none shadow-sm cursor-pointer'
    >
      {isLoading ? <Loader2 size={16} className='animate-spin' /> : <Save size={16} />}
      <span className='hidden sm:inline-block'>{isLoading ? 'Menyimpan...' : 'Simpan'}</span>
    </button>
  )
}
