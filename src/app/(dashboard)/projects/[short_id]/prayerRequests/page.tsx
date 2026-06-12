'use client'

import React from 'react'
import { Card } from '@/components/ui/Card'
import { MessageSquare } from 'lucide-react'

export default function PrayerRequestsPlaceholderPage() {
  return (
    <Card className='p-12 text-center flex flex-col items-center justify-center space-y-4 border-dashed border-2 border-[hsl(var(--border))]'>
      <div className='w-16 h-16 rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] flex items-center justify-center'>
        <MessageSquare size={32} />
      </div>
      <h3 className='text-xl font-bold text-foreground'>Prayer Requests</h3>
      <p className='text-sm text-muted-foreground max-w-sm'>
        Halaman Pokok Doa (Prayer Requests) sedang dalam pengembangan. Tim lapangan dapat membagikan kebutuhan doa mereka di sini.
      </p>
      <span className='inline-block px-3 py-1 bg-[hsl(var(--muted))] text-muted-foreground font-bold text-xs rounded-full uppercase tracking-wider'>
        Coming Soon
      </span>
    </Card>
  )
}
