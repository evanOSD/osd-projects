// src/components/ui/tablecomponents/ColumnSortButton.tsx

"use client"

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import MainContentTooltip from "@/components/ui/MainContentTooltip"

interface ColumnSortButtonProps {
  isSorted: false | "asc" | "desc"
  onClick: ((event: unknown) => void) | undefined
}

export function ColumnSortButton({ isSorted, onClick }: ColumnSortButtonProps) {
  return (
    <MainContentTooltip content="Urutkan Kolom">
      <button
        onClick={onClick}
        className="p-1 cursor-pointer rounded-md bg-muted/0 hover:bg-muted/10 text-primary transition-colors outline-none shrink-0"
      >
        {{
          asc: <ArrowUp size={18} className="text-primary" />,
          desc: <ArrowDown size={18} className="text-primary" />,
        }[isSorted as string] ?? <ArrowUpDown size={18} />}
      </button>
    </MainContentTooltip>
  )
}
