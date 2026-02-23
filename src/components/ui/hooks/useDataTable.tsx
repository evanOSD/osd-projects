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

interface UseDataTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
}

export function useDataTable<TData, TValue>({ data, columns }: UseDataTableProps<TData, TValue>) {
  // 1. State Management
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  // Urutan Kolom
  const initialColumnOrder = useMemo(
    () => columns.map(c => (c.id as string) || (c as any).accessorKey),
    [columns]
  )
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(initialColumnOrder)

  // 2. Inisialisasi TanStack Table
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
  })

  // 3. Sensor DnD Kit
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
    useSensor(KeyboardSensor)
  )

  // 4. Handler Drag End
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

  // 5. Kembalikan semua yang dibutuhkan oleh UI
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
