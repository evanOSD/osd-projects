// src/components/ui/tablecomponents/TableUnsavedChanges.tsx

'use client'

import { AlertCircle } from 'lucide-react'

interface TableUnsavedChangesProps {
  count?: number
}

export function TableUnsavedChanges({ count = 0 }: TableUnsavedChangesProps) {
  if (count === 0) return null

  return (
    <div className='flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-warning/50 text-warning-foreground border border-warning/20 animate-in fade-in zoom-in-95'>
      <AlertCircle size={14} />
      <span>{count} perubahan belum disimpan</span>
    </div>
  )
}
