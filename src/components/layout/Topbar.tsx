// src/components/layout/Topbar.tsx

'use client'

import Breadcrumbs from '@/components/layout/topbarcomponents/Breadcrumbs'
import ThemeToggle from '@/components/layout/topbarcomponents/ThemeToggle'
import NotificationBell from '@/components/layout/topbarcomponents/NotificationBell'
import GlobalSearch from '@/components/layout/topbarcomponents/GlobalSearch'
import UserDropdown from '@/components/layout/topbarcomponents/UserDropdown'
import { useAuth } from '@/providers/AuthProvider'

export default function Topbar() {
  const { user, logout } = useAuth()
  const userName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? 'Pengguna OSD'
  const userEmail = user?.email ?? 'Email tidak ditemukan'
  const userAvatar = user?.user_metadata?.avatar_url ?? null

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
        <UserDropdown userName={userName} userEmail={userEmail} userAvatar={userAvatar} onLogout={logout} />
      </div>
    </header>
  )
}
