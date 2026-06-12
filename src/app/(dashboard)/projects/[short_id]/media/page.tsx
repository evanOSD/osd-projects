'use client'

import React from 'react'
import { Card } from '@/components/ui/Card'
import { Image } from 'lucide-react'

export default function MediaPlaceholderPage() {
  return (
    <Card className='p-12 text-center flex flex-col items-center justify-center space-y-4 border-dashed border-2 border-[hsl(var(--border))]'>
      <div className='w-16 h-16 rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] flex items-center justify-center'>
        <Image size={32} />
      </div>
      <h3 className='text-xl font-bold text-foreground'>Media</h3>
      <p className='text-sm text-muted-foreground max-w-sm'>
        Halaman Media sedang dalam pengembangan dan akan segera hadir. Anda dapat mengunggah dokumentasi foto dan video proyek di sini nanti.
      </p>
      <span className='inline-block px-3 py-1 bg-[hsl(var(--muted))] text-muted-foreground font-bold text-xs rounded-full uppercase tracking-wider'>
        Coming Soon
      </span>
    </Card>
  )
}
