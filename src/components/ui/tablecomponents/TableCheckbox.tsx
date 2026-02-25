// src/components/ui/tablecomponents/TableCheckbox.tsx

'use client'

import { HTMLProps, useEffect, useRef } from 'react'

interface TableCheckboxProps extends HTMLProps<HTMLInputElement> {
  indeterminate?: boolean
}

export function TableCheckbox({ indeterminate, className = '', ...rest }: TableCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate, rest.checked])

  return (
    <input
      type='checkbox'
      ref={ref}
      className={`w-4 h-4 rounded border-border text-primary focus:ring-1 focus:ring-primary bg-background cursor-pointer accent-primary ${className}`}
      {...rest}
    />
  )
}
