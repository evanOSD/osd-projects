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
    <thead className='sticky top-0 z-20 bg-surface shadow-sm outline-1 outline-border'>
      {table.getHeaderGroups().map(headerGroup => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <TableHeader key={header.id} header={header} />
          ))}
        </TableRow>
      ))}
    </thead>
  )
}
