import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Clock, X } from 'lucide-react'
import { Button } from './Buttons'

export interface TimePickerProps {
  id?: string
  label?: string
  error?: string
  helperText?: string
  placeholder?: string
  value?: string // Format yang diharapkan: "HH:mm" (contoh: "14:30")
  onChange?: (time: string | undefined) => void
  className?: string
  disabled?: boolean
  isClearable?: boolean
}

export const TimePicker = ({
  id,
  label,
  error,
  helperText,
  placeholder = 'Pilih waktu...',
  value,
  onChange,
  className = '',
  disabled = false,
  isClearable = false
}: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<string | undefined>(value)
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})

  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const hoursListRef = useRef<HTMLUListElement>(null)
  const minutesListRef = useRef<HTMLUListElement>(null)

  const updateDropdownPosition = useCallback(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownStyle({
        position: 'fixed',
        top: `${rect.bottom + window.scrollY + 6}px`,
        left: `${rect.left + window.scrollX}px`,
        width: '180px', // Lebar disamakan dengan DatePicker
        zIndex: 100
      })
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition()
      window.addEventListener('scroll', updateDropdownPosition, true)
      window.addEventListener('resize', updateDropdownPosition)
      return () => {
        window.removeEventListener('scroll', updateDropdownPosition, true)
        window.removeEventListener('resize', updateDropdownPosition)
      }
    }
  }, [isOpen, updateDropdownPosition])

  // Menutup dropdown jika klik di luar
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const isClickInsideContainer = containerRef.current?.contains(event.target as Node)
      const isClickInsideDropdown = dropdownRef.current?.contains(event.target as Node)

      if (!isClickInsideContainer && !isClickInsideDropdown) {
        setIsOpen(false)
      }
    }

    if (isOpen) document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isOpen])

  // Sinkronisasi nilai dari props
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value)
    }
  }, [value])

  const scrollToSelectedTime = useCallback(() => {
    if (!isOpen || !internalValue) return

    const activeHourEl = hoursListRef.current?.querySelector('[data-selected="true"]')
    if (activeHourEl) {
      activeHourEl.scrollIntoView({ block: 'nearest', behavior: 'auto' })
    }

    const activeMinuteEl = minutesListRef.current?.querySelector('[data-selected="true"]')
    if (activeMinuteEl) {
      activeMinuteEl.scrollIntoView({ block: 'nearest', behavior: 'auto' })
    }
  }, [isOpen, internalValue])

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        scrollToSelectedTime()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen, internalValue, scrollToSelectedTime])

  // Generate daftar jam (00 - 23) dan menit (00 - 59)
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

  // Ekstrak jam dan menit yang sedang terpilih
  const currentHour = internalValue ? internalValue.split(':')[0] : ''
  const currentMinute = internalValue ? internalValue.split(':')[1] : ''

  const handleHourSelect = (h: string) => {
    const newTime = `${h}:${currentMinute || '00'}`
    setInternalValue(newTime)
    onChange?.(newTime)
  }

  const handleMinuteSelect = (m: string) => {
    const newTime = `${currentHour || '00'}:${m}`
    setInternalValue(newTime)
    onChange?.(newTime)
  }

  // Hapus Waktu
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setInternalValue(undefined)
    onChange?.(undefined)
    setIsOpen(false)
  }

  // Mengambil waktu laptop/sistem sekarang secara otomatis
  const handleSetNow = (e: React.MouseEvent) => {
    e.stopPropagation()
    const now = new Date()
    const h = now.getHours().toString().padStart(2, '0')
    const m = now.getMinutes().toString().padStart(2, '0')
    const newTime = `${h}:${m}`
    setInternalValue(newTime)
    onChange?.(newTime)
  }

  const timeContent = isOpen && (
    <div
      ref={dropdownRef}
      style={dropdownStyle}
      className='bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded-(--radius) shadow-[0_10px_30px_-10px_hsl(var(--shadow-color)/0.2)] animate-dropdown overflow-hidden flex flex-col select-none'
    >
      <div className='flex items-center justify-between px-4 py-2 border-b border-[hsl(var(--border))] bg-[hsl(var(--subtle))]'>
        <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider w-1/2 text-center'>
          Jam
        </span>
        <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider w-1/2 text-center'>
          Menit
        </span>
      </div>

      <div className='flex h-50 divide-x divide-[hsl(var(--border))]'>
        {/* Kolom Jam */}
        <ul ref={hoursListRef} className='w-1/2 overflow-y-auto custom-scrollbar p-1'>
          {hours.map(hour => {
            const isSelected = currentHour === hour
            return (
              <li
                key={`h-${hour}`}
                data-selected={isSelected}
                onClick={() => handleHourSelect(hour)}
                className={`text-center py-2 px-1 my-0.5 text-sm rounded-[calc(var(--radius)-4px)] cursor-pointer transition-colors duration-150
                  ${
                    isSelected
                      ? 'bg-[hsl(var(--primary-soft))] text-[hsl(var(--primary-soft-foreground))] font-semibold'
                      : 'text-[hsl(var(--popover-foreground))] hover:bg-[hsl(var(--primary-soft))] hover:text-[hsl(var(--primary-soft-foreground))]'
                  }
                `}
              >
                {hour}
              </li>
            )
          })}
        </ul>

        {/* Kolom Menit */}
        <ul ref={minutesListRef} className='w-1/2 overflow-y-auto custom-scrollbar p-1'>
          {minutes.map(minute => {
            const isSelected = currentMinute === minute
            return (
              <li
                key={`m-${minute}`}
                data-selected={isSelected}
                onClick={() => handleMinuteSelect(minute)}
                className={`text-center py-2 px-1 my-0.5 text-sm rounded-[calc(var(--radius)-4px)] cursor-pointer transition-colors duration-150
                  ${
                    isSelected
                      ? 'bg-[hsl(var(--primary-soft))] text-[hsl(var(--primary-soft-foreground))] font-semibold'
                      : 'text-[hsl(var(--popover-foreground))] hover:bg-[hsl(var(--primary-soft))] hover:text-[hsl(var(--primary-soft-foreground))]'
                  }
                `}
              >
                {minute}
              </li>
            )
          })}
        </ul>
      </div>

      {/* Tombol Shortcut "Hapus" & "Sekarang" */}
      <div className='p-2 border-t border-[hsl(var(--border))] bg-[hsl(var(--surface))] flex items-center justify-between gap-2'>
        <Button
          type='button'
          variant='ghost-danger'
          size='sm'
          className='text-xs font-semibold h-8 rounded-md w-1/2'
          onClick={handleClear}
        >
          Hapus
        </Button>
        <Button
          type='button'
          variant='ghost-primary'
          size='sm'
          className='text-xs font-semibold h-8 rounded-md w-1/2'
          onClick={handleSetNow}
        >
          Sekarang
        </Button>
      </div>
    </div>
  )

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {label && (
        <label htmlFor={id} className='block mb-1.5 text-sm font-medium text-foreground'>
          {label}
        </label>
      )}

      <div className='relative'>
        <button
          ref={buttonRef}
          type='button'
          id={id}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`flex items-center justify-between w-full pl-3 pr-2 py-2.5 bg-[hsl(var(--surface))] border rounded-(--radius) text-sm transition-all duration-200 cursor-pointer text-left
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${
              error
                ? 'border-[hsl(var(--danger))] focus:border-[hsl(var(--danger))] focus:ring-[hsl(var(--danger))/0.2]'
                : 'border-[hsl(var(--input))] focus:border-[hsl(var(--ring))] focus:ring-[hsl(var(--ring))/0.2] hover:border-[hsl(var(--border))]'
            }
            ${isOpen && !error ? 'border-[hsl(var(--ring))] ring-2 ring-[hsl(var(--ring))/0.2]' : ''}
            ${
              disabled
                ? 'bg-[hsl(var(--muted))] text-muted-foreground border-[hsl(var(--border))] shadow-none cursor-not-allowed'
                : 'text-foreground shadow-sm'
            }
          `}
        >
          <span className={`block truncate ${!internalValue ? 'text-[hsl(var(--muted-foreground))/0.8]' : ''}`}>
            {internalValue || placeholder}
          </span>

          <div className='flex items-center shrink-0 ml-1'>
            {isClearable && internalValue && !disabled && (
              <div
                onClick={handleClear}
                className='p-1 mr-0.5 text-muted-foreground hover:text-[hsl(var(--danger))] hover:bg-[hsl(var(--danger-soft))] rounded-full transition-colors'
                title='Hapus waktu'
              >
                <X className='w-3.5 h-3.5' />
              </div>
            )}
            <Clock className='w-4 h-4 text-muted-foreground' />
          </div>
        </button>

        {/* Render dropdown di luar container form untuk menghindari terpotongnya UI */}
        {isOpen && typeof document !== 'undefined' && createPortal(timeContent, document.body)}
      </div>

      {error && <p className='mt-1.5 text-sm text-[hsl(var(--danger))] animate-dropdown'>{error}</p>}
      {helperText && !error && <p className='mt-1.5 text-sm text-muted-foreground'>{helperText}</p>}
    </div>
  )
}
