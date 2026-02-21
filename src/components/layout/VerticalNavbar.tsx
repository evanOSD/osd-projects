// src/components/layout/VerticalNavbar.tsx

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { BookOpen, Languages, Layers, ListTree, ChevronLeft, ChevronRight, ScrollText } from 'lucide-react'
import Tooltip from '@/components/ui/Tooltip'

export default function VerticalNavbar({ defaultCollapsed = false }: { defaultCollapsed?: boolean }) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const pathname = usePathname()

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    Cookies.set('sidebarCollapsed', String(newState), { expires: 365 })
  }

  const menuItems = [
    { name: 'Books', path: '/database/books', icon: BookOpen },
    { name: 'Stories', path: '/database/stories', icon: Layers },
    { name: 'Passages', path: '/database/passages', icon: ScrollText },
    { name: 'Languages', path: '/database/languages', icon: Languages },
    { name: 'Steps', path: '/database/steps', icon: ListTree }
  ]

  return (
    <aside
      className={`relative hidden flex-col border-r border-gray-200 dark:border-gray-800 md:flex transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* TOMBOL TOGGLE DI GARIS BORDER */}
      <button
        onClick={toggleSidebar}
        className='cursor-pointer absolute -right-3.5 top-6 z-50 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-gray-50 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400'
        aria-label='Toggle Sidebar'
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* AREA LOGO (Alignment dan Path Path Sudah Diperbaiki) */}
      <div
        className={`flex h-16 items-center border-b border-gray-200 dark:border-gray-800 overflow-hidden ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
      >
        <button
          onClick={toggleSidebar}
          // CATATAN ALIGNMENT: 'justify-center' ditambahkan di sini agar tombolnya memusatkan isi saat collapsed
          className={`flex items-center gap-3 cursor-pointer focus:outline-none group ${isCollapsed ? 'justify-center w-full' : 'w-full text-left'}`}
        >
          {/* Wadah Logo */}
          <div className='relative h-8 w-8 shrink-0 flex items-center justify-center transition-transform group-hover:scale-105'>
            {/* PATH DIPERBAIKI: Menggunakan 'logos/' */}
            <Image src='/images/logos/osd-logo.svg' alt='OSD Logo' fill className='object-contain' />
          </div>

          {!isCollapsed && (
            <span className='text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100 whitespace-nowrap transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400'>
              OSD Projects
            </span>
          )}
        </button>
      </div>

      {/* Navigasi Menu */}
      <nav className='flex-1 space-y-2 p-4 overflow-y-auto'>
        <p
          className={`mb-4 text-xs font-semibold uppercase text-gray-400 transition-all ${isCollapsed ? 'text-center' : ''}`}
        >
          {isCollapsed ? 'DB' : 'Database'}
        </p>

        {menuItems.map(item => {
          const isActive = pathname.startsWith(item.path)
          const Icon = item.icon

          return (
            <Tooltip key={item.path} content={item.name} disabled={!isCollapsed}>
              <Link
                href={item.path}
                className={`flex items-center gap-3 rounded-lg py-2.5 transition-all cursor-pointer ${
                  isCollapsed ? 'justify-center px-0' : 'px-3'
                } ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50'
                }`}
              >
                <Icon size={20} className={`shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                {!isCollapsed && <span className='text-sm font-medium whitespace-nowrap'>{item.name}</span>}
              </Link>
            </Tooltip>
          )
        })}
      </nav>
    </aside>
  )
}
