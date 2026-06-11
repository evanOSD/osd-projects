// src/components/layout/Breadcrumbs.tsx

'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return null

  return (
    <nav className='flex items-center space-x-1 text-sm text-muted-foreground'>
      <Link href='/' className='hover:text-primary transition-colors'>
        <Home size={16} />
      </Link>

      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join('/')}`
        const isLast = index === segments.length - 1
        const title = segment.charAt(0).toUpperCase() + segment.slice(1)

        return (
          <div key={href} className='flex items-center space-x-1'>
            <ChevronRight size={16} className='text-muted shrink-0' />
            {isLast ? (
              <span className='font-semibold text-foreground'>{title}</span>
            ) : (
              <Link href={href} className='hover:text-primary transition-colors'>
                {title}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
