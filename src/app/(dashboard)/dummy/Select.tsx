import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check, X } from 'lucide-react'

export interface SelectOption {
  label: string
  value: string | number
}

export interface SelectProps {
  id?: string
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
  value?: string | number
  onChange?: (value: string | number | '') => void
  className?: string
  disabled?: boolean
  isClearable?: boolean // <-- Tambahan properti baru
}

export const Select = ({
  id,
  label,
  error,
  helperText,
  options,
  placeholder = 'Pilih salah satu...',
  value,
  onChange,
  className = '',
  disabled = false,
  isClearable = false // <-- Default false
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<string | number | undefined>(value)
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})

  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fungsi untuk mengkalkulasi posisi dropdown
  const updateDropdownPosition = useCallback(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      // Hitung posisi dropdown berdasarkan posisi tombol saat ini
      setDropdownStyle({
        position: 'fixed',
        top: `${rect.bottom + window.scrollY + 6}px`, // 6px jarak dari tombol
        left: `${rect.left + window.scrollX}px`,
        width: `${rect.width}px`,
        zIndex: 9999 // Z-index tinggi agar selalu di atas
      })
    }
  }, [isOpen])

  // Efek untuk update posisi saat resize/scroll
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

  // Efek untuk menutup dropdown ketika click di luar (tombol ATAU menu)
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

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value)
    }
  }, [value])

  const handleSelect = (val: string | number) => {
    setInternalValue(val)
    onChange?.(val)
    setIsOpen(false)
  }

  // Fungsi untuk menangani klik tombol hapus "X"
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation() // Mencegah dropdown terbuka saat menghapus
    setInternalValue(undefined)
    onChange?.('') // Kembalikan string kosong sebagai tanda terhapus
    setIsOpen(false)
  }

  const selectedOption = options.find(opt => opt.value === internalValue)

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
          options.map(option => (
            <li
              key={option.value}
              role='option'
              aria-selected={internalValue === option.value}
              onClick={() => handleSelect(option.value)}
              className={`flex items-center justify-between px-3 py-2 my-0.5 text-sm rounded-[calc(var(--radius)-4px)] cursor-pointer transition-colors duration-150
                ${
                  internalValue === option.value
                    ? 'bg-[hsl(var(--primary-soft))] text-[hsl(var(--primary-soft-foreground))] font-medium'
                    : 'text-[hsl(var(--popover-foreground))] hover:bg-[hsl(var(--muted))] hover:text-foreground'
                }
              `}
            >
              <span className='truncate'>{option.label}</span>
              {internalValue === option.value && <Check className='shrink-0 w-4 h-4 text-primary ml-2' />}
            </li>
          ))
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
          className={`flex items-center justify-between w-full pl-3 pr-2 py-2.5 bg-[hsl(var(--surface))] border rounded-(--radius) text-sm transition-all duration-200 cursor-pointer
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
          <span className={`block truncate ${!selectedOption ? 'text-[hsl(var(--muted-foreground))/0.8]' : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <div className='flex items-center shrink-0 ml-1'>
            {/* Tombol Hapus (Clear) */}
            {isClearable && selectedOption && !disabled && (
              <div
                onClick={handleClear}
                className='p-1 mr-0.5 text-muted-foreground hover:text-[hsl(var(--danger))] hover:bg-[hsl(var(--danger-soft))] rounded-full transition-colors'
                title='Hapus pilihan'
              >
                <X className='w-3.5 h-3.5' />
              </div>
            )}

            {/* Ikon Dropdown Bawaan */}
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
