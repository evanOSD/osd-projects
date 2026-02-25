// src/components/ui/tablecomponents/TableDeleteRow.tsx

"use client"

import { Trash2 } from "lucide-react"

interface TableDeleteRowProps {
  selectedCount: number
  onClick?: () => void
  disabled?: boolean
}

export function TableDeleteRow({ selectedCount, onClick, disabled }: TableDeleteRowProps) {
  if (selectedCount === 0) return null

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      // --- PERBAIKAN TEMA: Gunakan warna danger dari globals.css ---
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border border-danger/30 bg-danger/10 text-danger hover:bg-danger/20 transition-colors outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm animate-in fade-in zoom-in-95 duration-200"
    >
      <Trash2 size={16} />
      <span className="hidden sm:inline-block">Hapus ({selectedCount})</span>
    </button>
  )
}
