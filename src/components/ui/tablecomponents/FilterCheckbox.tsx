// src/components/ui/tablecomponents/FilterCheckbox.tsx

"use client"

import { Check } from "lucide-react"

interface FilterCheckboxProps {
  label: string
  isSelected: boolean
  onToggle: () => void
}

export function FilterCheckbox({ label, isSelected, onToggle }: FilterCheckboxProps) {
  return (
    <label
      onClick={(e) => {
        e.preventDefault()
        onToggle()
      }}
      className="flex items-center gap-2.5 w-full px-2 py-1.5 text-sm rounded-md transition-colors cursor-pointer hover:bg-primary/10 hover:text-primary group"
    >
      <div className={`flex items-center justify-center w-4 h-4 rounded-sm border transition-colors ${
        isSelected 
          ? "bg-primary border-primary text-primary-foreground" 
          : "border-muted-foreground/30 bg-background group-hover:border-primary"
      }`}>
        {isSelected && <Check size={12} strokeWidth={3} />}
      </div>
      <span className="truncate select-none">{label}</span>
    </label>
  )
}
