// src/components/ui/tablecomponents/EditableCellDropdown.tsx

"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Row, Column, Table } from "@tanstack/react-table"
import { Check } from "lucide-react"

interface EditableCellDropdownProps<TData, TValue> {
  getValue: () => TValue
  row: Row<TData>
  column: Column<TData, TValue>
  table: Table<TData>
  options: string[]
  displayComponent?: React.ReactNode
  className?: string
}

export function EditableCellDropdown<TData, TValue>({
  getValue, row, column, table, options, displayComponent, className = ""
}: EditableCellDropdownProps<TData, TValue>) {
  const initialValue = getValue()
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [coords, setCoords] = useState({ top: -9999, left: -9999 })

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!isOpen || !triggerRef.current || !dropdownRef.current) return
    const updatePosition = () => {
      if (!triggerRef.current || !dropdownRef.current) return
      const trigger = triggerRef.current.getBoundingClientRect()
      const dropdown = dropdownRef.current.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      let top = trigger.bottom + 4
      let left = trigger.left
      if (left + dropdown.width > vw - 12) left = vw - dropdown.width - 12
      if (top + dropdown.height > vh - 12) top = trigger.top - dropdown.height - 4
      setCoords({ top, left })
    }
    updatePosition()
    window.addEventListener("scroll", updatePosition, true)
    window.addEventListener("resize", updatePosition)
    return () => {
      window.removeEventListener("scroll", updatePosition, true)
      window.removeEventListener("resize", updatePosition)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const handleSelect = (opt: string) => {
    setIsOpen(false)
    if (opt !== initialValue) table.options.meta?.updateData(row.index, column.id, opt)
  }

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`min-h-6 cursor-pointer px-2 -mx-2 rounded-sm hover:bg-muted/10 transition-colors flex items-center ${className}`}
      >
        {displayComponent !== undefined ? displayComponent : (initialValue as React.ReactNode)}
      </div>

      {mounted && isOpen && createPortal(
        <div
          ref={dropdownRef}
          style={{ top: coords.top, left: coords.left, position: "fixed" }}
          className="w-48 p-1.5 bg-surface border border-border rounded-xl shadow-xl z-100 flex flex-col gap-0.5 animate-in fade-in zoom-in-95"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {options.map((opt) => {
            const isSelected = initialValue === opt
            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className="flex items-center gap-2.5 w-full px-2 py-1.5 text-sm rounded-md transition-colors cursor-pointer hover:bg-primary/10 hover:text-primary group outline-none"
              >
                <div className={`flex items-center justify-center w-4 h-4 rounded-sm border transition-colors ${isSelected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30 bg-background group-hover:border-primary"}`}>
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </div>
                <span className="truncate">{opt}</span>
              </button>
            )
          })}
        </div>,
        document.body
      )}
    </>
  )
}
