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
    return <div className='h-10 w-10 shrink-0' />
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className='flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border bg-surface transition-all hover:ring-2 hover:ring-primary focus:outline-none'
      aria-label='Toggle Dark Mode'
    >
      {theme === 'dark' ? (
        <Sun size={20} className='text-muted-foreground' />
      ) : (
        <Moon size={20} className='text-muted-foreground' />
      )}
    </button>
  )
}
