// src/components/ui/tablecomponents/TableHeader.tsx

'use client'

import { flexRender, Header } from '@tanstack/react-table'

import { ColumnSortButton } from './ColumnSortButton'
import { ColumnFilterButton } from './ColumnFilterButton'
import { TableHeaderPin } from './TableHeaderPin'

interface TableHeaderProps<TData, TValue> {
  header: Header<TData, TValue>
}

export function TableHeader<TData, TValue>({ header }: TableHeaderProps<TData, TValue>) {
  const isPinned = header.column.getIsPinned()

  // Posisi diurus 100% oleh style ini, tidak perlu class Tailwind 'relative' atau 'sticky' lagi
  const style: React.CSSProperties = {
    position: isPinned ? 'sticky' : 'relative',
    width: header.getSize(),
    minWidth: header.getSize(),
    maxWidth: header.getSize(),
    zIndex: isPinned ? 20 : 1,
    left: isPinned === 'left' ? `${header.column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${header.column.getAfter('right')}px` : undefined
  }

  // --- KOLOM CHECKBOX ---
  if (header.column.id === 'select') {
    return (
      <th
        style={style}
        // 1. BERSIH: Bebas dari 'relative', 'sticky', dan 'border-r'
        // 2. KANONIKAL: after:h-[2px] jadi after:h-0.5
        // 3. VIRTUAL VERTICAL BORDER: before:w-px before:bg-muted-foreground/30 menjamin garis vertikal muncul!
        className='px-2 py-3 bg-surface text-center align-middle after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-border after:z-10 before:absolute before:top-0 before:bottom-0 before:right-0 before:w-px before:bg-muted-foreground/30 before:z-10'
      >
        {flexRender(header.column.columnDef.header, header.getContext())}
      </th>
    )
  }

  // --- KOLOM DATA ---
  return (
    <th
      style={style}
      colSpan={header.colSpan}
      // last:before:hidden memastikan kolom paling kanan tidak punya garis vertikal di ujungnya
      className={`px-3 py-3 text-left font-semibold bg-surface align-middle after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-border after:z-10 before:absolute before:top-0 before:bottom-0 before:right-0 before:w-px before:bg-muted-foreground/30 before:z-10 last:before:hidden ${
        isPinned ? 'shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]' : ''
      }`}
    >
      <div className='flex items-center justify-between gap-1 w-full h-full'>
        <div className='flex items-center gap-1.5 flex-1 overflow-hidden min-w-0'>
          <div className='truncate text-sm font-semibold' title={header.column.id}>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </div>
        </div>

        <div className='flex items-center gap-0.5 shrink-0'>
          <TableHeaderPin column={header.column} />
          {header.column.getCanSort() && (
            <ColumnSortButton
              isSorted={header.column.getIsSorted()}
              onClick={header.column.getToggleSortingHandler()}
            />
          )}
          {header.column.getCanFilter() && <ColumnFilterButton column={header.column} />}
        </div>
      </div>

      <div
        onMouseDown={header.getResizeHandler()}
        onTouchStart={header.getResizeHandler()}
        // KANONIKAL: w-[3px] jadi w-0.75
        className={`absolute right-0 top-0 h-full w-0.75 cursor-col-resize select-none touch-none hover:bg-primary/50 z-20 ${
          header.column.getIsResizing() ? 'bg-primary opacity-100' : 'bg-transparent'
        }`}
      />
    </th>
  )
}
