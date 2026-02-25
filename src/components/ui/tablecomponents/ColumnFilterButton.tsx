// src/components/ui/tablecomponents/ColumnFilterButton.tsx

'use client'

import { useState, useRef } from 'react'
import { Filter } from 'lucide-react'
import { Column } from '@tanstack/react-table'
import MainContentTooltip from '@/components/ui/MainContentTooltip'
import { PopOverColumnFilter } from './PopOverColumnFilter'

interface ColumnFilterButtonProps<TData, TValue> {
  column: Column<TData, TValue>
}

export function ColumnFilterButton<TData, TValue>({ column }: ColumnFilterButtonProps<TData, TValue>) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Ambil filter aktif untuk styling tombol
  const columnFilterValue = column.getFilterValue() as string
  const isActive = columnFilterValue !== undefined && columnFilterValue !== ''

  return (
    <>
      <MainContentTooltip content='Filter Kolom Spesifik'>
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(prev => !prev)}
          className={`p-1 cursor-pointer rounded-md transition-colors outline-none shrink-0 ${
            isActive ? 'bg-rose-300 text-primary hover:bg-rose-300' : 'bg-muted/0 hover:bg-muted/10 text-primary'
          }`}
        >
          <Filter size={18} />
        </button>
      </MainContentTooltip>

      <PopOverColumnFilter isOpen={isOpen} onClose={() => setIsOpen(false)} triggerRef={buttonRef} column={column} />
    </>
  )
}
