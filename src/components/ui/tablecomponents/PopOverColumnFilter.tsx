// src/components/ui/tablecomponents/PopOverColumnFilter.tsx

'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Column } from '@tanstack/react-table'
import { Check, Loader2 } from 'lucide-react'
import { FilterInputSearch } from './FilterInputSearch'
import { FilterCheckbox } from './FilterCheckbox'
import { FilterReset } from './FilterReset'
import { PopoverCalculator } from './PopoverCalculator'

interface PopOverColumnFilterProps<TData, TValue> {
  isOpen: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
  column: Column<TData, TValue>
}

export function PopOverColumnFilter<TData, TValue>({
  isOpen,
  onClose,
  triggerRef,
  column
}: PopOverColumnFilterProps<TData, TValue>) {
  const filterValues = (column.getFilterValue() ?? []) as string[]
  const [searchQuery, setSearchQuery] = useState('')

  const meta = column.columnDef.meta as any
  const options: string[] = meta?.filterOptions?.options || []
  const isLoading: boolean = meta?.filterOptions?.isLoading || false

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options
    return options.filter(opt => opt.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [options, searchQuery])

  const toggleOption = (val: string) => {
    const newValues = filterValues.includes(val) ? filterValues.filter(v => v !== val) : [...filterValues, val]
    column.setFilterValue(newValues.length ? newValues : undefined)
  }

  return (
    <PopoverCalculator
      isOpen={isOpen}
      onClose={onClose}
      triggerRef={triggerRef}
      className='w-56 p-2 bg-surface border border-border rounded-xl shadow-xl z-100 flex flex-col gap-1 animate-in fade-in zoom-in-95'
    >
      <div className='text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-2 pt-1'>
        Filter {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
      </div>

      <FilterInputSearch value={searchQuery} onChange={setSearchQuery} />

      <div className='flex flex-col max-h-60 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full mt-1'>
        {isLoading ? (
          <div className='flex items-center justify-center py-4 text-muted'>
            <Loader2 size={16} className='animate-spin' />
          </div>
        ) : filteredOptions.length === 0 ? (
          <div className='text-center py-3 text-xs text-muted'>Tidak ada opsi</div>
        ) : (
          filteredOptions.map(opt => {
            const isSelected = filterValues.includes(opt)
            return <FilterCheckbox key={opt} label={opt} isSelected={isSelected} onToggle={() => toggleOption(opt)} />
          })
        )}
      </div>

      {filterValues.length > 0 && (
        <>
          <div className='w-full h-px bg-border my-1'></div>
          <FilterReset isActive={filterValues.length > 0} onClick={() => column.setFilterValue(undefined)} />
        </>
      )}
    </PopoverCalculator>
  )
}
