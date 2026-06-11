import React from 'react'
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children: React.ReactNode
}

export const Alert = ({ type = 'info', title, children }: AlertProps) => {
  const types: Record<
    NonNullable<AlertProps['type']>,
    { bg: string; border: string; text: string; icon: React.ReactNode }
  > = {
    info: {
      bg: 'bg-[hsl(var(--info-soft))]',
      border: 'border-[hsl(var(--info))/0.3]',
      text: 'text-[hsl(var(--info-foreground))]',
      icon: <Info className='w-5 h-5 text-[hsl(var(--info))]' />
    },
    success: {
      bg: 'bg-[hsl(var(--success-soft))]',
      border: 'border-[hsl(var(--success))/0.3]',
      text: 'text-[hsl(var(--success-foreground))]',
      icon: <CheckCircle className='w-5 h-5 text-[hsl(var(--success))]' />
    },
    warning: {
      bg: 'bg-[hsl(var(--warning-soft))]',
      border: 'border-[hsl(var(--warning))/0.3]',
      text: 'text-[hsl(var(--warning-foreground))]',
      icon: <AlertTriangle className='w-5 h-5 text-[hsl(var(--warning))]' />
    },
    error: {
      bg: 'bg-[hsl(var(--danger-soft))]',
      border: 'border-[hsl(var(--danger))/0.3]',
      text: 'text-[hsl(var(--danger))]',
      icon: <XCircle className='w-5 h-5 text-[hsl(var(--danger))]' />
    }
  }

  const selected = types[type]

  return (
    <div className={`p-4 rounded-(--radius) border ${selected.bg} ${selected.border} flex items-start space-x-3`}>
      <div className='shrink-0 mt-0.5'>{selected.icon}</div>
      <div>
        {title && <h3 className={`text-sm font-semibold mb-1 ${selected.text}`}>{title}</h3>}
        <div className={`text-sm ${selected.text} opacity-90`}>{children}</div>
      </div>
    </div>
  )
}
