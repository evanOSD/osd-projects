// src/components/ui/tablecomponents/TableToolbar.tsx

"use client"

import { TableSearch } from "./TableSearch"
import { ResetColumnButton } from "./ResetColumnButton"

interface TableToolbarProps {
  globalFilter: string
  setGlobalFilter: (value: string) => void
  onResetColumns: () => void
}

export function TableToolbar({
  globalFilter,
  setGlobalFilter,
  onResetColumns
}: TableToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between p-4 border-b border-border bg-surface/50 gap-4">
      {/* Atomic Component: Pencarian */}
      <TableSearch value={globalFilter} onChange={setGlobalFilter} />

      {/* Atomic Component: Reset Order */}
      <div className="flex items-center">
        <ResetColumnButton onClick={onResetColumns} />
      </div>
    </div>
  )
}
