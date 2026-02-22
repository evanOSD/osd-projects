// src/components/layout/Breadcrumbs.tsx

"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumbs() {
  const pathname = usePathname()
  
  // Memecah URL menjadi potongan-potongan (misal: /database/books -> ['database', 'books'])
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted">
      <Link href="/" className="hover:text-primary transition-colors">
        <Home size={16} />
      </Link>
      
      {segments.map((segment, index) => {
        // Membuat link untuk setiap potongan
        const href = `/${segments.slice(0, index + 1).join('/')}`
        const isLast = index === segments.length - 1
        // Mengubah huruf pertama menjadi kapital (misal: 'database' -> 'Database')
        const title = segment.charAt(0).toUpperCase() + segment.slice(1)

        return (
          <div key={href} className="flex items-center space-x-1">
            <ChevronRight size={16} className="text-muted shrink-0" />
            {isLast ? (
              <span className="font-semibold text-foreground">{title}</span>
            ) : (
               // Segmen yang bisa diklik jika belum di halaman terakhir
              <Link href={href} className="hover:text-primary transition-colors">
                {title}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
