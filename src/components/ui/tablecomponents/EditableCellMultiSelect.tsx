// src/components/ui/tablecomponents/EditableCellMultiSelect.tsx

'use client'

import { useState, useRef } from 'react'
import { Row, Column, Table } from '@tanstack/react-table'
import { Check, X, Plus } from 'lucide-react'
import { PopoverCalculator } from './PopoverCalculator'
import { Badge } from '@/components/ui/Badge'

interface EditableCellMultiSelectProps<TData, TValue> {
  getValue: () => TValue
  row: Row<TData>
  column: Column<TData, TValue>
  table: Table<TData>
  options: string[]
  className?: string
}

export function EditableCellMultiSelect<TData, TValue>({
  getValue,
  row,
  column,
  table,
  options,
  className = ''
}: EditableCellMultiSelectProps<TData, TValue>) {
  // Pastikan nilai awal selalu array. Jika null/undefined, jadikan []
  const rawValue = getValue()
  const currentValues: string[] = Array.isArray(rawValue) ? rawValue : []
  
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)

  const toggleOption = (opt: string) => {
    let newValues: string[]
    if (currentValues.includes(opt)) {
      newValues = currentValues.filter(v => v !== opt) // Hapus jika sudah ada
    } else {
      newValues = [...currentValues, opt] // Tambah jika belum ada
    }
    // Kirim array baru ke mesin penyimpan data
    ;(table.options.meta as any)?.updateData(row.index, column.id, newValues)
  }

  const removeOption = (e: React.MouseEvent, opt: string) => {
    e.stopPropagation() // Cegah Popover terbuka saat klik (x)
    const newValues = currentValues.filter(v => v !== opt)
    ;(table.options.meta as any)?.updateData(row.index, column.id, newValues)
  }

  return (
    <>
      {/* MODE BACA / TRIGGER: Menampilkan deretan Badge */}
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        className={`cursor-pointer w-full min-h-7 px-1 -mx-1 py-1 rounded hover:bg-muted/10 transition-colors flex flex-wrap items-center gap-1.5 ${className}`}
      >
        {currentValues.length === 0 ? (
          <span className='text-sm text-muted-foreground/50 italic px-1 flex items-center gap-1'>
            <Plus size={12} /> Pilih opsi...
          </span>
        ) : (
          currentValues.map(val => (
            <Badge key={val} variant='secondary' className='text-[13px] px-1.5 py-0 h-5 font-medium flex items-center gap-1 bg-primary/10 text-primary hover:bg-primary/20 hover:text-foreground transition-colors border-primary/20'>
              {val}
              <button 
                onClick={(e) => removeOption(e, val)}
                className='opacity-50 hover:opacity-100 hover:text-danger cursor-pointer rounded-full focus:outline-none'
              >
                <X size={10} strokeWidth={3} />
              </button>
            </Badge>
          ))
        )}
      </div>

      {/* POPOVER MULTI-SELECT */}
      <PopoverCalculator
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        triggerRef={triggerRef}
        className='w-56 p-1.5 bg-surface border border-border rounded-xl shadow-xl flex flex-col gap-0.5 animate-in fade-in zoom-in-95 z-50'
      >
        <div className='px-2 py-1.5 text-[13px] font-semibold text-muted-foreground mb-1 border-b border-border/50'>
          Pilih Opsi <br></br>(Multiple Select)
        </div>
        <div className='max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full'>
          {options.map(opt => {
            const isSelected = currentValues.includes(opt)
            return (
              <button
                key={opt}
                onClick={() => toggleOption(opt)}
                className='flex items-center gap-2.5 w-full px-2 py-1.5 text-[13px] rounded-md transition-colors cursor-pointer hover:bg-primary/10 hover:text-primary group outline-none'
              >
                <div
                  className={`flex items-center justify-center w-4 h-4 rounded-sm border transition-colors ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30 bg-background group-hover:border-primary'}`}
                >
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </div>
                <span className='truncate text-left flex-1'>{opt}</span>
              </button>
            )
          })}
        </div>
      </PopoverCalculator>
    </>
  )
}
