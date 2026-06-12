import React, { useState, useRef, useEffect, useMemo } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'
import { PopoverCalculator } from '@/components/ui/tablecomponents/PopoverCalculator'

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
  const [searchQuery, setSearchQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Clear search query and activeIndex when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
      setActiveIndex(0)
    }
  }, [isOpen])

  // Filter opsi berdasarkan kata kunci pencarian
  const filteredOptions = useMemo(() => {
    return options.filter(opt =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [options, searchQuery])

  // Reset activeIndex whenever filteredOptions length changes
  useEffect(() => {
    setActiveIndex(0)
  }, [filteredOptions.length])

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && activeIndex >= 0 && dropdownRef.current) {
      const activeEl = dropdownRef.current.querySelector('[aria-current="true"]') as HTMLElement
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [activeIndex, isOpen])

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
      newValue = internalValue.filter(v => v !== val)
    } else {
      newValue = [...internalValue, val]
    }
    setInternalValue(newValue)
    onChange?.(newValue)
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

  // Handle keyboard keydown inside input search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(prev => (filteredOptions.length > 0 ? (prev + 1) % filteredOptions.length : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(prev => (filteredOptions.length > 0 ? (prev - 1 + filteredOptions.length) % filteredOptions.length : 0))
        break
      case 'Enter':
        e.preventDefault()
        if (filteredOptions.length > 0 && activeIndex >= 0 && activeIndex < filteredOptions.length) {
          handleSelect(filteredOptions[activeIndex].value)
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        buttonRef.current?.focus()
        break
      default:
        break
    }
  }

  // Handle keyboard keydown on trigger button
  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setIsOpen(true)
      }
    } else {
      if (e.key === 'Escape') {
        e.preventDefault()
        setIsOpen(false)
      }
    }
  }

  // Mendapatkan semua objek opsi yang sedang terpilih
  const selectedOptions = options.filter(opt => internalValue.includes(opt.value))

  return (
    <div className={`w-full ${className}`}>
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
          onKeyDown={handleTriggerKeyDown}
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
                  onClick={e => e.stopPropagation()}
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

        <PopoverCalculator
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          triggerRef={buttonRef}
          matchTriggerWidth={true}
        >
          <div
            ref={dropdownRef}
            className='bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded-(--radius) shadow-[0_10px_30px_-10px_hsl(var(--shadow-color)/0.2)] animate-dropdown overflow-hidden flex flex-col'
          >
            <div className='p-2 border-b border-[hsl(var(--border))] bg-[hsl(var(--subtle))]'>
              <input
                type='text'
                placeholder='Cari...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className='w-full px-3 py-1.5 text-sm bg-[hsl(var(--surface))] border border-[hsl(var(--input))] rounded-[calc(var(--radius)-4px)] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/20 focus:border-[hsl(var(--ring))] transition-all'
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
            <ul className='max-h-60 overflow-y-auto custom-scrollbar p-1 flex-1' role='listbox'>
              {filteredOptions.length === 0 ? (
                <li className='px-3 py-4 text-sm text-muted-foreground text-center cursor-default'>Tidak ada hasil</li>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = internalValue.includes(option.value)
                  const isActive = activeIndex === index
                  return (
                    <li
                      key={option.value}
                      role='option'
                      aria-selected={isSelected}
                      aria-current={isActive ? 'true' : undefined}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => handleSelect(option.value)}
                      className={`flex items-center justify-between px-3 py-2 my-0.5 text-sm rounded-[calc(var(--radius)-4px)] cursor-pointer transition-colors duration-150
                        ${
                          isSelected
                            ? 'bg-[hsl(var(--primary-soft))] text-[hsl(var(--primary-soft-foreground))] font-medium'
                            : isActive
                              ? 'bg-[hsl(var(--muted))] text-foreground font-medium ring-1 ring-[hsl(var(--ring))]/30'
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
        </PopoverCalculator>
      </div>

      {error && <p className='mt-1.5 text-sm text-[hsl(var(--danger))] animate-dropdown'>{error}</p>}
      {helperText && !error && <p className='mt-1.5 text-sm text-muted-foreground'>{helperText}</p>}
    </div>
  )
}
