// src/components/layout/verticalnavbarcomponents/MenuToggle.tsx

"use client"

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MenuToggleProps {
  isCollapsed: boolean
  onToggle: () => void
}

export default function MenuToggle({ isCollapsed, onToggle }: MenuToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "cursor-pointer absolute -right-3.5 top-6 z-50 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface text-muted shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring hover:bg-accent hover:text-primary"
      )}
      aria-label='Toggle Sidebar'
    >
      {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
    </button>
  )
}
