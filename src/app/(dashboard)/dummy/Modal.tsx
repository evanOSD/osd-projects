import React from 'react'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export const Modal = ({ isOpen, onClose, title, children, footer, className = 'max-w-lg' }: ModalProps) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-white/20 animate-backdrop-in'>
      <div
        className={`relative w-full bg-[hsl(var(--surface))] rounded-(--radius) border border-[hsl(var(--border))] shadow-xl shadow-[hsl(var(--shadow-color))/0.1] animate-modal-slide-down-in ${className}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-4 md:p-5 border-b border-[hsl(var(--border))]'>
          <h3 className='text-xl font-semibold text-[hsl(var(--surface-foreground))]'>{title}</h3>
          <button
            onClick={onClose}
            className='p-1.5 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--muted))] rounded-(--radius) transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Body */}
        <div className='p-4 md:p-5 text-foreground'>{children}</div>

        {/* Footer */}
        {footer && (
          <div className='flex items-center justify-end p-4 md:p-5 border-t border-[hsl(var(--border))] bg-[hsl(var(--subtle))] rounded-b-(--radius) space-x-3'>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

