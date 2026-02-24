// src/components/ui/tablecomponents/EditableCell.tsx

"use client"

import { useState, useEffect } from "react"
import { Row, Column, Table } from "@tanstack/react-table"

interface EditableCellProps<TData, TValue> {
  getValue: () => TValue
  row: Row<TData>
  column: Column<TData, TValue>
  table: Table<TData>
  type?: "text" | "number" | "date" | "time" | "datetime-local"
  displayComponent?: React.ReactNode
  className?: string
}

export function EditableCell<TData, TValue>({
  getValue, row, column, table, type = "text", displayComponent, className = ""
}: EditableCellProps<TData, TValue>) {
  const initialValue = getValue()
  const [value, setValue] = useState<any>(initialValue)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => setValue(initialValue), [initialValue])

  const handleSave = () => {
    if (value !== initialValue) table.options.meta?.updateData(row.index, column.id, value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") (e.currentTarget as HTMLElement).blur()
    if (e.key === "Escape") {
      setValue(initialValue)
      ;(e.currentTarget as HTMLElement).blur()
    }
  }

  return (
    <div className="relative flex items-center w-full min-h-6">
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false)
          handleSave()
        }}
        onKeyDown={handleKeyDown}
        // Hapus opacity-0, gunakan text-transparent dan target bayangan mm/dd/yyyy langsung
        className={`w-full bg-transparent border border-transparent px-2 py-1 -mx-2 rounded-sm text-sm outline-none transition-all z-10 cursor-text hover:border-border focus:bg-surface focus:border-primary focus:shadow-sm focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
          !isFocused && displayComponent 
            ? "text-transparent [&::-webkit-datetime-edit]:text-transparent" 
            : "text-foreground [&::-webkit-datetime-edit]:text-foreground"
        } ${className}`}
      />
      {!isFocused && displayComponent && (
        <div className={`absolute inset-0 pointer-events-none flex items-center px-2 -mx-2 text-sm z-0 ${className}`}>
          {displayComponent}
        </div>
      )}
    </div>
  )
}
