// src/app/(dashboard)/database/books/page.tsx

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/DataTable"

type BookData = {
  id: string
  title: string
  language: string
  status: "In Progress" | "Completed" | "Planned"
  progress: number
}

// 1. TAMBAHKAN FUNGSI INI: Agar tabel paham cara membaca Checkbox (Array)
const multiSelectFilter = (row: any, columnId: string, filterValue: string[]) => {
  if (!filterValue || filterValue.length === 0) return true
  return filterValue.includes(String(row.getValue(columnId)))
}

// 2. PASANG filterFn KE SEMUA KOLOM
const columns: ColumnDef<BookData>[] = [
  {
    accessorKey: "title",
    header: "Judul Buku",
    filterFn: multiSelectFilter, // <--- PASANG DI SINI
    cell: ({ row }) => <span className="font-semibold">{row.getValue("title")}</span>
  },
  {
    accessorKey: "language",
    header: "Bahasa",
    filterFn: multiSelectFilter, // <--- PASANG DI SINI
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: multiSelectFilter, // <--- PASANG DI SINI
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const colorClass = 
        status === 'Completed' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
        status === 'In Progress' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' :
        'bg-muted/20 text-muted-foreground'

      return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
          {status}
        </span>
      )
    }
  },
  {
    accessorKey: "progress",
    header: "Progress",
    // Progress biasanya pakai slider/angka, tapi kalau mau difilter checkbox, pasang juga tidak apa-apa
    filterFn: multiSelectFilter, 
    cell: ({ row }) => `${row.getValue("progress")}%`
  },
]

const dummyData: BookData[] = [
  { id: "1", title: "Kisah Para Rasul", language: "Sunda", status: "In Progress", progress: 45 },
  { id: "2", title: "Injil Lukas", language: "Jawa", status: "Completed", progress: 100 },
  { id: "3", title: "Kejadian", language: "Batak", status: "Planned", progress: 0 },
  { id: "4", title: "Keluaran", language: "Minang", status: "In Progress", progress: 12 },
]

export default function BooksPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-foreground">Data Buku</h2>
        <p className="text-sm text-muted">
          Manajemen data buku terjemahan, bahasa, dan pantau progres pengerjaannya di sini.
        </p>
      </div>
      
      <DataTable columns={columns} data={dummyData} />
    </div>
  )
}
