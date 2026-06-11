import React from 'react'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'muted' | 'primary' | 'secondary' | 'info' | 'success' | 'danger' | 'warning'
  className?: string
}

export const Badge = ({ children, variant = 'muted', className = '' }: BadgeProps) => {
  const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
    muted: 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))]',
    primary:
      'bg-[hsl(var(--primary-soft))] text-[hsl(var(--primary-soft-foreground))] border-[hsl(var(--primary))/0.2]',
    secondary:
      'bg-[hsl(var(--secondary-soft))] text-[hsl(var(--secondary-soft-foreground))] border-[hsl(var(--secondary))/0.2]',
    info: 'bg-[hsl(var(--info-soft))] text-[hsl(var(--info-foreground))] border-[hsl(var(--info))/0.2]',
    success: 'bg-[hsl(var(--success-soft))] text-[hsl(var(--success-foreground))] border-[hsl(var(--success))/0.2]',
    danger: 'bg-[hsl(var(--danger-soft))] text-[hsl(var(--danger))] border-[hsl(var(--danger))/0.2]',
    warning: 'bg-[hsl(var(--warning-soft))] text-[hsl(var(--warning-foreground))] border-[hsl(var(--warning))/0.2]'
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
