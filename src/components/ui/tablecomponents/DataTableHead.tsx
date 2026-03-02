// src/components/ui/tablecomponents/DataTableHead.tsx

'use client'

import { Table } from '@tanstack/react-table'
import { TableRow } from '../Table'
import { TableHeader } from './TableHeader'

interface DataTableHeadProps<TData> {
  table: Table<TData>
  columnOrder: string[]
}

export function DataTableHead<TData>({ table }: DataTableHeadProps<TData>) {
  return (
    <thead className='sticky top-0 z-20 bg-surface shadow-sm'>
      {table.getHeaderGroups().map(headerGroup => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <TableHeader key={header.id} header={header} />
          ))}
          {/* PERBAIKAN: Tambahkan w-full di sini agar ia menyedot sisa ruang! */}
          <th className='w-full bg-surface relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-border after:z-10' />
        </TableRow>
      ))}
    </thead>
  )
}
