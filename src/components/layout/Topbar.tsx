// src/components/layout/Topbar.tsx

'use client'

import Breadcrumbs from '@/components/layout/topbarcomponents/Breadcrumbs'
import ThemeToggle from '@/components/layout/topbarcomponents/ThemeToggle'
import NotificationBell from '@/components/layout/topbarcomponents/NotificationBell'
import GlobalSearch from '@/components/layout/topbarcomponents/GlobalSearch'
import UserDropdown from '@/components/layout/topbarcomponents/UserDropdown'

export default function Topbar() {
  return (
    <header className='sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur-md sm:px-6 lg:px-8 transition-colors'>
      <div className='flex items-center min-w-max pr-4'>
        <Breadcrumbs />
      </div>

      <div className='flex flex-1 items-center justify-center px-4 md:px-8 lg:px-12'>
        <GlobalSearch />
      </div>

      <div className='flex items-center gap-x-2 lg:gap-x-4'>
        <ThemeToggle />
        <NotificationBell />
        <UserDropdown />
      </div>
    </header>
  )
}
