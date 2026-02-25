// src/components/ThemeToggle.tsx

'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className='h-9 w-9' />
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className='cursor-pointer rounded-full p-2 text-muted hover:bg-accent hover:text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring'
      aria-label='Toggle Dark Mode'
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
