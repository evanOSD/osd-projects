// src/components/ui/tablecomponents/TableSearch.tsx

'use client'

import { Search, X } from 'lucide-react'
import MainContentTooltip from '@/components/ui/MainContentTooltip'

interface TableSearchProps {
  value: string
  onChange: (value: string) => void
}

export function TableSearch({ value, onChange }: TableSearchProps) {
  const isFiltered = value.length > 0

  return (
    <div className='relative w-full sm:w-72 flex items-center'>
      <Search className='absolute left-3 text-muted' size={16} />
      <input
        type='text'
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        placeholder='Cari data...'
        className='w-full rounded-md border border-border bg-surface py-2 pl-9 pr-8 text-sm text-foreground outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary'
      />
      {isFiltered && (
        <button
          onClick={() => onChange('')}
          className='p-2 rounded-md absolute right-0.5 cursor-pointer text-danger hover:bg-danger/10 transition-colors outline-none'
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
