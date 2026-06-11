// src/components/ui/RouteErrorListener.tsx
'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import ErrorModal from '@/components/ui/ErrorModal'

function ErrorListenerContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname() // Mengambil rute saat ini (misal: /home)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    // 1. Tangkap parameter dari URL
    const errorType = searchParams.get('error')
    const targetPath = searchParams.get('path')

    // 2. Jika ada surat tilang "access_denied"
    if (errorType === 'access_denied') {
      // Siapkan pesan error
      setErrorMessage(
        `Akses Ditolak! Role Anda saat ini tidak memiliki izin untuk membuka halaman ${targetPath || 'tersebut'}.`
      )

      // Munculkan Modal
      setIsModalOpen(true)

      // 3. BERSAMARKAN JEJAK: Bersihkan parameter dari URL tanpa me-reload halaman
      // Jadi http://localhost:3000/home?error=... akan kembali menjadi http://localhost:3000/home
      router.replace(pathname, { scroll: false })
    }
  }, [searchParams, pathname, router])

  return <ErrorModal isOpen={isModalOpen} message={errorMessage} onClose={() => setIsModalOpen(false)} />
}

// Dibungkus dengan Suspense agar Next.js tidak komplain saat proses build (karena menggunakan useSearchParams)
export default function RouteErrorListener() {
  return (
    <Suspense fallback={null}>
      <ErrorListenerContent />
    </Suspense>
  )
}
