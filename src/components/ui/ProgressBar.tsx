// src/components/ui/ProgressBar.tsx

import React from 'react'

interface ProgressBarProps {
  value: number
  max?: number
  colorClass?: string // Contoh: "bg-emerald-500", "bg-primary"
}

export function ProgressBar({ value, max = 100, colorClass = 'bg-primary' }: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className='flex items-center gap-2 w-full min-w-25'>
      <div className='h-1.5 w-full bg-muted/30 rounded-full overflow-hidden'>
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className='text-xs font-medium text-muted-foreground w-8 text-right shrink-0'>
        {Math.round(percentage)}%
      </span>
    </div>
  )
}
