// src/components/ui/Input.tsx

import type { InputHTMLAttributes } from 'react'
import { cn } from "@/lib/utils"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="text-sm font-medium text-muted">{label}</label>}
      <input
        className={cn(
          "block w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-foreground shadow-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none placeholder:text-muted/60 sm:text-sm",
          error && "border-danger focus:border-danger focus:ring-danger",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
