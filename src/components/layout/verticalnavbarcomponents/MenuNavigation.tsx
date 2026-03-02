// src/components/layout/verticalnavbarcomponents/MenuNavigation.tsx

'use client'

import { usePathname } from 'next/navigation'
import { House, Database, Users } from 'lucide-react'
import MenuItem from './MenuItem'

const menuItems = [
  { name: 'Dashboard', path: '/home', icon: House },
  { name: 'Database', path: '/database/books', icon: Database },
  { name: 'Users', path: '/users', icon: Users }
]

export default function MenuNavigation({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname()

  return (
    <nav className='flex-1 space-y-2 p-4 overflow-y-auto'>
      {menuItems.map(item => {
        const isActive = item.name === 'Database' ? pathname.startsWith('/database') : pathname.startsWith(item.path)

        return (
          <MenuItem
            key={item.path}
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
