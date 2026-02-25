// src/components/ui/tablecomponents/FilterInputSearch.tsx

'use client'

import { Search, X } from 'lucide-react'

interface FilterInputSearchProps {
  value: string
  onChange: (value: string) => void
}

export function FilterInputSearch({ value, onChange }: FilterInputSearchProps) {
  return (
    <div className='relative flex items-center mb-1'>
      <Search className='absolute left-2.5 text-muted' size={14} />
      <input
        type='text'
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder='Cari opsi...'
        className='w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-8 text-sm text-foreground outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary'
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className='absolute right-2 text-muted hover:text-primary transition-colors outline-none cursor-pointer'
          title='Hapus pencarian opsi'
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
