// src/app/(dashboard)/dummy/Table.tsx

import React, { useState } from 'react'

export interface ColumnDef<T> {
  /** Label judul kolom yang akan ditampilkan di header */
  header: React.ReactNode
  /** Kunci properti dari data objek untuk render text secara langsung */
  accessorKey?: keyof T | string
  cell?: (row: T, index: number) => React.ReactNode
  /** Kelas CSS tambahan untuk sel td di kolom ini */
  className?: string
  /** Kelas CSS tambahan untuk sel th di header kolom ini */
  headerClassName?: string
}

export interface TableProps<T> {
  /** Definisi kolom tabel */
  columns: ColumnDef<T>[]
  /** Data array objek yang akan ditampilkan sebagai baris */
  data: T[]
  /** Menampilkan kolom index nomor baris di paling kiri ala Google Sheets */
  showRowNumbers?: boolean
  /** Handler saat baris tabel di-klik */
  onRowClick?: (row: T, index: number) => void
  className?: string
  /** Kelas CSS untuk elemen table */
  tableClassName?: string
  /** Kelas CSS untuk setiap baris tr di tbody */
  rowClassName?: string
}

export function Table<T>({
  columns,
  data,
  showRowNumbers = false,
  onRowClick,
  className = '',
  tableClassName = '',
  rowClassName = ''
}: TableProps<T>) {
  const [colWidths, setColWidths] = useState<Record<number, number>>({})

  const handleMouseDownWidth = (colIdx: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const startX = e.clientX
    const tableElement = (e.target as HTMLElement).closest('table')
    if (!tableElement) return

    const thElements = tableElement.querySelectorAll('thead th')
    const targetIdx = showRowNumbers ? colIdx + 1 : colIdx
    const thElement = thElements[targetIdx]
    if (!thElement) return
    const startWidth = thElement.getBoundingClientRect().width

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const newWidth = Math.max(60, startWidth + deltaX)
      setColWidths(prev => ({ ...prev, [colIdx]: newWidth }))
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      className={`w-full overflow-x-auto rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface))] shadow-sm ${className}`}
    >
      <table className={`w-full border-collapse text-left text-xs text-foreground table-fixed ${tableClassName}`}>
        <thead>
          <tr className='bg-[hsl(var(--subtle))] border-b border-[hsl(var(--border))] font-semibold text-[hsl(var(--subtle-foreground))] select-none'>
            {showRowNumbers && (
              <th className='w-12 text-center py-2.5 border-r border-[hsl(var(--border))] bg-[hsl(var(--muted))] relative'>
                #
              </th>
            )}
            {columns.map((col, colIdx) => {
              const widthStyle = colWidths[colIdx] ? { width: colWidths[colIdx] } : undefined
              return (
                <th
                  key={colIdx}
                  style={widthStyle}
                  className={`p-0 border-r border-[hsl(var(--border))] last:border-r-0 relative hover:bg-[hsl(var(--muted))]/50 transition-colors ${col.headerClassName || ''}`}
                >
                  <div className='px-4 py-2.5 truncate'>{col.header}</div>
                  <div
                    className='absolute right-0 top-0 bottom-0 w-1 cursor-col-resize select-none z-20 bg-[hsl(var(--border))] hover:bg-[hsl(var(--primary))] active:bg-[hsl(var(--primary))] transition-colors'
                    onMouseDown={e => handleMouseDownWidth(colIdx, e)}
                    onClick={e => e.stopPropagation()}
                  />
                </th>
              )
            })}
          </tr>
        </thead>

        <tbody className='divide-y divide-[hsl(var(--border))]'>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (showRowNumbers ? 1 : 0)}
                className='px-4 py-8 text-center text-muted-foreground italic'
              >
                Tidak ada data untuk ditampilkan
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => {
              return (
                <tr
                  key={rowIdx}
                  onClick={() => onRowClick?.(row, rowIdx)}
                  className={`transition-colors hover:bg-[hsl(var(--subtle))]/40 relative ${rowClassName}`}
                >
                  {showRowNumbers && (
                    <td className='bg-[hsl(var(--muted))] border-r border-[hsl(var(--border))] font-semibold text-center select-none w-12 relative align-middle p-0'>
                      <div className='px-2 py-3 truncate'>{rowIdx + 1}</div>
                    </td>
                  )}
                  {columns.map((col, colIdx) => {
                    let cellContent: React.ReactNode = null

                    if (col.cell) {
                      cellContent = col.cell(row, rowIdx)
                    } else if (col.accessorKey) {
                      const val = row[col.accessorKey as keyof T]
                      cellContent = val !== undefined && val !== null ? String(val) : ''
                    }

                    return (
                      <td
                        key={colIdx}
                        className='p-0 border-r border-[hsl(var(--border))] last:border-r-0 align-middle relative overflow-hidden'
                        style={colWidths[colIdx] ? { width: colWidths[colIdx] } : undefined}
                      >
                        <div className={`px-4 py-3 ${col.className || ''}`}>{cellContent}</div>
                      </td>
                    )
                  })}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
