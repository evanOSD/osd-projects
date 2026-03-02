// src/components/ui/tablecomponents/TableToolbar.tsx

'use client'

import { useState } from 'react'
import { Table } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { TableSearch } from './TableSearch'
import { ResetColumnButton } from './ResetColumnButton'
import { ColumnVisibilityDropdown } from './ColumnVisibilityDropdown'
import { TableAddRow } from './TableAddRow'
import { TableSave } from './TableSave'
import { TableCancel } from './TableCancel'
import { TableDeleteRow } from './TableDeleteRow'
import { TableUnsavedChanges } from './TableUnsavedChanges'
import { TableExport } from './TableExport'
import { TableImport } from './TableImport'
import { TableSelectedRowsModal } from './TableSelectedRowsModal'

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
  onImportData?: (data: any[]) => void
  selectedRowDisplayColumns?: string[] // Menerima template kolom dari ekosistem halaman
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
  isSaving = false,
  onImportData,
  selectedRowDisplayColumns
}: TableToolbarProps<TData>) {
  const selectedRows = table.getSelectedRowModel().rows
  const selectedCount = selectedRows.length
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className='flex flex-wrap items-center justify-between p-4 border-b border-border bg-surface/50 gap-4'>
      <div className='flex items-center gap-3 w-full sm:w-auto flex-1'>
        <div className='max-w-sm w-full'>
          <TableSearch value={globalFilter} onChange={setGlobalFilter} />
        </div>
        
        {/* TOMBOL MUNCUL OTOMATIS JIKA ADA YANG DICENTANG */}
        {selectedCount > 0 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer shrink-0 animate-in fade-in zoom-in-95"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">Lihat terpilih</span> ({selectedCount})
          </button>
        )}

        <TableUnsavedChanges count={unsavedCount} />
      </div>

      <div className='flex items-center gap-2'>
        {onImportData && <TableImport onImport={onImportData} />}
        <TableExport table={table} />

        <div className='h-6 w-px bg-border mx-1'></div>

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

        <div className='h-6 w-px bg-border mx-1'></div>

        <ColumnVisibilityDropdown table={table} />
        <ResetColumnButton onClick={onResetColumns} />
      </div>

      {/* MODAL UNTUK MELIHAT BARIS TERPILIH */}
      <TableSelectedRowsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedRows={selectedRows}
        table={table}
        displayColumns={selectedRowDisplayColumns}
      />
    </div>
  )
}
