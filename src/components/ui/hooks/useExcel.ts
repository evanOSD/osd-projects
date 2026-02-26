// src/components/ui/hooks/useExcel.ts

import { useState } from 'react'
import { exportToExcel, parseExcel, ExportColumn } from '@/lib/excel'
import toast from 'react-hot-toast'

export function useExcel() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleExport = async <TData>(data: TData[], columns: ExportColumn[], fileName: string) => {
    try {
      setIsExporting(true)
      await exportToExcel(data, columns, fileName)
      toast.success("Export berhasil!")
    } catch (error: any) {
      console.error(error)
      toast.error("Gagal export: " + error.message)
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (file: File, onDataParsed: (data: any[]) => void) => {
    try {
      setIsImporting(true)
      const data = await parseExcel(file)
      onDataParsed(data)
      toast.success(`Berhasil membaca ${data.length} baris data`)
    } catch (error: any) {
      console.error(error)
      toast.error("Gagal import: " + error.message)
    } finally {
      setIsImporting(false)
    }
  }

  return { handleExport, handleImport, isExporting, isImporting }
}
