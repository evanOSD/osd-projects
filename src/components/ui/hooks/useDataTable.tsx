// src/components/ui/hooks/useDataTable.ts
import { useMemo, useState } from 'react'
import {
  ColumnDef,
  ColumnOrderState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getFacetedUniqueValues,
  useReactTable,
} from '@tanstack/react-table'
import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

import '@tanstack/react-table'
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends unknown> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

interface UseDataTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  updateData?: (rowIndex: number, columnId: string, value: unknown) => void 
}

export function useDataTable<TData, TValue>({ data, columns, updateData }: UseDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const initialColumnOrder = useMemo(
    () => columns.map(c => (c.id as string) || (c as any).accessorKey),
    [columns]
  )
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(initialColumnOrder)

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnOrder,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    meta: {
      updateData: updateData || (() => {}),
    }
  })

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
    useSensor(KeyboardSensor)
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setColumnOrder(order => {
        const oldIndex = order.indexOf(active.id as string)
        const newIndex = order.indexOf(over.id as string)
        return arrayMove(order, oldIndex, newIndex)
      })
    }
  }

  return {
    table,
    globalFilter,
    setGlobalFilter,
    columnOrder,
    initialColumnOrder,
    setColumnOrder,
    sensors,
    handleDragEnd,
  }
}
