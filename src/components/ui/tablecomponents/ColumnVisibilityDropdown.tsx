// src/components/ui/tablecomponents/ColumnVisibilityDropdown.tsx

'use client'

import { useState, useRef } from 'react'
import { Table } from '@tanstack/react-table'
import { Settings2, Check, Eye, RotateCcw } from 'lucide-react'
import MainContentTooltip from '@/components/ui/MainContentTooltip'
import { PopoverCalculator } from './PopoverCalculator'

interface ColumnVisibilityDropdownProps<TData> {
  table: Table<TData>
}

export function ColumnVisibilityDropdown<TData>({ table }: ColumnVisibilityDropdownProps<TData>) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <MainContentTooltip content='Tampilkan/Sembunyikan Kolom'>
        <button
          ref={triggerRef}
          type='button'
          onClick={() => setIsOpen(prev => !prev)}
          className='p-2.5 cursor-pointer rounded-md border border-border bg-surface text-foreground hover:text-foreground hover:bg-muted/10 transition-colors shrink-0'
        >
          <Settings2 size={16} />
        </button>
      </MainContentTooltip>

      <PopoverCalculator
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        triggerRef={triggerRef}
        className='w-56 p-2 bg-surface border border-border rounded-xl shadow-xl flex flex-col gap-1 animate-in fade-in zoom-in-95'
      >
        <div className='px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
          Visibilitas Kolom
        </div>

        <div className='flex flex-col max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full pr-1'>
          {table.getAllLeafColumns().map(column => {
            if (column.id === 'select' || !column.getCanHide()) return null
            const isVisible = column.getIsVisible()
            return (
              <label
                key={column.id}
                className='flex items-center gap-2.5 w-full px-2 py-1.5 text-sm rounded-md transition-colors cursor-pointer hover:bg-primary/10 hover:text-primary group'
              >
                <input
                  type='checkbox'
                  className='hidden'
                  checked={isVisible}
                  onChange={column.getToggleVisibilityHandler()}
                />
                <div
                  className={`flex items-center justify-center w-4 h-4 rounded-sm border transition-colors shrink-0 ${isVisible ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30 bg-background group-hover:border-primary'}`}
                >
                  {isVisible && <Check size={12} strokeWidth={3} />}
                </div>
                <span className='truncate select-none capitalize'>
                  {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                </span>
              </label>
            )
          })}
        </div>

        <div className='w-full h-px bg-border my-1'></div>

        <div className='flex gap-1'>
          <button
            type='button'
            onClick={() => table.setColumnVisibility({})}
            className='flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md text-foreground hover:bg-primary/10 hover:text-primary transition-colors outline-none cursor-pointer'
          >
            <Eye size={14} /> Semua
          </button>
          <button
            type='button'
            onClick={() => table.setColumnVisibility(table.initialState.columnVisibility || {})}
            className='flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md text-foreground hover:bg-primary/10 hover:text-primary transition-colors outline-none cursor-pointer'
          >
            <RotateCcw size={14} /> Default
          </button>
        </div>
      </PopoverCalculator>
    </>
  )
}
