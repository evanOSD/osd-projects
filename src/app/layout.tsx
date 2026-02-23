// src/app/layout.tsx

import type { Metadata } from 'next' // 1. Tambahkan import Metadata
import './globals.css'
import { Inter } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

// 2. Tambahkan Konfigurasi Metadata Global
export const metadata: Metadata = {
  title: {
    template: "%s | OSD Projects", // Cetakan dinamis
    default: "Dashboard | OSD Projects", // Jika halaman tidak punya judul
  },
  description: "Portal Internal Staff OSD",
  // 3. BLOKIR SEMUA SEARCH ENGINE (noindex, nofollow)
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextTopLoader color="hsl(var(--primary))" showSpinner={false} />
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
