// src/components/ui/tablecomponents/ResetColumnButton.tsx

"use client"

import { RotateCcw } from "lucide-react"
import MainContentTooltip from "@/components/ui/MainContentTooltip"

interface ResetColumnButtonProps {
  onClick: () => void
}

export function ResetColumnButton({ onClick }: ResetColumnButtonProps) {
  return (
    <MainContentTooltip content="Reset Urutan Kolom ke Posisi Awal">
      <button
        onClick={onClick}
        className="p-2.5 cursor-pointer rounded-md border border-border bg-surface text-muted hover:text-foreground hover:bg-muted/10 transition-colors shrink-0"
      >
        <RotateCcw size={16} />
      </button>
    </MainContentTooltip>
  )
}
