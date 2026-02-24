// src/components/ui/DataTable.tsx
'use client'

import { ColumnDef, flexRender } from '@tanstack/react-table'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'

import { useDataTable } from './hooks/useDataTable'
import { TableToolbar } from './tablecomponents/TableToolbar'
import { DraggableTableHeader } from './tablecomponents/DraggableTableHeader'

import { Table, TableHeader, TableBody, TableRow, TableCell } from './Table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  updateData?: (rowIndex: number, columnId: string, value: unknown) => void 
}

export function DataTable<TData, TValue>({ columns, data, updateData }: DataTableProps<TData, TValue>) {
  const {
    table,
    globalFilter,
    setGlobalFilter,
    columnOrder,
    initialColumnOrder,
    setColumnOrder,
    sensors,
    handleDragEnd,
  } = useDataTable({ data, columns, updateData })

  return (
    <div className='rounded-xl border border-border bg-surface shadow-sm flex flex-col overflow-hidden'>
      <TableToolbar
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onResetColumns={() => setColumnOrder(initialColumnOrder)}
      />

      <DndContext
        id="dnd-table-context"
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
                  {headerGroup.headers.map(header => (
                    <DraggableTableHeader key={header.id} header={header} />
                  ))}
                </SortableContext>
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center text-muted'>
                  Tidak ada data yang cocok dengan pencarian Anda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DndContext>
    </div>
  )
}
