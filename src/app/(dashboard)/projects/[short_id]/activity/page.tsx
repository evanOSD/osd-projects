'use client'

import React from 'react'
import { Card } from '@/components/ui/Card'
import { Activity } from 'lucide-react'

export default function ActivityPlaceholderPage() {
  return (
    <Card className='p-12 text-center flex flex-col items-center justify-center space-y-4 border-dashed border-2 border-[hsl(var(--border))]'>
      <div className='w-16 h-16 rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] flex items-center justify-center'>
        <Activity size={32} />
      </div>
      <h3 className='text-xl font-bold text-foreground'>Activity Log</h3>
      <p className='text-sm text-muted-foreground max-w-sm'>
        Halaman Log Aktivitas sedang dalam pengembangan. Semua log audit, penambahan, dan pembaruan data proyek akan tercatat di sini secara transparan.
      </p>
      <span className='inline-block px-3 py-1 bg-[hsl(var(--muted))] text-muted-foreground font-bold text-xs rounded-full uppercase tracking-wider'>
        Coming Soon
      </span>
    </Card>
  )
}
