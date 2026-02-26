// src/components/ui/hooks/useDataTable.ts

import { useState, useMemo, useEffect } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  SortingState,
  ColumnDef,
  OnChangeFn,
  ColumnPinningState,
  VisibilityState,
  ExpandedState
} from '@tanstack/react-table'
import { TableCheckbox } from '../tablecomponents/TableCheckbox'
import { ChevronRight, ChevronDown } from 'lucide-react'

interface UseDataTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  updateData?: (rowIndex: number, columnId: string, value: unknown) => void
  defaultHiddenColumns?: Record<string, boolean>
  columnFilters?: any
  setColumnFilters?: any
  sorting?: SortingState
  setSorting?: OnChangeFn<SortingState>
  manualSorting?: boolean
  manualFiltering?: boolean
  renderSubComponent?: (props: { row: any }) => React.ReactElement
}

export function useDataTable<TData, TValue>({
  data,
  columns,
  updateData,
  defaultHiddenColumns = {},
  columnFilters,
  setColumnFilters,
  sorting,
  setSorting,
  manualSorting = false,
  manualFiltering = false,
  renderSubComponent
}: UseDataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState({})
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({ left: ['select'], right: [] })
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(defaultHiddenColumns)
  const [expanded, setExpanded] = useState<ExpandedState>({})

  const finalColumns = useMemo(() => {
    const selectColumn: ColumnDef<TData, any> = {
      id: 'select',
      size: 50,
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
        <div className='flex items-center justify-center gap-2 w-full px-1'>
          <TableCheckbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
          {row.getCanExpand() && (
            <button
              onClick={row.getToggleExpandedHandler()}
              className='p-0.5 hover:bg-muted rounded cursor-pointer text-muted-foreground'
            >
              {row.getIsExpanded() ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      enablePinning: true
    }
    return [selectColumn, ...columns] as ColumnDef<TData, any>[]
  }, [columns, renderSubComponent])

  const initialColumnOrder = useMemo(() => finalColumns.map(c => c.id as string), [finalColumns])
  const [baseColumnOrder, setBaseColumnOrder] = useState<string[]>(initialColumnOrder)
  const [columnOrder, setColumnOrder] = useState<string[]>(initialColumnOrder)

  useEffect(() => {
    setBaseColumnOrder(initialColumnOrder)
  }, [initialColumnOrder])

  useEffect(() => {
    const leftPinned = columnPinning.left || []
    const unpinned = baseColumnOrder.filter(id => !leftPinned.includes(id))
    const newOrder = [...new Set([...leftPinned, ...unpinned])]
    setColumnOrder(current => (JSON.stringify(newOrder) !== JSON.stringify(current) ? newOrder : current))
  }, [columnPinning.left, baseColumnOrder])

  const table = useReactTable({
    data,
    columns: finalColumns,
    defaultColumn: { size: 220, minSize: 100 },
    state: {
      globalFilter,
      columnOrder,
      rowSelection,
      columnFilters,
      sorting,
      columnPinning,
      columnVisibility,
      expanded
    },

    manualSorting: manualSorting,
    manualFiltering,
    columnResizeMode: 'onChange',
    enableColumnPinning: true,
    enableExpanding: !!renderSubComponent,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    meta: { updateData }
  })

  const resetOrder = () => {
    setBaseColumnOrder(initialColumnOrder)
    setColumnPinning({ left: ['select'], right: [] })
  }

  return { table, globalFilter, setGlobalFilter, columnOrder, resetOrder }
}
