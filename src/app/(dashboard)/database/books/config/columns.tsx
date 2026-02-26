// src/app/(dashboard)/database/books/config/columns.tsx

import { ColumnDef } from '@tanstack/react-table'
import { BookRow, booksApi } from '@/api/database/books'
import { EditableCell } from '@/components/ui/tablecomponents/EditableCell'
import { EditableCellDropdown } from '@/components/ui/tablecomponents/EditableCellDropdown'
import { Badge } from '@/components/ui/Badge'
import { formatDateTime } from '@/lib/formatters'
import { useState, useEffect } from 'react'

const multiSelectFilter = (row: any, columnId: string, filterValue: string[]) => {
  if (!filterValue || filterValue.length === 0) return true
  const rowValue = row.getValue(columnId)
  return filterValue.includes(String(rowValue))
}

const DynamicCategoryCell = ({ getValue, row, column, table }: any) => {
  const [options, setOptions] = useState<string[]>([])
  const val = getValue() as string

  useEffect(() => {
    booksApi.getUniqueColumnValues('category').then(setOptions)
  }, [])

  const badgeVariant = val === 'Old Testament' ? 'warning' : 'info'

  return (
    <EditableCellDropdown
      getValue={getValue}
      row={row}
      column={column}
      table={table}
      options={options}
      displayComponent={<Badge variant={badgeVariant}>{val || '-'}</Badge>}
    />
  )
}

export const bookColumns: ColumnDef<BookRow>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 200,
    filterFn: multiSelectFilter,
    meta: {
      filterOptions: {
        fetcher: () => booksApi.getUniqueColumnValues('id')
      }
    },
    cell: ({ getValue, row, column, table }) => (
      <EditableCell
        getValue={getValue}
        row={row}
        column={column}
        table={table}
        displayComponent={<span className='truncate max-w-30'>{getValue() as string}</span>}
        isCopyable
      />
    )
  },
  {
    accessorKey: 'global_order',
    header: 'Global Order',
    size: 200,
    filterFn: multiSelectFilter,
    meta: {
      filterOptions: {
        fetcher: () => booksApi.getUniqueColumnValues('global_order')
      }
    },
    cell: ({ getValue, row, column, table }) => (
      <EditableCell getValue={getValue} row={row} column={column} table={table} type='number' />
    )
  },
  {
    accessorKey: 'scripture_id',
    header: 'Scripture ID',
    size: 200,
    filterFn: multiSelectFilter,
    meta: {
      filterOptions: {
        fetcher: () => booksApi.getUniqueColumnValues('scripture_id')
      }
    },
    cell: ({ getValue, row, column, table }) => (
      <EditableCell getValue={getValue} row={row} column={column} table={table} isCopyable />
    )
  },
  {
    accessorKey: 'category',
    header: 'Kategori',
    size: 200,
    filterFn: multiSelectFilter,
    meta: {
      filterOptions: {
        fetcher: () => booksApi.getUniqueColumnValues('category')
      }
    },
    cell: DynamicCategoryCell
  },
  {
    accessorKey: 'kitab',
    header: 'Kitab',
    size: 200,
    filterFn: multiSelectFilter,
    meta: {
      filterOptions: {
        fetcher: () => booksApi.getUniqueColumnValues('kitab')
      }
    },
    cell: ({ getValue, row, column, table }) => (
      <EditableCell getValue={getValue} row={row} column={column} table={table} />
    )
  },
  {
    accessorKey: 'book',
    header: 'Book',
    size: 200,
    filterFn: multiSelectFilter,
    meta: {
      filterOptions: {
        fetcher: () => booksApi.getUniqueColumnValues('book')
      }
    },
    cell: ({ getValue, row, column, table }) => (
      <EditableCell getValue={getValue} row={row} column={column} table={table} />
    )
  },
  {
    accessorKey: 'pasal',
    header: 'Pasal',
    size: 200,
    filterFn: multiSelectFilter,
    meta: {
      filterOptions: {
        fetcher: () => booksApi.getUniqueColumnValues('pasal')
      }
    },
    cell: ({ getValue, row, column, table }) => (
      <EditableCell getValue={getValue} row={row} column={column} table={table} type='number' />
    )
  },
  {
    accessorKey: 'chapter',
    header: 'Chapter',
    size: 200,
    filterFn: multiSelectFilter,
    meta: {
      filterOptions: {
        fetcher: () => booksApi.getUniqueColumnValues('chapter')
      }
    },
    cell: ({ getValue, row, column, table }) => (
      <EditableCell getValue={getValue} row={row} column={column} table={table} type='number' />
    )
  },
  {
    accessorKey: 'last_updated_by',
    header: 'Updated By',
    size: 200,
    filterFn: multiSelectFilter,
    meta: {
      filterOptions: {
        fetcher: () => booksApi.getUniqueColumnValues('last_updated_by')
      }
    },
    cell: ({ getValue }) => <span className='text-muted-foreground'>{(getValue() as string) || '-'}</span>
  },
  {
    accessorKey: 'last_updated_at',
    header: 'Last Updated At',
    size: 250,
    filterFn: multiSelectFilter,
    meta: {
      filterOptions: {
        fetcher: () => booksApi.getUniqueColumnValues('last_updated_at')
      }
    },
    cell: ({ getValue }) => {
      const val = getValue() as string
      return <span className='text-muted-foreground whitespace-nowrap'>{val ? formatDateTime(val) : '-'}</span>
    }
  }
]
