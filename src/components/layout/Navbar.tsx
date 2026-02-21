// src/components/layout/Navbar.tsx

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-blue-600">OSD</span>
            <span className="text-xl font-light text-gray-400">|</span>
            <span className="text-sm font-medium text-gray-600 uppercase tracking-widest">Portal</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/help" className="text-sm text-gray-500 hover:text-gray-900">Bantuan</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
