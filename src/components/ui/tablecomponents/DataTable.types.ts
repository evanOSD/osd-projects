// src/components/ui/tablecomponents/DataTable.types.ts

import { ColumnDef, Row } from '@tanstack/react-table'
import { ReactElement } from 'react'

export interface DataTableProps<TData, TValue> {
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
  sorting?: any
  setSorting?: any
  manualSorting?: boolean
  renderSubComponent?: (props: { row: Row<TData> | any }) => ReactElement
  onImportData?: (data: any[]) => void
}
