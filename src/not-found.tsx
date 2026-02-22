// src/app/not-found.tsx

import Link from 'next/link'
import { H1, P } from '@/components/ui/Typography'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-center">
      <div className="space-y-6">
        <H1 className="text-6xl md:text-8xl text-primary">404</H1>
        <div className="space-y-2">
          <H1 className="text-2xl">Halaman Tidak Ditemukan</H1>
          <P className="text-muted max-w-md mx-auto">
            Maaf, halaman yang Anda cari mungkin telah dihapus, diubah namanya, atau memang tidak pernah ada.
          </P>
        </div>
        <div className="pt-4">
          <Link href="/">
            <Button variant="primary" className="px-8">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
