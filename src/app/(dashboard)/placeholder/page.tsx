'use client'

import React, { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/app/(dashboard)/dummy/Buttons'
import { Alert } from '@/app/(dashboard)/dummy/Alerts'

interface CardProps {
  children: React.ReactNode
  className?: string
}

const Card = ({ children, className = '' }: CardProps) => (
  <div
    className={`bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-[calc(var(--radius)*1.5)] border border-[hsl(var(--border))] shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </div>
)

function PlaceholderContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pageName = searchParams.get('page') || 'Halaman Baru'

  return (
    <div className='p-6 max-w-4xl mx-auto space-y-6 mt-10'>
      <Card className='p-8 text-center space-y-6 max-w-xl mx-auto border-dashed border-2 border-[hsl(var(--border))] bg-[hsl(var(--subtle))]'>
        <div className='w-16 h-16 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] rounded-full flex items-center justify-center mx-auto'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-8 h-8'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 7.5h.008v.008H12v-.008Z'
            />
          </svg>
        </div>

        <div className='space-y-2'>
          <h1 className='text-2xl font-bold text-foreground'>{pageName}</h1>
          <p className='text-muted-foreground text-sm max-w-md mx-auto'>
            Halaman ini adalah placeholder untuk fitur <strong>{pageName}</strong>. Halaman yang sebenarnya belum dibuat karena sedang dalam tahap pengembangan.
          </p>
        </div>

        <Alert type='info' title='Informasi'>
          Semua tombol dan navigasi di sidebar telah di-link ke placeholder ini untuk memberikan gambaran fungsionalitas dan navigasi sidebar.
        </Alert>

        <div className='flex justify-center gap-4'>
          <Button variant='outline' onClick={() => router.back()}>
            Kembali
          </Button>
          <Button variant='primary' onClick={() => router.push('/dummy/stories')}>
            Kembali ke Stories
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default function PlaceholderPage() {
  return (
    <Suspense fallback={<div className='p-6 text-center text-muted-foreground'>Memuat placeholder...</div>}>
      <PlaceholderContent />
    </Suspense>
  )
}
