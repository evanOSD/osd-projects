// src/lib/excel.ts

import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

// --- EXPORT FUNCTION ---
export interface ExportColumn {
  header: string
  key: string
  width?: number
}

export async function exportToExcel<TData>(data: TData[], columns: ExportColumn[], fileName: string = 'export-data') {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Data')

  // Setup Header
  worksheet.columns = columns.map(col => ({
    header: col.header,
    key: col.key,
    width: col.width || 20
  }))

  // Styling Header
  const headerRow = worksheet.getRow(1)
  headerRow.font = { bold: true, color: { argb: 'FFFFFF' } }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '4F46E5' } // Warna Primary (Indigo/Blue)
  }

  // Masukkan Data
  worksheet.addRows(data)

  // Tulis File
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveAs(blob, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`)
}

// --- IMPORT FUNCTION ---
export async function parseExcel(file: File): Promise<any[]> {
  const arrayBuffer = await file.arrayBuffer()
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(arrayBuffer)

  const worksheet = workbook.getWorksheet(1)
  if (!worksheet) throw new Error('Sheet tidak ditemukan')

  const jsonData: any[] = []

  // Ambil Header dari Baris 1
  const headers: string[] = []
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    headers[colNumber] = cell.text.toString()
  })

  // Iterasi Baris Data (Mulai baris 2)
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return // Skip header
    const rowData: any = {}

    row.eachCell((cell, colNumber) => {
      const headerKey = headers[colNumber]
      // Simpan value murni (bukan formula)
      rowData[headerKey] = cell.value
    })

    // Pastikan baris tidak kosong
    if (Object.keys(rowData).length > 0) {
      jsonData.push(rowData)
    }
  })

  return jsonData
}
