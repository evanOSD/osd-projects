// src/components/ui/tablecomponents/ColumnSortButton.tsx

'use client'

import { ArrowDownZA, ArrowUpAZ, ArrowUpDown } from 'lucide-react'
import MainContentTooltip from '@/components/ui/MainContentTooltip'

interface ColumnSortButtonProps {
  isSorted: false | 'asc' | 'desc'
  onClick: ((event: unknown) => void) | undefined
}

export function ColumnSortButton({ isSorted, onClick }: ColumnSortButtonProps) {
  const isActive = isSorted !== false

  const tooltipContent =
    isSorted === 'asc' ? 'Hapus Urutan' : isSorted === 'desc' ? 'Urutkan Menaik (A-Z)' : 'Urutkan Menurun (Z-A)'

  return (
    <MainContentTooltip content={tooltipContent}>
      <button
        onClick={onClick}
        className={`p-1 cursor-pointer rounded-md transition-colors outline-none shrink-0 ${
          isActive
            ? 'bg-yellow-300/70 text-primary hover:bg-yellow-300/70'
            : 'bg-muted/0 hover:bg-muted/10 text-primary'
        }`}
      >
        {{
          asc: <ArrowUpAZ size={18} />,
          desc: <ArrowDownZA size={18} />
        }[isSorted as string] ?? <ArrowUpDown size={18} />}
      </button>
    </MainContentTooltip>
  )
}
