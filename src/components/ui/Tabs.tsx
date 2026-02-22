// src/components/ui/Tabs.tsx

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface TabItem {
  name: string
  path: string
}

export function PageTabs({ tabs }: { tabs: TabItem[] }) {
  const pathname = usePathname()

  return (
    // sticky top-0 akan membuatnya menempel tepat di bawah Topbar saat di-scroll
    <div className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border px-6 pt-4">
      <nav className="flex space-x-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tabs.map((tab) => {
          // Logika aktif: Benar-benar di path tersebut, atau di dalam sub-path tersebut
          const isActive = pathname === tab.path || pathname.startsWith(`${tab.path}/`)
          
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={cn(
                "whitespace-nowrap pb-3 border-b-2 text-sm font-semibold transition-colors",
                isActive
                  ? "border-primary text-primary" // Aktif: Garis & teks Cyan
                  : "border-transparent text-muted hover:text-foreground hover:border-border"
              )}
            >
              {tab.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
