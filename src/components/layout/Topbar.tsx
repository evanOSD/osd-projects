// src/components/layout/Topbar.tsx

'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun, User } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Topbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Mencegah error Hydration (karena server tidak tahu tema komputer user)
  useEffect(() => setMounted(true), [])

  return (
    <header className='sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80 transition-colors duration-200'>
      <div className='flex items-center gap-4'>
        {/* Bisa diisi Breadcrumbs atau Search bar nanti */}
        <h1 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>Portal Internal</h1>
      </div>

      <div className='flex items-center gap-4'>
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className='cursor-pointer rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 transition-all'
            aria-label='Toggle Dark Mode'
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}

        <div className='flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'>
          <User size={18} />
        </div>
      </div>
    </header>
  )
}
