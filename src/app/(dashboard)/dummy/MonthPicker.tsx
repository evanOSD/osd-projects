import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from './Buttons'

export interface MonthPickerProps {
  id?: string
  label?: string
  error?: string
  helperText?: string
  placeholder?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  className?: string
  disabled?: boolean
  isClearable?: boolean
}

const MONTHS_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
]

export const MonthPicker = ({
  id,
  label,
  error,
  helperText,
  placeholder = 'Pilih bulan...',
  value,
  onChange,
  className = '',
  disabled = false,
  isClearable = false
}: MonthPickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<Date | undefined>(value)
  const [currentYear, setCurrentYear] = useState<number>((value || new Date()).getFullYear())
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})

  // Fitur Robust: Mengontrol tampilan kalender utama (pilih bulan), grid tahun, atau grid rentang tahun
  const [view, setView] = useState<'month' | 'year' | 'year-range'>('month')
  const [yearRangeStart, setYearRangeStart] = useState<number>((value || new Date()).getFullYear() - 4)

  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Mengkalkulasi posisi popover kalender secara dinamis
  const updateDropdownPosition = useCallback(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownStyle({
        position: 'fixed',
        top: `${rect.bottom + window.scrollY + 6}px`,
        left: `${rect.left + window.scrollX}px`,
        width: '288px', // Membatasi lebar tetap agar sama dengan DatePicker
        zIndex: 9999
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

  // Reset ke halaman utama (pilih bulan) setiap kali popover ditutup/dibuka kembali
  useEffect(() => {
    if (!isOpen) {
      setView('month')
    } else {
      setYearRangeStart(currentYear - 4)
    }
  }, [isOpen, currentYear])

  // Menutup kalender jika klik di luar
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
      if (value) setCurrentYear(value.getFullYear())
    }
  }, [value])

  // Navigasi Tahun manual
  const nextYear = () => {
    setCurrentYear(prev => prev + 1)
  }
  const prevYear = () => {
    setCurrentYear(prev => prev - 1)
  }

  // Pilih Bulan
  const handleSelectMonth = (monthIndex: number) => {
    const selectedDate = new Date(currentYear, monthIndex, 1)
    setInternalValue(selectedDate)
    onChange?.(selectedDate)
    setIsOpen(false)
  }

  // Pilih Bulan Ini (Current Month Shortcut)
  const handleSelectThisMonth = () => {
    const today = new Date()
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    setInternalValue(thisMonth)
    setCurrentYear(today.getFullYear())
    onChange?.(thisMonth)
    setIsOpen(false)
  }

  // Hapus Pilihan
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setInternalValue(undefined)
    onChange?.(undefined)
    setView('month')
    setIsOpen(false)
  }

  // Format tanggal untuk tombol pemicu utama
  const formattedDate = internalValue
    ? new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(internalValue)
    : placeholder

  // Konten Kalender yang akan di-render di dalam React Portal
  const calendarContent = isOpen && (
    <div
      ref={dropdownRef}
      style={dropdownStyle}
      className='bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded-(--radius) shadow-[0_10px_30px_-10px_hsl(var(--shadow-color)/0.2)] animate-dropdown p-3 select-none w-[288px] text-foreground'
    >
      {/* 1. TAMPILAN UTAMA (PILIH BULAN) */}
      {view === 'month' && (
        <>
          {/* Header Kalender dengan Tombol Navigasi Tahun */}
          <div className='flex items-center justify-between mb-4'>
            {/* Navigasi Kiri */}
            <button
              type='button'
              onClick={prevYear}
              className='flex items-center justify-center w-9 h-9 rounded-md hover:bg-[hsl(var(--muted))] text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer active:scale-90 focus:outline-none'
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>

            <div className='flex items-center justify-center'>
              {/* Tombol Pilih Tahun (Ghost) */}
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='text-xs font-semibold px-4 h-8 rounded-md hover:bg-[hsl(var(--muted))] text-foreground'
                onClick={() => {
                  setYearRangeStart(currentYear - 4)
                  setView('year')
                }}
              >
                {currentYear}
              </Button>
            </div>

            {/* Navigasi Kanan */}
            <button
              type='button'
              onClick={nextYear}
              className='flex items-center justify-center w-9 h-9 rounded-md hover:bg-[hsl(var(--muted))] text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer active:scale-90 focus:outline-none'
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* Grid Bulan: 4 Baris x 3 Kolom */}
          <div className='grid grid-cols-3 gap-1.5'>
            {MONTHS_ID.map((monthName, index) => {
              const isSelected =
                internalValue &&
                internalValue.getMonth() === index &&
                internalValue.getFullYear() === currentYear

              return (
                <Button
                  key={monthName}
                  type='button'
                  variant={isSelected ? 'primary' : 'ghost'}
                  size='sm'
                  className={`h-10 text-[11px] rounded-md transition-all duration-150 ${
                    !isSelected &&
                    'text-foreground hover:!bg-[hsl(var(--primary-soft))] hover:!text-[hsl(var(--primary-soft-foreground))]'
                  }`}
                  onClick={() => handleSelectMonth(index)}
                >
                  {monthName}
                </Button>
              )
            })}
          </div>

          {/* Tombol Shortcut "Hapus" & "Bulan Ini" */}
          <div className='mt-3 border-t border-[hsl(var(--border))] pt-2 flex items-center justify-between gap-2'>
            <Button
              type='button'
              variant='ghost-danger'
              size='sm'
              className='text-xs font-semibold h-8 rounded-md'
              onClick={handleClear}
            >
              Hapus
            </Button>
            <Button
              type='button'
              variant='ghost-primary'
              size='sm'
              className='text-xs font-semibold h-8 rounded-md'
              onClick={handleSelectThisMonth}
            >
              Bulan Ini
            </Button>
          </div>
        </>
      )}

      {/* 2. TAMPILAN PANEL TAHUN */}
      {view === 'year' && (
        <div className='w-full'>
          <div className='flex items-center justify-between mb-4'>
            <button
              type='button'
              onClick={() => setYearRangeStart(yearRangeStart - 9)}
              className='flex items-center justify-center w-9 h-9 rounded-md hover:bg-[hsl(var(--muted))] text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer active:scale-90 focus:outline-none'
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>

            {/* Tombol Rentang Tahun (Ghost) untuk membuka Panel Rentang Tahun */}
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='text-xs font-semibold px-2 h-8 rounded-md hover:bg-[hsl(var(--muted))] text-foreground'
              onClick={() => setView('year-range')}
            >
              {yearRangeStart} - {yearRangeStart + 8}
            </Button>

            <button
              type='button'
              onClick={() => setYearRangeStart(yearRangeStart + 9)}
              className='flex items-center justify-center w-9 h-9 rounded-md hover:bg-[hsl(var(--muted))] text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer active:scale-90 focus:outline-none'
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>

          <div className='grid grid-cols-3 gap-1.5'>
            {Array.from({ length: 9 }, (_, i) => yearRangeStart + i).map(yr => {
              const isSelected = currentYear === yr
              return (
                <Button
                  key={yr}
                  type='button'
                  variant={isSelected ? 'primary' : 'ghost'}
                  size='sm'
                  className={`h-10 text-xs rounded-md transition-all duration-150 ${
                    !isSelected &&
                    'text-foreground hover:!bg-[hsl(var(--primary-soft))] hover:!text-[hsl(var(--primary-soft-foreground))]'
                  }`}
                  onClick={() => {
                    setCurrentYear(yr)
                    setView('month')
                  }}
                >
                  {yr}
                </Button>
              )
            })}
          </div>

          <div className='mt-3 border-t border-[hsl(var(--border))] pt-3'>
            <Button
              type='button'
              variant='ghost-danger'
              size='sm'
              className='h-8 text-xs px-4 w-full rounded-md'
              onClick={() => setView('month')}
            >
              Kembali
            </Button>
          </div>
        </div>
      )}

      {/* 3. TAMPILAN PANEL RENTANG TAHUN */}
      {view === 'year-range' && (
        <div className='w-full'>
          <div className='flex items-center justify-between mb-4'>
            <button
              type='button'
              onClick={() => setYearRangeStart(prev => prev - 81)}
              className='flex items-center justify-center w-9 h-9 rounded-md hover:bg-[hsl(var(--muted))] text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer active:scale-90 focus:outline-none'
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>Pilih Rentang</span>
            <button
              type='button'
              onClick={() => setYearRangeStart(prev => prev + 81)}
              className='flex items-center justify-center w-9 h-9 rounded-md hover:bg-[hsl(var(--muted))] text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer active:scale-90 focus:outline-none'
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>

          <div className='grid grid-cols-3 gap-1.5'>
            {Array.from({ length: 9 }, (_, i) => {
              const start = yearRangeStart + (i - 4) * 9
              const end = start + 8
              const isCurrentRange = start === yearRangeStart
              return (
                <Button
                  key={`${start}-${end}`}
                  type='button'
                  variant={isCurrentRange ? 'primary' : 'ghost'}
                  size='sm'
                  className={`h-10 text-[10px] rounded-md transition-all duration-150 flex flex-col justify-center items-center ${
                    !isCurrentRange &&
                    'text-foreground hover:!bg-[hsl(var(--primary-soft))] hover:!text-[hsl(var(--primary-soft-foreground))]'
                  }`}
                  onClick={() => {
                    setYearRangeStart(start)
                    setView('year')
                  }}
                >
                  <span>{start}</span>
                  <span className='opacity-50 text-[8px] leading-1.5'>-</span>
                  <span>{end}</span>
                </Button>
              )
            })}
          </div>

          <div className='mt-3 border-t border-[hsl(var(--border))] pt-3'>
            <Button
              type='button'
              variant='ghost-danger'
              size='sm'
              className='h-8 text-xs px-4 w-full rounded-md'
              onClick={() => setView('year')}
            >
              Kembali
            </Button>
          </div>
        </div>
      )}
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
            {formattedDate}
          </span>

          <div className='flex items-center shrink-0 ml-1'>
            {isClearable && internalValue && !disabled && (
              <div
                onClick={handleClear}
                className='p-1 mr-0.5 text-muted-foreground hover:text-[hsl(var(--danger))] hover:bg-[hsl(var(--danger-soft))] rounded-full transition-colors'
                title='Hapus bulan'
              >
                <X className='w-3.5 h-3.5' />
              </div>
            )}
            <CalendarIcon className='w-4 h-4 text-muted-foreground' />
          </div>
        </button>

        {isOpen && typeof document !== 'undefined' && createPortal(calendarContent, document.body)}
      </div>

      {error && <p className='mt-1.5 text-sm text-[hsl(var(--danger))] animate-dropdown'>{error}</p>}
      {helperText && !error && <p className='mt-1.5 text-sm text-muted-foreground'>{helperText}</p>}
    </div>
  )
}
