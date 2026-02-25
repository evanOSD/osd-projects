// src/components/ui/tablecomponents/DraggableTableHeader.tsx

'use client'

import { flexRender, Header } from '@tanstack/react-table'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

import { ColumnSortButton } from './ColumnSortButton'
import { ColumnFilterButton } from './ColumnFilterButton'

interface DraggableTableHeaderProps<TData, TValue> {
  header: Header<TData, TValue>
}

export function DraggableTableHeader<TData, TValue>({ header }: DraggableTableHeaderProps<TData, TValue>) {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: header.column.id
  })

  const style = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative' as const,
    transform: CSS.Translate.toString(transform),
    transition,
    width: header.getSize(),
    zIndex: isDragging ? 50 : 'auto'
  }

  if (header.column.id === 'select') {
    return (
      <th className='px-2 py-3 border-r border-border bg-surface text-center align-middle w-10 sticky left-0 z-30'>
        {flexRender(header.column.columnDef.header, header.getContext())}
      </th>
    )
  }

  return (
    <th
      ref={setNodeRef}
      style={style}
      colSpan={header.colSpan}
      className={`px-4 py-3 text-left font-semibold border-r border-border last:border-r-0 bg-surface align-middle ${
        isDragging ? 'shadow-md bg-muted/50' : ''
      }`}
    >
      <div className='flex items-center justify-between gap-2 w-full'>
        <div className='flex items-center gap-2 overflow-hidden'>
          <div
            {...attributes}
            {...listeners}
            className='cursor-grab text-muted-foreground/50 hover:text-foreground transition-colors outline-none shrink-0'
          >
            <GripVertical size={14} />
          </div>

          <div className='truncate'>{flexRender(header.column.columnDef.header, header.getContext())}</div>
        </div>

        <div className='flex items-center gap-1 shrink-0'>
          {header.column.getCanSort() && (
            <ColumnSortButton
              isSorted={header.column.getIsSorted()}
              onClick={header.column.getToggleSortingHandler()}
            />
          )}

          {header.column.getCanFilter() && <ColumnFilterButton column={header.column} />}
        </div>
      </div>
    </th>
  )
}
