// src/components/ui/tablecomponents/TableExport.tsx

"use client"

import { Download } from 'lucide-react'
import { useState } from 'react'
import { PopoverCalculator } from './PopoverCalculator'
import { useExcel } from '../hooks/useExcel'
import { Table } from '@tanstack/react-table'

interface TableExportProps<TData> {
  table: Table<TData>
  fileName?: string
}

export function TableExport<TData>({ table, fileName = "data-export" }: TableExportProps<TData>) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const { handleExport, isExporting } = useExcel()

  const runExport = (all: boolean) => {
    // 1. Definisikan Kolom
    const exportColumns = table.getAllLeafColumns().map(col => ({
      header: typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id,
      key: col.id,
      width: col.getSize() / 7 // Konversi pixel width ke excel width kira-kira
    })).filter(c => c.key !== 'select') // Jangan export kolom select

    // 2. Ambil Data
    const rows = all 
      ? table.getCoreRowModel().rows.map(r => r.original) // Semua data (client side logic, utk server side butuh fetch ulang)
      : table.getRowModel().rows.map(r => r.original) // Data yang tampil/terfilter

    handleExport(rows, exportColumns, fileName)
    setIsOpen(false)
  }

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-success text-success-foreground hover:bg-success/80 disabled:bg-muted/50 disabled:cursor-not-allowed transition-colors outline-none shadow-sm cursor-pointer"
      >
        <Download size={16} />
        Export
      </button>

      <PopoverCalculator isOpen={isOpen} onClose={() => setIsOpen(false)} triggerRef={triggerRef} className="w-48 bg-surface text-foreground  border border-border rounded-xl shadow-xl z-100 p-1">
        <div className="flex flex-col gap-1">
           <button onClick={() => runExport(false)} className="text-left px-3 py-2 text-sm hover:bg-success rounded-md transition-colors cursor-pointer">
             Export Tampil (Filtered)
           </button>
           <button onClick={() => runExport(true)} className="text-left px-3 py-2 text-sm hover:bg-success rounded-md transition-colors cursor-pointer">
             Export Semua Data
           </button>
        </div>
      </PopoverCalculator>
    </>
  )
}
import React from "react"
