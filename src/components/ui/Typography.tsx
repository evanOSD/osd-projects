// src/components/ui/Typography.tsx

import * as React from 'react'
import { cn } from '@/lib/utils'

export const H1 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn('text-xl font-extrabold tracking-tight lg:text-2xl text-foreground', className)}
      {...props}
    />
  )
)
H1.displayName = 'H1'

export const H2 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-lg font-semibold tracking-tight first:mt-0 text-foreground', className)}
      {...props}
    />
  )
)
H2.displayName = 'H2'

export const H3 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-base font-semibold tracking-tight text-foreground', className)} {...props} />
  )
)
H3.displayName = 'H3'

export const P = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('leading-7 not-first:mt-6 text-foreground', className)} {...props} />
  )
)
P.displayName = 'P'

export const Muted = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn('text-base text-muted', className)} {...props} />
)
Muted.displayName = 'Muted'

export const Small = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <small ref={ref} className={cn('text-xs font-medium leading-none text-muted', className)} {...props} />
  )
)
Small.displayName = 'Small'

export const InlineCode = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref}
      className={cn(
        'relative rounded bg-secondary px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-secondary-foreground',
        className
      )}
      {...props}
    />
  )
)
InlineCode.displayName = 'InlineCode'
