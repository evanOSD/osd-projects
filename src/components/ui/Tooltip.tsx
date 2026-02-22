// src/components/ui/Tooltip.tsx
"use client"

import { ReactNode, useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"

interface TooltipProps {
  children: ReactNode
  content: string
  disabled?: boolean
}

export default function Tooltip({ children, content, disabled = false }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setCoords({
        top: rect.top + rect.height / 2, 
        left: rect.right + 12,           
      })
      setIsVisible(true)
    }
  }

  if (disabled) return <>{children}</>

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
        className="w-full"
      >
        {children}
      </div>
      
      {mounted && isVisible && createPortal(
        <div
          // Menggunakan bg-foreground dan text-background agar tooltip menonjol
          className="pointer-events-none fixed z-50 animate-tooltip whitespace-nowrap rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-xl"
          style={{ top: coords.top, left: coords.left }}
        >
          {content}
          <div className="absolute -left-1 top-1/2 -mt-1 h-2 w-2 rotate-45 bg-foreground" />
        </div>,
        document.body
      )}
    </>
  )
}
