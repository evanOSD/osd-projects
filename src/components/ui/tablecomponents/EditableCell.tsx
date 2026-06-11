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

  useEffect(() => {
    if (!isFocused) {
      setValue(initialValue)
    }
  }, [initialValue, isFocused])

  const handleSave = () => {
    if (value !== initialValue) {
      ;(table.options.meta as any)?.updateData(row.index, column.id, value)
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
    <div className='relative flex w-full group min-h-7'>
      {!isFocused ? (
        /* MODE BACA: Berupa <div> biasa yang menampung teks wrapped */
        <div
          tabIndex={0}
          onFocus={() => setIsFocused(true)}
          className={`w-full px-2 py-1 -mx-2 rounded-sm text-sm cursor-text border border-transparent hover:border-border transition-colors whitespace-normal wrap-break-word outline-none focus:ring-1 focus:ring-primary/50 ${className}`}
        >
          {displayComponent || (value !== null && value !== undefined && String(value) !== '' ? String(value) : '')}
        </div>
      ) : type === 'text' ? (
        /* MODE EDIT (TEKS): Berupa <textarea> yang auto-resize sesuai konten */
        <textarea
          autoFocus
          value={value ?? ''}
          onChange={e => setValue(e.target.value)}
          onFocus={e => {
            // Memindahkan kursor ke ujung teks
            const val = e.target.value
            e.target.value = ''
            e.target.value = val
          }}
          onBlur={() => {
            setIsFocused(false)
            handleSave()
          }}
          onKeyDown={e => {
            // Tekan Enter biasa untuk Save. Tekan Shift+Enter untuk baris baru.
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              ;(e.currentTarget as HTMLElement).blur()
            }
            if (e.key === 'Escape') {
              setValue(initialValue)
              ;(e.currentTarget as HTMLElement).blur()
            }
          }}
          // CSS Hack untuk Auto-Height pada Textarea
          onInput={e => {
            e.currentTarget.style.height = 'auto'
            e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'
          }}
          ref={el => {
            if (el) {
              el.style.height = 'auto'
              el.style.height = el.scrollHeight + 'px'
            }
          }}
          rows={1}
          className={`w-full bg-surface border border-primary px-2 py-1 -mx-2 rounded-sm text-sm outline-none shadow-sm ring-1 ring-primary resize-none overflow-hidden whitespace-normal wrap-break-word ${className}`}
        />
      ) : (
        /* MODE EDIT (NON-TEKS - Date/Number): Tetap pakai input biasa */
        <input
          type={type}
          autoFocus
          value={value ?? ''}
          onChange={e => setValue(e.target.value)}
          onBlur={() => {
            setIsFocused(false)
            handleSave()
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') (e.currentTarget as HTMLElement).blur()
            if (e.key === 'Escape') {
              setValue(initialValue)
              ;(e.currentTarget as HTMLElement).blur()
            }
          }}
          className={`w-full bg-surface border border-primary px-2 py-1 -mx-2 min-h-7 rounded-sm text-sm outline-none shadow-sm ring-1 ring-primary ${className}`}
        />
      )}

      {isCopyable && !isFocused && (
        /* PERBAIKAN: Tombol copy menutupi pinggiran kanan layar dengan gradient penuh secara vertikal */
        <div className='hidden group-hover:flex absolute right-0 top-0 bottom-0 items-center py-0.5 pl-2 z-10 bg-linear-to-l from-surface via-surface to-transparent'>
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
