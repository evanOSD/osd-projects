// src/components/layout/topbarcomponents/GlobalSearch.tsx

'use client'

import { Search } from 'lucide-react'

export default function GlobalSearch() {
  return (
    <div className='relative w-full max-w-md'>
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-muted' size={18} />
      <input
        type='text'
        placeholder='Cari data, buku, atau cerita...'
        className='w-full rounded-full border border-border bg-surface py-2 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-ring'
      />
    </div>
  )
}
