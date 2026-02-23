// src/components/ui/tablecomponents/DraggableTableHeader.tsx

'use client'

import { flexRender, Header } from '@tanstack/react-table'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripHorizontal } from 'lucide-react'

import { ColumnSortButton } from './ColumnSortButton'
import { ColumnFilterButton } from './ColumnFilterButton'
import MainContentTooltip from '@/components/ui/MainContentTooltip'

export function DraggableTableHeader<TData, TValue>({ header }: { header: Header<TData, TValue> }) {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: header.column.id
  })

  const style = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative' as const,
    transform: CSS.Translate.toString(transform),
    transition,
    width: header.getSize(),
    zIndex: isDragging ? 1 : 0
  }

  return (
    <th
      ref={setNodeRef}
      style={style}
      colSpan={header.colSpan}
      className='px-4 py-3 font-semibold whitespace-nowrap bg-muted/5 border-r border-border/50 last:border-r-0 group'
    >
      <div className='flex items-center gap-2'>
        <MainContentTooltip content='Geser Kolom'>
          <button
            {...attributes}
            {...listeners}
            className='cursor-grab active:cursor-grabbing text-foreground transition-colors outline-none'
          >
            <GripHorizontal size={16} />
          </button>
        </MainContentTooltip>

        <div className='flex-1 text-foreground cursor-text truncate min-w-0'>
          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
        </div>

        <div className='flex items-center gap-0.5 opacity-60 hover:opacity-100 focus-within:opacity-100 transition-opacity'>
          {header.column.getCanFilter() && <ColumnFilterButton column={header.column} />}
          {header.column.getCanSort() && (
            <ColumnSortButton
              isSorted={header.column.getIsSorted()}
              onClick={header.column.getToggleSortingHandler()}
            />
          )}
        </div>
      </div>
    </th>
  )
}
