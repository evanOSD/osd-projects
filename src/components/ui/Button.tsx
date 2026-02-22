// src/components/ui/Button.tsx

import type { ButtonHTMLAttributes } from 'react'
import { cn } from "@/lib/utils" // Menggunakan utilitas cn yang sudah ada di proyek Anda

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  isLoading?: boolean
}

export default function Button({ className, variant = 'primary', isLoading, children, ...props }: ButtonProps) {
  const variants = {
    // Primary menggunakan Cyan (Pastel di Light, Neon di Dark)
    primary: 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm',
    
    // Outline menggunakan border standar dan hover accent (sorotan halus)
    outline: 'border border-border bg-transparent hover:bg-accent text-foreground',
    
    // Ghost tanpa border, hanya teks dengan hover accent
    ghost: 'bg-transparent hover:bg-accent text-foreground',

    // Tambahan varian Danger jika sewaktu-waktu dibutuhkan (sudah ada di globals.css)
    danger: 'bg-danger text-danger-foreground hover:bg-danger-hover shadow-sm'
  }

  return (
    <button
      className={cn(
        'cursor-pointer inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-all outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className='mr-2 h-4 w-4 animate-spin' viewBox='0 0 24 24'>
          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' />
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          />
        </svg>
      )}
      {children}
    </button>
  )
}
