// src/app/(dashboard)/database/books/config/columns.tsx

import { ColumnDef } from "@tanstack/react-table"
import { BookRow } from "@/api/database/books"
import { EditableCell } from "@/components/ui/tablecomponents/EditableCell"
import { EditableCellDropdown } from "@/components/ui/tablecomponents/EditableCellDropdown"
import { Badge } from "@/components/ui/Badge"
import { formatDateTime } from "@/lib/formatters"

const multiSelectFilter = (row: any, columnId: string, filterValue: string[]) => {
  if (!filterValue || filterValue.length === 0) return true
  const rowValue = row.getValue(columnId)
  return filterValue.includes(String(rowValue))
}

export const bookColumns: ColumnDef<BookRow>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ getValue, row, column, table }) => {
      const val = getValue() as string
      return (
        <EditableCell 
          getValue={getValue} row={row} column={column} table={table} 
          displayComponent={<span className="truncate max-w-30">{val}</span>}
          isCopyable 
        />
      )
    }
  },
  {
    accessorKey: "global_order",
    header: "Global Order",
    cell: ({ getValue, row, column, table }) => (
      <EditableCell getValue={getValue} row={row} column={column} table={table} type="number" />
    )
  },
  {
    accessorKey: "scripture_id",
    header: "Scripture ID",
    cell: ({ getValue, row, column, table }) => (
      <EditableCell 
        getValue={getValue} row={row} column={column} table={table} 
        className="font-semibold text-primary"
        isCopyable
      />
    )
  },
  {
    accessorKey: "category",
    header: "Kategori",
    filterFn: multiSelectFilter,
    cell: ({ getValue, row, column, table }) => {
      const val = getValue() as string
      const badgeVariant = val === "Old Testament" ? "warning" : "info"
      return (
        <EditableCellDropdown 
          getValue={getValue} row={row} column={column} table={table} 
          options={["Old Testament", "New Testament"]} 
          displayComponent={<Badge variant={badgeVariant}>{val || "-"}</Badge>} 
        />
      )
    }
  },
  {
    accessorKey: "kitab",
    header: "Kitab",
    filterFn: multiSelectFilter,
    cell: ({ getValue, row, column, table }) => (
      <EditableCell getValue={getValue} row={row} column={column} table={table} />
    )
  },
  {
    accessorKey: "book",
    header: "Book (English)",
    filterFn: multiSelectFilter,
    cell: ({ getValue, row, column, table }) => (
      <EditableCell getValue={getValue} row={row} column={column} table={table} />
    )
  },
  {
    accessorKey: "pasal",
    header: "Pasal",
    cell: ({ getValue, row, column, table }) => (
      <EditableCell getValue={getValue} row={row} column={column} table={table} type="number" />
    )
  },
  {
    accessorKey: "chapter",
    header: "Chapter",
    cell: ({ getValue, row, column, table }) => (
      <EditableCell getValue={getValue} row={row} column={column} table={table} type="number" />
    )
  },
  {
    accessorKey: "total_verses",
    header: "Total Verses",
    cell: ({ getValue, row, column, table }) => (
      <EditableCell getValue={getValue} row={row} column={column} table={table} type="number" />
    )
  },
  {
    accessorKey: "last_updated_at",
    header: "Last Updated",
    cell: ({ getValue }) => {
      const val = getValue() as string
      return <span className="text-muted-foreground whitespace-nowrap">{formatDateTime(val)}</span>
    }
  },
  {
    accessorKey: "last_updated_by",
    header: "Updated By",
    filterFn: multiSelectFilter,
    cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() as string || "-"}</span>
  },
]
