// src/components/ui/tablecomponents/FilterReset.tsx

"use client"

import { RotateCcw } from "lucide-react"

interface FilterResetProps {
  isActive: boolean
  onClick: () => void
}

export function FilterReset({ isActive, onClick }: FilterResetProps) {
  return (
    <button
      disabled={!isActive}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 w-full py-2 text-sm font-medium rounded-md transition-colors outline-none ${
        isActive 
          ? "text-danger hover:bg-danger/10 hover:text-danger cursor-pointer" 
          : "text-muted opacity-50 cursor-not-allowed"
      }`}
    >
      <RotateCcw size={14} />
      Reset Filter
    </button>
  )
}
