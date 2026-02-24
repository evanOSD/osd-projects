// src/app/(dashboard)/database/books/page.tsx

"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/DataTable"
import { EditableCell } from "@/components/ui/tablecomponents/EditableCell"
import { EditableCellDropdown } from "@/components/ui/tablecomponents/EditableCellDropdown"
// IMPORT HELPER DARI SINI
import { formatDate, formatDateTime } from "@/lib/formatters"

type BookData = {
  id: number
  title: string
  price: number
  is_published: string
  publish_date: string
  publish_time: string
  created_at: string
}

const multiSelectFilter = (row: any, columnId: string, filterValue: string[]) => {
  if (!filterValue || filterValue.length === 0) return true
  return filterValue.includes(String(row.getValue(columnId)))
}

const initialDummyData: BookData[] = [
  { id: 1, title: "Kisah Para Rasul", price: 150.5, is_published: "Ya", publish_date: "2024-01-15", publish_time: "08:30", created_at: "2024-01-15T08:30" },
  { id: 2, title: "Injil Lukas", price: 200.0, is_published: "Tidak", publish_date: "2024-02-20", publish_time: "14:15", created_at: "2024-02-20T14:15" },
  { id: 3, title: "Kejadian", price: 99.9, is_published: "Ya", publish_date: "2023-11-05", publish_time: "09:00", created_at: "2023-11-05T09:00" },
]

export default function BooksPage() {
  const [data, setData] = useState<BookData[]>(initialDummyData)

  const updateData = (rowIndex: number, columnId: string, value: unknown) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) return { ...old[rowIndex], [columnId]: value }
        return row
      })
    )
  }

  const columns: ColumnDef<BookData>[] = [
    {
      accessorKey: "id",
      header: "ID",
      filterFn: multiSelectFilter,
      cell: ({ getValue, row, column, table }) => (
        <EditableCell getValue={getValue} row={row} column={column} table={table} type="number" />
      )
    },
    {
      accessorKey: "title",
      header: "Judul",
      filterFn: multiSelectFilter,
      cell: ({ getValue, row, column, table }) => (
        <EditableCell getValue={getValue} row={row} column={column} table={table} className="font-semibold" />
      )
    },
    {
      accessorKey: "price",
      header: "Harga",
      filterFn: multiSelectFilter,
      cell: ({ getValue, row, column, table }) => {
        const val = getValue()
        const displayVal = val !== undefined && val !== null && val !== "" ? `$${val}` : ""
        return (
          <EditableCell 
            getValue={getValue} row={row} column={column} table={table} 
            type="number" displayComponent={displayVal} 
          />
        )
      }
    },
    {
      accessorKey: "is_published",
      header: "Status",
      filterFn: multiSelectFilter,
      cell: ({ getValue, row, column, table }) => {
        const val = getValue() as string
        const Badge = (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${val === "Ya" ? "bg-primary/10 text-primary" : "bg-muted/20 text-muted-foreground"}`}>
            {val === "Ya" ? "Aktif" : "Draft"}
          </span>
        )
        return (
          <EditableCellDropdown getValue={getValue} row={row} column={column} table={table} options={["Ya", "Tidak"]} displayComponent={Badge} />
        )
      }
    },
    {
      accessorKey: "publish_date",
      header: "Tanggal (Date)",
      filterFn: multiSelectFilter,
      cell: ({ getValue, row, column, table }) => {
        const val = getValue() as string
        return <EditableCell getValue={getValue} row={row} column={column} table={table} type="date" displayComponent={formatDate(val)} />
      }
    },
    {
      accessorKey: "publish_time",
      header: "Waktu (Timez)",
      filterFn: multiSelectFilter,
      cell: ({ getValue, row, column, table }) => (
        <EditableCell getValue={getValue} row={row} column={column} table={table} type="time" />
      )
    },
    {
      accessorKey: "created_at",
      header: "Dibuat (Timestampz)",
      filterFn: multiSelectFilter,
      cell: ({ getValue, row, column, table }) => {
        const val = getValue() as string
        return <EditableCell getValue={getValue} row={row} column={column} table={table} type="datetime-local" displayComponent={formatDateTime(val)} />
      }
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-foreground">Data Buku</h2>
        <p className="text-sm text-muted">Manajemen tabel simulasi tipe data Supabase.</p>
      </div>
      <DataTable columns={columns} data={data} updateData={updateData} />
    </div>
  )
}
