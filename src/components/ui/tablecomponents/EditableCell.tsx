// src/components/ui/tablecomponents/EditableCell.tsx

'use client'

import { useState, useEffect } from 'react'
import { Row, Column, Table } from '@tanstack/react-table'
import { Copy, Check } from 'lucide-react'
import MainContentTooltip from '@/components/ui/MainContentTooltip'

interface EditableCellProps<TData, TValue> {
  getValue: () => TValue
  row: Row<TData>
  column: Column<TData, TValue>
  table: Table<TData>
  type?: 'text' | 'number' | 'date' | 'time' | 'datetime-local'
  displayComponent?: React.ReactNode
  className?: string
  isCopyable?: boolean
}

export function EditableCell<TData, TValue>({
  getValue,
  row,
  column,
  table,
  type = 'text',
  displayComponent,
  className = '',
  isCopyable = false
}: EditableCellProps<TData, TValue>) {
  const initialValue = getValue()
  const [value, setValue] = useState<any>(initialValue)
  const [isFocused, setIsFocused] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => setValue(initialValue), [initialValue])

  const handleSave = () => {
    if (value !== initialValue) {
      ;(table.options.meta as any)?.updateData(row.index, column.id, value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') (e.currentTarget as HTMLElement).blur()
    if (e.key === 'Escape') {
      setValue(initialValue)
      ;(e.currentTarget as HTMLElement).blur()
    }
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(String(value ?? ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='relative flex items-center w-full min-h-6 group'>
      <input
        type={type}
        value={value ?? ''}
        onChange={e => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false)
          handleSave()
        }}
        onKeyDown={handleKeyDown}
        className={`w-full bg-transparent border border-transparent px-2 py-1 -mx-2 rounded-sm text-sm outline-none transition-all z-10 cursor-text hover:border-border focus:bg-surface focus:border-primary focus:shadow-sm focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
          !isFocused && displayComponent
            ? 'text-transparent [&::-webkit-datetime-edit]:text-transparent'
            : 'text-foreground [&::-webkit-datetime-edit]:text-foreground'
        } ${className}`}
      />

      {!isFocused && displayComponent && (
        <div className={`absolute inset-0 pointer-events-none flex items-center px-2 -mx-2 text-sm z-0 ${className}`}>
          {displayComponent}
        </div>
      )}

      {isCopyable && !isFocused && (
        // --- TEMPLATE UNIVERSAL: Gunakan variabel bg-surface, border-border, bg-muted, dll ---
        <div className='hidden group-hover:flex absolute right-0 top-1/2 -translate-y-1/2 py-0.5 pl-2 z-10 bg-linear-to-l from-surface via-surface to-transparent'>
          <MainContentTooltip content={copied ? 'Tersalin!' : 'Salin'}>
            <button
              type='button'
              onClick={handleCopy}
              className='flex items-center justify-center w-6 h-6 rounded border border-border bg-surface hover:bg-primary/20 text-foreground shadow-sm cursor-pointer outline-none'
            >
              {copied ? (
                <Check size={12} className='text-green-500' strokeWidth={3} />
              ) : (
                <Copy size={12} strokeWidth={2.5} />
              )}
            </button>
          </MainContentTooltip>
        </div>
      )}
    </div>
  )
}
