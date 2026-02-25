// src/components/ui/MainContentTooltip.tsx

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface MainContentTooltipProps {
  children: React.ReactNode
  content: string
}

export default function MainContentTooltip({ children, content }: MainContentTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })

  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return

    const target = triggerRef.current.getBoundingClientRect()
    const tooltip = tooltipRef.current.getBoundingClientRect()

    // Posisi default: di atas tombol dengan jarak 8px
    let top = target.top - tooltip.height - 8
    let left = target.left + target.width / 2 - tooltip.width / 2

    const vw = window.innerWidth
    const vh = window.innerHeight
    const padding = 12

    // Deteksi batas kanan (95%)
    if (left + tooltip.width > vw * 0.95) {
      left = vw - tooltip.width - padding
    }
    // Deteksi batas kiri
    if (left < vw * 0.05) {
      left = padding
    }
    // Deteksi batas atas: Jika mentok atas, pindah ke bawah tombol
    if (top < vh * 0.05) {
      top = target.bottom + 8
    }

    setCoords({ top, left })
  }

  useEffect(() => {
    if (isVisible) {
      updatePosition()
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
    }
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isVisible])

  return (
    <>
      <div
        ref={triggerRef}
        className='inline-block'
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      {mounted &&
        isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            style={{ top: coords.top, left: coords.left, position: 'fixed' }}
            className='pointer-events-none z-50 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-lg'
          >
            {content}
          </div>,
          document.body
        )}
    </>
  )
}
