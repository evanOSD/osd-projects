// src/components/ui/tablecomponents/ColumnSortButton.tsx

"use client"

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import MainContentTooltip from "@/components/ui/MainContentTooltip"

interface ColumnSortButtonProps {
  isSorted: false | "asc" | "desc"
  onClick: ((event: unknown) => void) | undefined
}

export function ColumnSortButton({ isSorted, onClick }: ColumnSortButtonProps) {
  // Tombol dianggap aktif jika isSorted bernilai "asc" atau "desc" (bukan false)
  const isActive = isSorted !== false

  return (
    <MainContentTooltip content="Urutkan Kolom">
      <button
        onClick={onClick}
        className={`p-1 cursor-pointer rounded-md transition-colors outline-none shrink-0 ${
          isActive
            ? "bg-yellow-300/70 text-primary hover:bg-yellow-300/70"
            : "bg-muted/0 hover:bg-muted/10 text-primary"
        }`}
      >
        {{
          asc: <ArrowUp size={18} />,
          desc: <ArrowDown size={18} />,
        }[isSorted as string] ?? <ArrowUpDown size={18} />}
      </button>
    </MainContentTooltip>
  )
}
