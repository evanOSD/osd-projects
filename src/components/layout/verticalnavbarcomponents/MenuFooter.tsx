// src/components/layout/verticalnavbarcomponents/MenuFooter.tsx

'use client'

import Link from 'next/link'
import { HelpCircle } from 'lucide-react'
import Tooltip from '@/components/ui/Tooltip'
import { cn } from '@/lib/utils'

export default function MenuFooter({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div className='border-t border-border p-4 shrink-0'>
      <Tooltip content='Bantuan' disabled={!isCollapsed}>
        <Link
          href='/help'
          className={cn(
            'flex items-center gap-3 rounded-lg py-2.5 transition-all cursor-pointer text-foreground hover:bg-primary/20',
            isCollapsed ? 'justify-center px-0' : 'px-3'
          )}
        >
          <HelpCircle size={20} className='shrink-0' />
          {!isCollapsed && <span className='text-sm font-medium whitespace-nowrap'>Bantuan</span>}
        </Link>
      </Tooltip>
    </div>
  )
}
