// src/components/ui/tablecomponents/TableImport.tsx

"use client"

import { Upload, Loader2 } from 'lucide-react'
import { useRef } from 'react'
import { useExcel } from '../hooks/useExcel'

interface TableImportProps {
  onImport: (data: any[]) => void
}

export function TableImport({ onImport }: TableImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { handleImport, isImporting } = useExcel()

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImport(file, (data) => {
        onImport(data)
        if (fileInputRef.current) fileInputRef.current.value = '' // Reset
      })
    }
  }

  return (
    <>
      <input 
        type="file" 
        accept=".xlsx, .xls" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={onFileChange} 
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isImporting}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-border bg-surface hover:bg-muted transition-colors"
      >
        {isImporting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
        Import Excel
      </button>
    </>
  )
}
