// src/components/ui/tablecomponents/PopOverColumnFilter.tsx

'use client'

import { useState, useMemo, useEffect } from 'react'
import { Column } from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'
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

  // STATE UNTUK OPSI DINAMIS DARI SUPABASE
  const [dynamicOptions, setDynamicOptions] = useState<string[]>([])
  const [isFetchingDynamic, setIsFetchingDynamic] = useState(false)

  // EFEK LAZY LOAD: Hanya hit Supabase saat Popover TERBUKA
  useEffect(() => {
    if (isOpen && meta?.filterOptions?.fetcher && dynamicOptions.length === 0) {
      let isMounted = true
      setIsFetchingDynamic(true)

      // Eksekusi fungsi fetcher dari columns.tsx
      meta.filterOptions
        .fetcher()
        .then((res: string[]) => {
          if (isMounted) setDynamicOptions(res)
        })
        .catch((err: any) => console.error(`Gagal mengambil filter opsi:`, err))
        .finally(() => {
          if (isMounted) setIsFetchingDynamic(false)
        })

      return () => {
        isMounted = false
      }
    }
  }, [isOpen, meta, dynamicOptions.length])

  // GABUNGKAN OPSI: Kalau ada hardcode pakai itu, kalau tidak pakai hasil Supabase
  const options: string[] = meta?.filterOptions?.options || dynamicOptions

  // TAMPILKAN LOADING jika memang di-set loading dari luar ATAU sedang fetch data
  const isLoading: boolean = meta?.filterOptions?.isLoading || isFetchingDynamic

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
            <Loader2 size={16} className='animate-spin text-primary' />
            <span className='ml-2 text-xs'>Memuat data...</span>
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
