// src/components/ui/tablecomponents/TableToolbar.tsx

'use client'

import { Table } from '@tanstack/react-table'
import { TableSearch } from './TableSearch'
import { ResetColumnButton } from './ResetColumnButton'
import { ColumnVisibilityDropdown } from './ColumnVisibilityDropdown'
import { TableAddRow } from './TableAddRow'
import { TableSave } from './TableSave'
import { TableCancel } from './TableCancel'
import { TableDeleteRow } from './TableDeleteRow'
import { TableUnsavedChanges } from './TableUnsavedChanges'

interface TableToolbarProps<TData> {
  table: Table<TData>
  globalFilter: string
  setGlobalFilter: (value: string) => void
  onResetColumns: () => void
  onAddRow?: () => void
  onSave?: () => void
  onDeleteRows?: (rows: TData[], clearSelection: () => void) => void
  onCancel?: () => void
  unsavedCount?: number
  isSaving?: boolean
}

export function TableToolbar<TData>({
  table,
  globalFilter,
  setGlobalFilter,
  onResetColumns,
  onAddRow,
  onSave,
  onCancel,
  onDeleteRows,
  unsavedCount = 0,
  isSaving = false
}: TableToolbarProps<TData>) {
  const selectedRows = table.getSelectedRowModel().rows
  const selectedCount = selectedRows.length
  return (
    <div className='flex flex-wrap items-center justify-between p-4 border-b border-border bg-surface/50 gap-4'>
      <div className='flex items-center gap-3 w-full sm:w-auto flex-1'>
        <div className='max-w-sm w-full'>
          <TableSearch value={globalFilter} onChange={setGlobalFilter} />
        </div>
        <TableUnsavedChanges count={unsavedCount} />
      </div>

      <div className='flex items-center gap-2'>
        <TableDeleteRow
          selectedCount={selectedCount}
          onClick={() => {
            if (onDeleteRows) {
              onDeleteRows(
                selectedRows.map(r => r.original),
                () => table.resetRowSelection()
              )
            }
          }}
          disabled={isSaving}
        />

        <TableAddRow onClick={onAddRow} />
        {unsavedCount > 0 && (
          <>
            <TableCancel onClick={onCancel} disabled={isSaving} />
            <TableSave onClick={onSave} isLoading={isSaving} />
          </>
        )}
        <div className='w-px h-6 bg-border mx-1'></div>
        <ColumnVisibilityDropdown table={table} />
        <ResetColumnButton onClick={onResetColumns} />
      </div>
    </div>
  )
}
