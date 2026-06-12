// src/app/(dashboard)/dummy/Buttons.tsx

import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'ghost-danger' | 'ghost-primary'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ElementType
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  icon: Icon,
  ...props
}: ButtonProps) => {
  const baseStyle =
    'inline-flex items-center justify-center cursor-pointer font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--ring))] disabled:bg-muted-foreground disabled:cursor-not-allowed disabled:active:scale-100 rounded-[var(--radius)] active:scale-90'

  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary-hover))] shadow-sm',
    secondary:
      'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary-hover))] shadow-sm',
    outline:
      'border-2 border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--muted-foreground))/0.3]',
    danger:
      'bg-[hsl(var(--danger))] text-[hsl(var(--danger-foreground))] hover:bg-[hsl(var(--danger-hover))] shadow-sm',
    ghost: 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] ',
    'ghost-danger': 'text-danger hover:bg-danger/10',
    'ghost-primary': 'text-primary hover:bg-[hsl(var(--primary-soft))]'
  }

  const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-6 text-base'
  }

  return (
    <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {Icon && <Icon className={`mr-2 ${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />}
      {children}
    </button>
  )
}
