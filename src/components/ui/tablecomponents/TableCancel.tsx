// src/components/ui/tablecomponents/TableCancel.tsx

'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { TableCancelConfirmModal } from './TableCancelConfirmModal'

interface TableCancelProps {
  onClick?: () => void
  disabled?: boolean
}

export function TableCancel({ onClick, disabled }: TableCancelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleConfirm = () => {
    if (onClick) onClick()
    setIsModalOpen(false)
  }
  return (
    <>
      <button
        type='button'
        onClick={() => setIsModalOpen(true)}
        disabled={disabled}
        // --- PERBAIKAN: border-rose-200 sudah dihapus, murni pakai variabel danger ---
        className='flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border border-danger/30 bg-danger/10 text-danger hover:bg-danger/20 transition-colors outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm animate-in fade-in zoom-in-95 duration-200'
      >
        <X size={16} />
      </button>

      <TableCancelConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirm} />
    </>
  )
}
