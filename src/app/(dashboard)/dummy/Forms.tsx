import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = ({ label, error, helperText, className = '', id, ...props }: InputProps) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className='block mb-1.5 text-sm font-medium text-foreground'>
          {label}
        </label>
      )}
      <input
        id={id}
        className={`block w-full px-3 py-2.5 bg-[hsl(var(--surface))] border rounded-(--radius) text-sm text-foreground transition-colors
          focus:outline-none focus:ring-2 focus:ring-offset-0
          ${
            error
              ? 'border-[hsl(var(--danger))] focus:border-[hsl(var(--danger))] focus:ring-[hsl(var(--danger))/0.2]'
              : 'border-[hsl(var(--input))] focus:border-[hsl(var(--ring))] focus:ring-[hsl(var(--ring))/0.2] hover:border-[hsl(var(--border))]'
          }
          disabled:bg-[hsl(var(--muted))] disabled:text-muted-foreground disabled:border-[hsl(var(--border))] disabled:shadow-none
        `}
        {...props}
      />
      {error && <p className='mt-1.5 text-sm text-[hsl(var(--danger))]'>{error}</p>}
      {helperText && !error && <p className='mt-1.5 text-sm text-muted-foreground'>{helperText}</p>}
    </div>
  )
}
