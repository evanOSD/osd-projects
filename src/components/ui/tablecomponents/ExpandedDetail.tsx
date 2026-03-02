// src/components/ui/tablecomponents/ExpandedDetail.tsx

import { Row } from '@tanstack/react-table'
import { BookRow } from '@/api/database/books'

interface ExpandedDetailProps {
  row: Row<BookRow>
}

export function ExpandedDetail({ row }: ExpandedDetailProps) {
  const data = row.original

  return (
    <div className='p-4 bg-surface border border-border rounded-lg shadow-sm'>
      <h4 className='font-semibold text-primary mb-2'>Detail Ekstra untuk: {data.book}</h4>
      <div className='grid grid-cols-2 gap-4 text-sm text-foreground'>
        <div>
          <span className='text-muted'>Kategori:</span> {data.category}
        </div>
        <div>
          <span className='text-muted'>Total Ayat:</span> {data.total_verses}
        </div>
        {/* Kamu bisa menaruh tabel lain di sini, atau memanggil API baru berdasarkan data.id */}
      </div>
    </div>
  )
}
