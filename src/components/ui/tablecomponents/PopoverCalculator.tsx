// src/components/ui/tablecomponents/PopoverCalculator.tsx

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface PopoverCalculatorProps {
  isOpen: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLElement | null>
  children: React.ReactNode
  className?: string
  matchTriggerWidth?: boolean
}

export function PopoverCalculator({
  isOpen,
  onClose,
  triggerRef,
  children,
  className = '',
  matchTriggerWidth = false
}: PopoverCalculatorProps) {
  const [mounted, setMounted] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState<{ top: number; left: number; width?: number }>({ top: -9999, left: -9999 })

  useEffect(() => setMounted(true), [])

  // Kalkulator Posisi & Event Listener
  useEffect(() => {
    if (!isOpen || !triggerRef.current || !popoverRef.current) return

    const updatePosition = () => {
      if (!triggerRef.current || !popoverRef.current) return
      const trigger = triggerRef.current.getBoundingClientRect()
      const popover = popoverRef.current.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight

      // Titik awal: tepat di bawah elemen pemicu
      let top = trigger.bottom + 4
      let left = trigger.left

      // Deteksi tabrakan bawah (Jika mentok layar bawah, buka ke atas)
      if (top + popover.height > vh) {
        top = trigger.top - popover.height - 4
        if (top < 8) top = 8 // Cegah terpotong di atas
      }

      // Deteksi tabrakan kanan (Geser ke kiri agar tidak terpotong)
      if (left + popover.width > vw) left = vw - popover.width - 8

      // Deteksi tabrakan kiri
      if (left < 0) left = 8

      setCoords({ top, left, width: matchTriggerWidth ? trigger.width : undefined })
    }

    updatePosition()

    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen, children, matchTriggerWidth, triggerRef])

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose, triggerRef])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div
      ref={popoverRef}
      style={{
        top: coords.top,
        left: coords.left,
        position: 'fixed',
        width: coords.width !== undefined ? `${coords.width}px` : undefined
      }}
      className={`z-100 ${className}`}
      onMouseDown={e => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body
  )
}
