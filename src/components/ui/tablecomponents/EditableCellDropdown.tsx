// src/components/ui/tablecomponents/EditableCellDropdown.tsx

'use client'

import { useState, useRef } from 'react'
import { Row, Column, Table } from '@tanstack/react-table'
import { Check } from 'lucide-react'
import { PopoverCalculator } from './PopoverCalculator'

interface EditableCellDropdownProps<TData, TValue> {
  getValue: () => TValue
  row: Row<TData>
  column: Column<TData, TValue>
  table: Table<TData>
  options: string[]
  displayComponent?: React.ReactNode
  className?: string
}

export function EditableCellDropdown<TData, TValue>({
  getValue,
  row,
  column,
  table,
  options,
  displayComponent,
  className = ''
}: EditableCellDropdownProps<TData, TValue>) {
  const initialValue = getValue()
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)

  const handleSelect = (val: string) => {
    if (val !== initialValue) {
      // --- PERBAIKAN DI SINI: Tambahkan (as any) pada meta ---
      ;(table.options.meta as any)?.updateData(row.index, column.id, val)
    }
    setIsOpen(false)
  }

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        className={`cursor-pointer w-full h-full min-h-6 px-1 -mx-1 rounded hover:bg-muted/10 transition-colors flex items-center ${className}`}
      >
        {displayComponent !== undefined ? displayComponent : (initialValue as React.ReactNode)}
      </div>

      <PopoverCalculator
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        triggerRef={triggerRef}
        className='w-48 p-1.5 bg-surface border border-border rounded-xl shadow-xl flex flex-col gap-0.5 animate-in fade-in zoom-in-95'
      >
        {options.map(opt => {
          const isSelected = initialValue === opt
          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              className='flex items-center gap-2.5 w-full px-2 py-1.5 text-sm rounded-md transition-colors cursor-pointer hover:bg-primary/20 hover:text-primary group outline-none'
            >
              <div
                className={`flex items-center justify-center w-4 h-4 rounded-sm border transition-colors ${isSelected ? 'bg-primary border-primary text-foreground' : 'border-muted-foreground/30 bg-background group-hover:border-primary'}`}
              >
                {isSelected && <Check size={12} strokeWidth={3} />}
              </div>
              <span className='truncate'>{opt}</span>
            </button>
          )
        })}
      </PopoverCalculator>
    </>
  )
}
