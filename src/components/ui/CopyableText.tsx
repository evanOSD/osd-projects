// src/components/ui/CopyableText.tsx

'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import MainContentTooltip from '@/components/ui/MainContentTooltip'

interface CopyableTextProps {
  text: string
  children?: React.ReactNode
  className?: string
}

export function CopyableText({ text, children, className = '' }: CopyableTextProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Gagal menyalin teks: ', err)
    }
  }

  return (
    <div className={`group flex items-center justify-between w-full min-w-0 gap-2 ${className}`}>
      <div className='truncate flex-1'>{children || text}</div>
      <div className='hidden group-hover:flex items-center justify-end shrink-0'>
        <MainContentTooltip content={isCopied ? 'Tersalin!' : 'Salin'}>
          <button
            type='button'
            onClick={handleCopy}
            className='flex items-center justify-center w-6 h-6 rounded border border-border bg-surface hover:bg-muted text-foreground shadow-sm cursor-pointer outline-none'
          >
            {/* PERBAIKAN: text-green-500 diganti text-success */}
            {isCopied ? (
              <Check size={12} className='text-success' strokeWidth={3} />
            ) : (
              <Copy size={12} strokeWidth={2.5} />
            )}
          </button>
        </MainContentTooltip>
      </div>
    </div>
  )
}
