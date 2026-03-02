// src/components/ui/tablecomponents/TableSelectedRowsModal.tsx

'use client'

import { X } from 'lucide-react'
import { Table, Row } from '@tanstack/react-table'
import { useEffect } from 'react'

interface TableSelectedRowsModalProps<TData> {
  isOpen: boolean
  onClose: () => void
  selectedRows: Row<TData>[]
  table: Table<TData>
  displayColumns?: string[]
}

export function TableSelectedRowsModal<TData>({
  isOpen,
  onClose,
  selectedRows,
  table,
  displayColumns
}: TableSelectedRowsModalProps<TData>) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  // Helper untuk mendapatkan label dari config column
  const getLabel = (key: string) => {
    const column = table.getAllLeafColumns().find(c => c.id === key)
    if (column && typeof column.columnDef.header === 'string') return column.columnDef.header
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')
  }

  return (
    <div className='fixed inset-0 z-100 flex items-center justify-center bg-black/50 animate-in fade-in duration-200'>
      <div className='bg-background border border-border rounded-xl shadow-xl w-11/12 max-h-[85vh] max-w-[50vw] flex flex-col relative animate-in zoom-in-95 duration-200'>
        <div className='flex items-center justify-between p-4 border-b border-border shrink-0'>
          <h3 className='text-lg font-semibold text-foreground'>Baris Terpilih ({selectedRows.length})</h3>
          <button
            onClick={onClose}
            className='text-danger bg-danger/10 hover:bg-danger/20 p-1.5 rounded-md transition-colors outline-none cursor-pointer'
          >
            <X size={18} />
          </button>
        </div>

        <div className='overflow-auto p-4 flex flex-col gap-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full'>
          {selectedRows.map((row, i) => {
            const data = row.original as any
            const cols =
              displayColumns && displayColumns.length > 0 ? displayColumns : Object.keys(data).filter(k => k !== 'id')
            return (
              <div
                key={row.id}
                className='p-3 bg-surface border border-border rounded-lg shadow-sm flex flex-col gap-2'
              >
                <div className='text-xs font-bold text-primary'>Data #{i + 1}</div>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                  {cols.map(col => (
                    <div key={col} className='flex flex-col'>
                      <span className='text-[10px] uppercase text-muted font-semibold tracking-wider'>
                        {getLabel(col)}
                      </span>
                      <span className='text-sm text-foreground truncate'>
                        {data[col] !== null && data[col] !== undefined && String(data[col]).trim() !== ''
                          ? String(data[col])
                          : '-'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
