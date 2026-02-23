// src/components/ui/tablecomponents/PopOverColumnFilter.tsx

"use client"

import React, { useEffect, useState, useRef, useMemo } from "react"
import { createPortal } from "react-dom"
import { Column } from "@tanstack/react-table"
import { FilterInputSearch } from "./FilterInputSearch"
import { FilterCheckbox } from "./FilterCheckbox"
import { FilterReset } from "./FilterReset"

interface PopOverColumnFilterProps<TData, TValue> {
  isOpen: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
  column: Column<TData, TValue>
}

export function PopOverColumnFilter<TData, TValue>({
  isOpen,
  onClose,
  triggerRef,
  column,
}: PopOverColumnFilterProps<TData, TValue>) {
  const [mounted, setMounted] = useState(false)
  const [coords, setCoords] = useState({ top: -9999, left: -9999 })
  const popoverRef = useRef<HTMLDivElement>(null)
  
  const [searchValue, setSearchValue] = useState("")

  // Ambil state filter
  const filterValue = column.getFilterValue()
  const activeFilters: string[] = Array.isArray(filterValue) 
    ? filterValue 
    : filterValue ? [String(filterValue)] : []
  
  const isActive = activeFilters.length > 0

  // Ekstrak opsi unik
  const facetedUniqueValues = column.getFacetedUniqueValues()
  const uniqueValues = useMemo(() => {
    if (!facetedUniqueValues) return []
    return Array.from(facetedUniqueValues.keys()).filter(Boolean).sort()
  }, [facetedUniqueValues])

  // Filter pencarian
  const filteredOptions = uniqueValues.filter((val) => 
    String(val).toLowerCase().includes(searchValue.toLowerCase())
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  // Kalkulasi posisi portal
  useEffect(() => {
    if (!isOpen || !triggerRef.current || !popoverRef.current) return

    const updatePosition = () => {
      if (!triggerRef.current || !popoverRef.current) return
      
      const trigger = triggerRef.current.getBoundingClientRect()
      const popover = popoverRef.current.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight

      let top = trigger.bottom + 8
      let left = trigger.right - popover.width

      if (left < 12) left = 12
      if (left + popover.width > vw - 12) left = vw - popover.width - 12
      if (top + popover.height > vh - 12) top = trigger.top - popover.height - 8

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

  // Tutup jika klik luar
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      const isOutsidePopover = popoverRef.current && !popoverRef.current.contains(e.target as Node)
      const isOutsideTrigger = triggerRef.current && !triggerRef.current.contains(e.target as Node)
      if (isOutsidePopover && isOutsideTrigger) onClose()
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose])

  // Fungsi Handler Checkbox
  const handleToggleFilter = (val: string) => {
    const newFilters = activeFilters.includes(val)
      ? activeFilters.filter((f) => f !== val)
      : [...activeFilters, val]
    column.setFilterValue(newFilters.length ? newFilters : undefined)
  }

  if (!mounted || !isOpen) return null

  return createPortal(
    <div
      ref={popoverRef}
      style={{ top: coords.top, left: coords.left, position: 'fixed' }}
      className="w-56 p-2 bg-surface border border-border rounded-xl shadow-xl z-100 flex flex-col gap-2 animate-in fade-in zoom-in-95"
      onMouseDown={(e) => e.stopPropagation()} 
    >
      {/* KOMPONEN 1: Input Search */}
      <FilterInputSearch value={searchValue} onChange={setSearchValue} />

      {/* KOMPONEN 2: Checkbox List */}
      <div className="flex flex-col max-h-48 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((val, i) => (
            <FilterCheckbox
              key={i}
              label={String(val)}
              isSelected={activeFilters.includes(String(val))}
              onToggle={() => handleToggleFilter(String(val))}
            />
          ))
        ) : (
          <div className="px-2 py-4 text-center text-xs text-muted">
            Opsi tidak ditemukan
          </div>
        )}
      </div>

      <div className="w-full h-px bg-border my-1"></div>

      {/* KOMPONEN 3: Reset Button */}
      <FilterReset 
        isActive={isActive} 
        onClick={() => {
          column.setFilterValue(undefined)
          setSearchValue("")
          onClose()
        }} 
      />
    </div>,
    document.body
  )
}
