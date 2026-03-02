// src/components/ui/tablecomponents/DataTableBody.tsx

'use client'

import { Fragment, ReactElement } from 'react'
import { Table, ColumnDef, flexRender, Row } from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'
import { VirtualItem } from '@tanstack/react-virtual'
import { TableBody, TableRow, TableCell } from '../Table'

interface DataTableBodyProps<TData, TValue> {
  table: Table<TData>
  columns: ColumnDef<TData, TValue>[]
  virtualRows: VirtualItem[]
  paddingTop: number
  paddingBottom: number
  measureElement: (node: Element | null) => void
  isFetchingNextPage?: boolean
  renderSubComponent?: (props: { row: Row<TData> | any }) => ReactElement
}

export function DataTableBody<TData, TValue>({
  table,
  columns,
  virtualRows,
  paddingTop,
  paddingBottom,
  measureElement,
  isFetchingNextPage,
  renderSubComponent
}: DataTableBodyProps<TData, TValue>) {
  const { rows } = table.getRowModel()

  if (rows.length === 0 && !isFetchingNextPage) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={columns.length + 2} className='h-24 text-center text-muted'>
            Tidak ada data yang cocok dengan pencarian Anda.
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {paddingTop > 0 && (
        <tr>
          <td style={{ height: `${paddingTop}px` }} colSpan={columns.length + 2} />
        </tr>
      )}

      {virtualRows.map(virtualRow => {
        const row = rows[virtualRow.index]
        const isTemporary = String((row.original as any).id).startsWith('temp-')

        return (
          <Fragment key={row.id}>
            <TableRow
              data-index={virtualRow.index}
              ref={measureElement}
              className={isTemporary ? 'bg-warning/10 hover:bg-warning/20 transition-colors group' : 'group'}
            >
              {row.getVisibleCells().map((cell, index) => {
                const isPinned = cell.column.getIsPinned()

                // LOGIKA DETEKSI BATAS KANAN
                const isLastLeftPinnedColumn = isPinned === 'left' && cell.column.getIsLastColumn('left')
                const shouldHaveBorder = isLastLeftPinnedColumn && cell.column.id !== 'select'

                const cellStyle: React.CSSProperties = {
                  width: cell.column.getSize(),
                  minWidth: cell.column.getSize(),
                  maxWidth: cell.column.getSize(),
                  position: isPinned ? 'sticky' : 'relative',
                  left: isPinned === 'left' ? `${cell.column.getStart('left')}px` : undefined,
                  right: isPinned === 'right' ? `${cell.column.getAfter('right')}px` : undefined,
                  zIndex: isPinned ? 10 : 0
                }

                // Ganti border-r-2 menjadi kelas pseudo-element yang terisolasi!
                const borderClass = shouldHaveBorder
                  ? "after:content-[''] after:absolute after:top-0 after:bottom-0 after:right-0 after:w-[2px] after:bg-border after:z-10 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.1)]"
                  : ''

                return (
                  <TableCell
                    key={cell.id}
                    style={cellStyle}
                    className={`
                      ${isPinned ? 'bg-surface group-hover:brightness-95 dark:group-hover:brightness-110 transition-all' : ''} 
                      ${borderClass}
                      ${isTemporary && index === 0 ? 'border-l-2 border-l-warning' : ''}
                    `}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                )
              })}

              <td className='w-full' />
            </TableRow>

            {row.getIsExpanded() && renderSubComponent && (
              <tr>
                <td
                  colSpan={row.getVisibleCells().length + 1}
                  className='bg-muted/10 p-4 border-b border-border shadow-inner'
                >
                  {renderSubComponent({ row })}
                </td>
              </tr>
            )}
          </Fragment>
        )
      })}

      {paddingBottom > 0 && (
        <tr>
          <td style={{ height: `${paddingBottom}px` }} colSpan={columns.length + 2} />
        </tr>
      )}

      {isFetchingNextPage && (
        <TableRow>
          <TableCell colSpan={columns.length + 2} className='h-16 text-center text-muted bg-surface/50'>
            <div className='flex items-center justify-center gap-2 text-sm font-medium'>
              <Loader2 size={16} className='animate-spin text-primary' />
              Memuat baris selanjutnya...
            </div>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  )
}
