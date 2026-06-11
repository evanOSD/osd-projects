// src/components/layout/verticalnavbarcomponents/MenuNavigation.tsx

'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useUserSettings } from '@/hooks/queries/users/useUserSettings'
import { APP_MENUS } from '../config/menus'
import MenuItem from './MenuItem'

export default function MenuNavigation({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname()
  const { user } = useAuth()

  // Ini akan memicu penciptaan default settings di backend jika belum ada
  const { data: settings, isLoading } = useUserSettings(user?.id)

  const filteredMenuItems = useMemo(() => {
    // Tahan render jika data dari database belum selesai diproses
    if (isLoading || !settings) return []

    return APP_MENUS.filter(menu => {
      // 1. Cek Preferensi Sembunyi
      if (settings.hidden_menus?.includes(menu.id)) return false
      const permission = settings.permissions?.[menu.id]
      return permission?.can_read === true
    })
  }, [settings, isLoading])

  // Tampilkan skeleton/loading sederhana saat API bekerja
  if (isLoading) {
    return (
      <nav className='flex-1 p-4 space-y-4'>
        <div className='h-10 w-full bg-muted/20 animate-pulse rounded-lg' />
        <div className='h-10 w-full bg-muted/20 animate-pulse rounded-lg' />
      </nav>
    )
  }

  return (
    <nav className='flex-1 space-y-2 p-4 overflow-y-auto'>
      {filteredMenuItems.map(item => {
        const isActive = pathname.startsWith(`/${item.id}`) || pathname.startsWith(item.path)

        return (
          <MenuItem
            key={item.id}
            name={item.name}
            path={item.path}
            icon={item.icon}
            isActive={isActive}
            isCollapsed={isCollapsed}
          />
        )
      })}
    </nav>
  )
}
