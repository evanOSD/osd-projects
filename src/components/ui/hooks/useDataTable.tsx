// src/components/ui/hooks/useDataTable.ts

import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  ColumnDef,
  OnChangeFn // <--- Tambahkan SortingState & OnChangeFn
} from '@tanstack/react-table'
import { useSensor, useSensors, PointerSensor, KeyboardSensor, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { TableCheckbox } from '../tablecomponents/TableCheckbox' // <--- Import Checkbox

interface UseDataTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  updateData?: (rowIndex: number, columnId: string, value: unknown) => void
  defaultHiddenColumns?: Record<string, boolean>
  columnFilters?: any
  setColumnFilters?: any
  sorting?: SortingState // <--- Tambah
  setSorting?: OnChangeFn<SortingState> // <--- Tambah
}

export function useDataTable<TData, TValue>({
  data,
  columns,
  updateData,
  defaultHiddenColumns = {},
  columnFilters,
  setColumnFilters,
  sorting,
  setSorting // <--- Destructure
}: UseDataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState({}) // State Checkbox

  // 1. OTOMATISASI CHECKBOX: Gabungkan kolom select dengan kolom bawaan
  const finalColumns = useMemo(() => {
    const selectColumn: ColumnDef<TData, any> = {
      id: 'select',
      header: ({ table }) => (
        <div className='flex items-center justify-center w-full px-1'>
          <TableCheckbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className='flex items-center justify-center w-full px-1'>
          <TableCheckbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      size: 40
    }
    return [selectColumn, ...columns] as ColumnDef<TData, any>[]
  }, [columns])

  // 2. Gunakan finalColumns untuk Column Order awal
  const initialColumnOrder = useMemo(() => finalColumns.map(c => c.id as string), [finalColumns])
  const [columnOrder, setColumnOrder] = useState<string[]>(initialColumnOrder)

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: {
      globalFilter,
      columnOrder,
      rowSelection,
      columnFilters,
      sorting // <--- 1. Daftarkan state sorting
    },
    manualSorting: true, // <--- 2. MAGIC WORD! INI YANG MEMBUAT SORTIRNYA SERVER-SIDE!
    onSortingChange: setSorting, // <--- 3. Hubungkan ke hook logic
    onColumnFiltersChange: setColumnFilters,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // getSortedRowModel: getSortedRowModel(), <--- (Boleh dibiarkan atau dihapus, karena manualSorting = true akan mengabaikan fungsi ini)
    meta: { updateData }
  })

  // ... (Sisa kode sensor dan handleDragEnd tetap sama persis seperti sebelumnya)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
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
    handleDragEnd
  }
}
