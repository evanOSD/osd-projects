// src/components/layout/VerticalNavbar.tsx

'use client'

import { useState } from 'react'
import Cookies from 'js-cookie'

import MenuToggle from './verticalnavbarcomponents/MenuToggle'
import MenuLogo from './verticalnavbarcomponents/MenuLogo'
import MenuNavigation from './verticalnavbarcomponents/MenuNavigation'
import MenuFooter from './verticalnavbarcomponents/MenuFooter'

export default function VerticalNavbar({ defaultCollapsed = false }: { defaultCollapsed?: boolean }) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    Cookies.set('sidebarCollapsed', String(newState), { expires: 365 })
  }

  return (
    <aside
      className={`relative hidden flex-col border-r border-border bg-surface md:flex transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <MenuToggle isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      <MenuLogo isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      <MenuNavigation isCollapsed={isCollapsed} />
      <MenuFooter isCollapsed={isCollapsed} />
    </aside>
  )
}
