// src/components/ui/Badge.tsx

import React from 'react'

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'secondary'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  children: React.ReactNode
}

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary text-secondary-foreground',
    success: 'bg-success/40 text-success-foreground',
    warning: 'bg-warning/40 text-warning-foreground',
    danger: 'bg-danger/10 text-danger',
    info: 'bg-info/20 text-info-foreground',
    outline: 'border border-border text-foreground bg-transparent'
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
