// src/components/layout/verticalnavbarcomponents/MenuItem.tsx:

"use client"

import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import Tooltip from '@/components/ui/Tooltip'
import { cn } from '@/lib/utils'

interface MenuItemProps {
  name: string
  path: string
  icon: LucideIcon
  isActive: boolean
  isCollapsed: boolean
}

export default function MenuItem({ name, path, icon: Icon, isActive, isCollapsed }: MenuItemProps) {
  return (
    <Tooltip content={name} disabled={!isCollapsed}>
      <Link
        href={path}
        className={cn(
          "flex items-center gap-3 rounded-lg py-2.5 transition-all cursor-pointer",
          isCollapsed ? 'justify-center px-0' : 'px-3',
          isActive
            ? 'bg-primary/20 text-foreground font-semibold'
            : 'text-foreground hover:bg-primary/20 font-medium'
        )}
      >
        <Icon size={20} className="shrink-0" />
        {!isCollapsed && <span className='text-sm whitespace-nowrap'>{name}</span>}
      </Link>
    </Tooltip>
  )
}
