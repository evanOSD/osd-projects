// src/components/layout/verticalnavbarcomponents/MenuLogo.tsx

"use client"

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface MenuLogoProps {
  isCollapsed: boolean
  onToggle: () => void
}

export default function MenuLogo({ isCollapsed, onToggle }: MenuLogoProps) {
  return (
    <div className={cn(
      "flex h-16 shrink-0 items-center border-b border-border overflow-hidden",
      isCollapsed ? 'justify-center px-0' : 'px-4'
    )}>
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center gap-3 cursor-pointer focus:outline-none group",
          isCollapsed ? 'justify-center w-full' : 'w-full text-left'
        )}
      >
        <div className='relative h-8 w-8 shrink-0 flex items-center justify-center transition-transform group-hover:scale-105'>
          <Image src='/images/logos/osd-logo.svg' alt='OSD Logo' fill className='object-contain' />
        </div>

        {!isCollapsed && (
          <span className='text-lg font-extrabold tracking-tight text-foreground whitespace-nowrap transition-colors group-hover:text-primary'>
            OSD Projects
          </span>
        )}
      </button>
    </div>
  )
}
