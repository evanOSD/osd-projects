import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check, X } from 'lucide-react'

export interface MultiSelectOption {
  label: string
  value: string | number
}

export interface MultiSelectProps {
  id?: string
  label?: string
  error?: string
  helperText?: string
  options: MultiSelectOption[]
  placeholder?: string
  value?: (string | number)[]
  onChange?: (value: (string | number)[]) => void
  className?: string
  disabled?: boolean
  isClearable?: boolean
}

export const MultiSelect = ({
  id,
  label,
  error,
  helperText,
  options,
  placeholder = 'Pilih beberapa...',
  value = [],
  onChange,
  className = '',
  disabled = false,
  isClearable = false
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<(string | number)[]>(value)
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})

  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fungsi untuk mengkalkulasi posisi dropdown
  const updateDropdownPosition = useCallback(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownStyle({
        position: 'fixed',
        top: `${rect.bottom + window.scrollY + 6}px`,
        left: `${rect.left + window.scrollX}px`,
        width: `${rect.width}px`,
        zIndex: 9999
      })
    }
  }, [isOpen])

  // Update posisi saat resize/scroll
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

  // Menutup dropdown saat klik di luar
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const isClickInsideContainer = containerRef.current?.contains(event.target as Node)
      const isClickInsideDropdown = dropdownRef.current?.contains(event.target as Node)

      if (!isClickInsideContainer && !isClickInsideDropdown) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOpen])

  // Sinkronisasi dengan props value
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value)
    }
  }, [value])

  // Menangani saat opsi diklik di dalam dropdown
  const handleSelect = (val: string | number) => {
    let newValue: (string | number)[]
    if (internalValue.includes(val)) {
      // Jika sudah ada, hapus dari array (deselect)
      newValue = internalValue.filter(v => v !== val)
    } else {
      // Jika belum ada, tambahkan ke array
      newValue = [...internalValue, val]
    }
    setInternalValue(newValue)
    onChange?.(newValue)
    // Tidak memanggil setIsOpen(false) di sini agar pengguna bisa memilih opsi lain sekaligus
  }

  // Menangani klik "X" pada satu chip/badge
  const handleRemoveItem = (e: React.MouseEvent, val: string | number) => {
    e.stopPropagation()
    const newValue = internalValue.filter(v => v !== val)
    setInternalValue(newValue)
    onChange?.(newValue)
  }

  // Menangani klik tombol hapus "X" utama (Clear All)
  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    setInternalValue([])
    onChange?.([])
    setIsOpen(false)
  }

  // Mendapatkan semua objek opsi yang sedang terpilih
  const selectedOptions = options.filter(opt => internalValue.includes(opt.value))

  // Render konten dropdown
  const dropdownContent = isOpen && (
    <div
      ref={dropdownRef}
      style={dropdownStyle}
      className='bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded-(--radius) shadow-[0_10px_30px_-10px_hsl(var(--shadow-color)/0.2)] animate-dropdown overflow-hidden'
    >
      <ul className='max-h-60 overflow-y-auto custom-scrollbar p-1' role='listbox'>
        {options.length === 0 ? (
          <li className='px-3 py-2 text-sm text-muted-foreground text-center cursor-default'>Tidak ada opsi</li>
        ) : (
          options.map(option => {
            const isSelected = internalValue.includes(option.value)
            return (
              <li
                key={option.value}
                role='option'
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                className={`flex items-center justify-between px-3 py-2 my-0.5 text-sm rounded-[calc(var(--radius)-4px)] cursor-pointer transition-colors duration-150
                  ${
                    isSelected
                      ? 'bg-[hsl(var(--primary-soft))] text-[hsl(var(--primary-soft-foreground))] font-medium'
                      : 'text-[hsl(var(--popover-foreground))] hover:bg-[hsl(var(--muted))] hover:text-foreground'
                  }
                `}
              >
                <span className='truncate'>{option.label}</span>
                {isSelected && <Check className='shrink-0 w-4 h-4 text-primary ml-2' />}
              </li>
            )
          })
        )}
      </ul>
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
          className={`flex items-center justify-between w-full pl-2 pr-2 py-1.5 min-h-11 bg-[hsl(var(--surface))] border rounded-(--radius) text-sm transition-all duration-200 cursor-pointer
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
          {/* Kontainer untuk Chip/Placeholder */}
          <div className='flex flex-wrap items-center gap-1 overflow-hidden flex-1'>
            {selectedOptions.length === 0 ? (
              <span className='block truncate px-1 text-[hsl(var(--muted-foreground))/0.8]'>{placeholder}</span>
            ) : (
              selectedOptions.map(opt => (
                <span
                  key={opt.value}
                  onClick={e => e.stopPropagation()} // Mencegah klik badge membuka/menutup dropdown
                  className='inline-flex items-center gap-1 px-2 py-1 rounded-[calc(var(--radius)-4px)] bg-[hsl(var(--muted))] text-foreground text-xs font-medium border border-[hsl(var(--border))] transition-colors hover:bg-[hsl(var(--border))]'
                >
                  {opt.label}
                  {!disabled && (
                    <X
                      className='w-3 h-3 cursor-pointer text-muted-foreground hover:text-[hsl(var(--danger))] transition-colors'
                      onClick={e => handleRemoveItem(e, opt.value)}
                    />
                  )}
                </span>
              ))
            )}
          </div>

          {/* Ikon Kanan (Clear All & Chevron) */}
          <div className='flex items-center shrink-0 ml-1 self-start mt-1.5'>
            {isClearable && selectedOptions.length > 0 && !disabled && (
              <div
                onClick={handleClearAll}
                className='p-1 mr-0.5 text-muted-foreground hover:text-[hsl(var(--danger))] hover:bg-[hsl(var(--danger-soft))] rounded-full transition-colors'
                title='Hapus semua pilihan'
              >
                <X className='w-3.5 h-3.5' />
              </div>
            )}

            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </button>

        {/* Gunakan createPortal untuk render dropdown di body */}
        {isOpen && typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
      </div>

      {error && <p className='mt-1.5 text-sm text-[hsl(var(--danger))] animate-dropdown'>{error}</p>}
      {helperText && !error && <p className='mt-1.5 text-sm text-muted-foreground'>{helperText}</p>}
    </div>
  )
}
