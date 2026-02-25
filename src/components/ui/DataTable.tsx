// src/components/ui/DataTable.tsx

'use client'

import { useRef, useEffect } from 'react'
import { ColumnDef, flexRender } from '@tanstack/react-table'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Loader2 } from 'lucide-react'

import { useDataTable } from './hooks/useDataTable'
import { TableToolbar } from './tablecomponents/TableToolbar'
import { DraggableTableHeader } from './tablecomponents/DraggableTableHeader'
import { TableBody, TableRow, TableCell } from './Table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  updateData?: (rowIndex: number, columnId: string, value: unknown) => void
  defaultHiddenColumns?: Record<string, boolean>
  onAddRow?: () => void
  onSave?: () => void
  onCancel?: () => void
  onDeleteRows?: (rows: TData[], clearSelection: () => void) => void
  unsavedCount?: number
  isSaving?: boolean
  fetchNextPage?: () => void
  hasMore?: boolean
  isFetchingNextPage?: boolean
  columnFilters?: any
  setColumnFilters?: any
  // --- KABEL YANG PUTUS KEMARIN KITA SAMBUNG DI SINI ---
  sorting?: any
  setSorting?: any
}

export function DataTable<TData, TValue>({
  columns,
  data,
  updateData,
  defaultHiddenColumns,
  onAddRow,
  onSave,
  onCancel,
  onDeleteRows,
  unsavedCount,
  isSaving,
  fetchNextPage,
  hasMore,
  isFetchingNextPage,
  columnFilters,
  setColumnFilters,
  sorting,
  setSorting // <--- TANGKAP PROPSNYA
}: DataTableProps<TData, TValue>) {
  const {
    table,
    globalFilter,
    setGlobalFilter,
    columnOrder,
    initialColumnOrder,
    setColumnOrder,
    sensors,
    handleDragEnd
  } = useDataTable({
    data,
    columns,
    updateData,
    defaultHiddenColumns,
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting // <--- LEMPAR KE ENGINE useDataTable
  })

  const tableContainerRef = useRef<HTMLDivElement>(null)
  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 40,
    overscan: 10
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()

  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0
  const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0) : 0

  useEffect(() => {
    const lastItem = virtualRows[virtualRows.length - 1]
    if (!lastItem) return

    if (lastItem.index >= rows.length - 5 && hasMore && !isFetchingNextPage && fetchNextPage) {
      fetchNextPage()
    }
  }, [virtualRows, rows.length, hasMore, isFetchingNextPage, fetchNextPage])

  return (
    <div className='rounded-xl border border-border bg-surface shadow-sm flex flex-col overflow-hidden'>
      <TableToolbar
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onResetColumns={() => setColumnOrder(initialColumnOrder)}
        onAddRow={onAddRow}
        onSave={onSave}
        onDeleteRows={onDeleteRows}
        onCancel={onCancel}
        unsavedCount={unsavedCount}
        isSaving={isSaving}
      />

      <DndContext
        id='dnd-table-context'
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div
          ref={tableContainerRef}
          className='max-h-[calc(100vh-280px)] overflow-auto relative w-full [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full'
        >
          <table className='w-full text-sm text-left border-collapse'>
            <thead className='sticky top-0 z-20 bg-surface shadow-sm outline-1 outline-border'>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
                    {headerGroup.headers.map(header => (
                      <DraggableTableHeader key={header.id} header={header} />
                    ))}
                  </SortableContext>
                </TableRow>
              ))}
            </thead>

            <TableBody>
              {rows.length === 0 && !isFetchingNextPage ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center text-muted'>
                    Tidak ada data yang cocok dengan pencarian Anda.
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {paddingTop > 0 && (
                    <tr>
                      <td style={{ height: `${paddingTop}px` }} colSpan={columns.length} />
                    </tr>
                  )}

                  {virtualRows.map(virtualRow => {
                    const row = rows[virtualRow.index]

                    const isTemporary = String((row.original as any).id).startsWith('temp-')

                    return (
                      <TableRow
                        key={row.id}
                        data-index={virtualRow.index}
                        ref={rowVirtualizer.measureElement}
                        // --- UBAH amber menjadi warning ---
                        className={isTemporary ? 'bg-warning/40 hover:bg-warning/50 transition-colors' : ''}
                      >
                        {row.getVisibleCells().map((cell, index) => (
                          <TableCell
                            key={cell.id}
                            className={isTemporary && index === 0 ? 'border-l-2 border-l-warning' : ''}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  })}

                  {paddingBottom > 0 && (
                    <tr>
                      <td style={{ height: `${paddingBottom}px` }} colSpan={columns.length} />
                    </tr>
                  )}

                  {isFetchingNextPage && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className='h-16 text-center text-muted bg-surface/50'>
                        <div className='flex items-center justify-center gap-2 text-sm font-medium'>
                          <Loader2 size={16} className='animate-spin text-primary' />
                          Memuat baris selanjutnya...
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </table>
        </div>
      </DndContext>
    </div>
  )
}
