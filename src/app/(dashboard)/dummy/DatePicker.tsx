import React, { useState, useRef, useEffect } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from './Buttons'
import { PopoverCalculator } from '@/components/ui/tablecomponents/PopoverCalculator'

export interface DatePickerProps {
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

export const DatePicker = ({
  id,
  label,
  error,
  helperText,
  placeholder = 'Pilih tanggal...',
  value,
  onChange,
  className = '',
  disabled = false,
  isClearable = false
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<Date | undefined>(value)
  const [currentMonth, setCurrentMonth] = useState<Date>(value || new Date())

  // Fitur Robust: Mengontrol tampilan kalender utama, grid bulan, grid tahun, atau grid rentang tahun
  const [view, setView] = useState<'calendar' | 'month' | 'year' | 'year-range'>('calendar')
  const [yearRangeStart, setYearRangeStart] = useState<number>(new Date().getFullYear() - 4)

  const buttonRef = useRef<HTMLButtonElement>(null)

  // Reset ke halaman kalender utama setiap kali popover ditutup/dibuka kembali
  useEffect(() => {
    if (!isOpen) {
      setView('calendar')
    } else {
      setYearRangeStart(currentMonth.getFullYear() - 4)
    }
  }, [isOpen, currentMonth])

  // Sinkronisasi nilai dari props
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value)
      if (value) setCurrentMonth(value)
    }
  }, [value])

  // Navigasi Bulan manual (kalender utama)
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  // Pilih Tanggal
  const handleSelectDate = (date: Date) => {
    setInternalValue(date)
    onChange?.(date)
    setIsOpen(false)
  }

  // Pilih Hari Ini (Today Shortcut)
  const handleSelectToday = () => {
    const today = new Date()
    setInternalValue(today)
    setCurrentMonth(today)
    onChange?.(today)
    setIsOpen(false)
  }

  // Hapus Pilihan Tanggal (Clearable)
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setInternalValue(undefined)
    onChange?.(undefined)
    setView('calendar')
    setIsOpen(false)
  }

  // Logika Pembuatan Grid Kalender Bulanan
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i))
  }

  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

  // Format tanggal untuk tombol pemicu utama
  const formattedDate = internalValue
    ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(internalValue)
    : placeholder

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
                title='Hapus tanggal'
              >
                <X className='w-3.5 h-3.5' />
              </div>
            )}
            <CalendarIcon className='w-4 h-4 text-muted-foreground' />
          </div>
        </button>

        <PopoverCalculator isOpen={isOpen} onClose={() => setIsOpen(false)} triggerRef={buttonRef}>
          <div className='bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded-(--radius) shadow-[0_10px_30px_-10px_hsl(var(--shadow-color)/0.2)] animate-dropdown p-2.5 select-none w-[234px] text-foreground'>
            {/* 1. TAMPILAN UTAMA (KALENDER) */}
            {view === 'calendar' && (
              <>
                {/* Header Kalender dengan Tombol Bulan & Tahun Custom */}
                <div className='flex items-center justify-between mb-4'>
                  {/* Navigasi Kiri */}
                  <button
                    type='button'
                    onClick={prevMonth}
                    className='flex items-center justify-center w-7 h-7 rounded-md hover:bg-[hsl(var(--muted))] text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer active:scale-90 focus:outline-none'
                  >
                    <ChevronLeft size={18} strokeWidth={2.5} />
                  </button>

                  <div className='flex items-center gap-0.5'>
                    {/* Tombol Pilih Bulan (Ghost) */}
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='text-[11px] font-semibold px-2 h-7 rounded-md hover:bg-[hsl(var(--muted))] text-foreground'
                      onClick={() => setView('month')}
                    >
                      {MONTHS_ID[currentMonth.getMonth()]}
                    </Button>
                    {/* Tombol Pilih Tahun (Ghost) */}
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='text-[11px] font-semibold px-2 h-7 rounded-md hover:bg-[hsl(var(--muted))] text-foreground'
                      onClick={() => {
                        setYearRangeStart(currentMonth.getFullYear() - 4)
                        setView('year')
                      }}
                    >
                      {currentMonth.getFullYear()}
                    </Button>
                  </div>

                  {/* Navigasi Kanan */}
                  <button
                    type='button'
                    onClick={nextMonth}
                    className='flex items-center justify-center w-7 h-7 rounded-md hover:bg-[hsl(var(--muted))] text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer active:scale-90 focus:outline-none'
                  >
                    <ChevronRight size={18} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Grid Hari / Weekdays */}
                <div className='grid grid-cols-7 gap-1 text-center mb-1'>
                  {daysOfWeek.map(day => (
                    <div key={day} className='text-[9px] font-medium text-muted-foreground uppercase'>
                      {day}
                    </div>
                  ))}
                </div>

                {/* Grid Tanggal */}
                <div className='grid grid-cols-7 gap-1'>
                  {days.map((date, idx) => {
                    if (!date) return <div key={`empty-${idx}`} className='w-[25px] h-[25px]' />

                    const isSelected =
                      internalValue &&
                      date.getDate() === internalValue.getDate() &&
                      date.getMonth() === internalValue.getMonth() &&
                      date.getFullYear() === internalValue.getFullYear()

                    const isToday =
                      date.getDate() === new Date().getDate() &&
                      date.getMonth() === new Date().getMonth() &&
                      date.getFullYear() === new Date().getFullYear()

                    return (
                      <button
                        key={date.toISOString()}
                        type='button'
                        onClick={() => handleSelectDate(date)}
                        className={`w-[25px] h-[25px] flex items-center justify-center text-xs rounded-md transition-colors cursor-pointer focus:outline-none active:scale-95 duration-200
                          ${
                            isSelected
                              ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold shadow-sm'
                              : 'text-foreground hover:bg-[hsl(var(--primary-soft))] hover:text-[hsl(var(--primary-soft-foreground))]'
                          }
                          ${isToday && !isSelected ? 'text-primary font-bold bg-[hsl(var(--primary-soft))/0.5]' : ''}
                        `}
                      >
                        {date.getDate()}
                      </button>
                    )
                  })}
                </div>

                {/* Tombol Shortcut "Hapus" & "Hari Ini" */}
                <div className='mt-3 border-t border-[hsl(var(--border))] pt-2 flex items-center justify-between gap-2'>
                  <Button
                    type='button'
                    variant='ghost-danger'
                    size='sm'
                    className='text-[11px] font-semibold h-7 rounded-md'
                    onClick={handleClear}
                  >
                    Hapus
                  </Button>
                  <Button
                    type='button'
                    variant='ghost-primary'
                    size='sm'
                    className='text-[11px] font-semibold h-7 rounded-md'
                    onClick={handleSelectToday}
                  >
                    Hari Ini
                  </Button>
                </div>
              </>
            )}

            {/* 2. TAMPILAN PANEL BULAN */}
            {view === 'month' && (
              <div className='w-full'>
                <div className='flex items-center justify-between mb-4'>
                  <button
                    type='button'
                    onClick={() => setView('calendar')}
                    className='flex items-center justify-center w-7 h-7 rounded-md hover:bg-primary-hover text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer active:scale-90 focus:outline-none'
                  >
                    <ChevronLeft size={18} strokeWidth={2.5} />
                  </button>
                  <span className='text-[11px] font-semibold text-muted-foreground uppercase tracking-wider'>
                    Pilih Bulan
                  </span>
                  <div className='w-7' />
                </div>

                <div className='grid grid-cols-3 gap-1.5'>
                  {MONTHS_ID.map((monthName, index) => {
                    const isSelected = currentMonth.getMonth() === index
                    return (
                      <Button
                        key={monthName}
                        type='button'
                        variant={isSelected ? 'primary' : 'ghost'}
                        size='sm'
                        className={`h-8 text-[9px] rounded-md transition-all duration-150 ${
                          !isSelected &&
                          'text-foreground hover:!bg-[hsl(var(--primary-soft))] hover:!text-[hsl(var(--primary-soft-foreground))]'
                        }`}
                        onClick={() => {
                          const newMonth = new Date(currentMonth)
                          newMonth.setMonth(index)
                          setCurrentMonth(newMonth)
                          setView('calendar')
                        }}
                      >
                        {monthName}
                      </Button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 3. TAMPILAN PANEL TAHUN */}
            {view === 'year' && (
              <div className='w-full'>
                <div className='flex items-center justify-between mb-4'>
                  <button
                    type='button'
                    onClick={() => setYearRangeStart(yearRangeStart - 9)}
                    className='flex items-center justify-center w-7 h-7 rounded-md hover:bg-[hsl(var(--muted))] text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer active:scale-90 focus:outline-none'
                  >
                    <ChevronLeft size={18} strokeWidth={2.5} />
                  </button>

                  {/* Tombol Rentang Tahun (Ghost) untuk membuka Panel Rentang Tahun */}
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='text-[11px] font-semibold px-2 h-7 rounded-md hover:bg-[hsl(var(--muted))] text-foreground'
                    onClick={() => setView('year-range')}
                  >
                    {yearRangeStart} - {yearRangeStart + 8}
                  </Button>

                  <button
                    type='button'
                    onClick={() => setYearRangeStart(yearRangeStart + 9)}
                    className='flex items-center justify-center w-7 h-7 rounded-md hover:bg-[hsl(var(--muted))] text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer active:scale-90 focus:outline-none'
                  >
                    <ChevronRight size={18} strokeWidth={2.5} />
                  </button>
                </div>

                <div className='grid grid-cols-3 gap-1.5'>
                  {Array.from({ length: 9 }, (_, i) => yearRangeStart + i).map(yr => {
                    const isSelected = currentMonth.getFullYear() === yr
                    return (
                      <Button
                        key={yr}
                        type='button'
                        variant={isSelected ? 'primary' : 'ghost'}
                        size='sm'
                        className={`h-8 text-[10px] rounded-md transition-all duration-150 ${
                          !isSelected &&
                          'text-foreground hover:!bg-[hsl(var(--primary-soft))] hover:!text-[hsl(var(--primary-soft-foreground))]'
                        }`}
                        onClick={() => {
                          const newYear = new Date(currentMonth)
                          newYear.setFullYear(yr)
                          setCurrentMonth(newYear)
                          setView('calendar')
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
                    className='h-7 text-xs px-4 w-full rounded-md'
                    onClick={() => setView('calendar')}
                  >
                    Kembali
                  </Button>
                </div>
              </div>
            )}

            {/* 4. TAMPILAN PANEL RENTANG TAHUN (YEAR RANGE SELECTOR) */}
            {view === 'year-range' && (
              <div className='w-full'>
                <div className='flex items-center justify-between mb-4'>
                  <button
                    type='button'
                    onClick={() => setYearRangeStart(prev => prev - 81)}
                    className='flex items-center justify-center w-7 h-7 rounded-md hover:bg-[hsl(var(--muted))] text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer active:scale-90 focus:outline-none'
                  >
                    <ChevronLeft size={18} strokeWidth={2.5} />
                  </button>
                  <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                    Pilih Rentang
                  </span>
                  <button
                    type='button'
                    onClick={() => setYearRangeStart(prev => prev + 81)}
                    className='flex items-center justify-center w-7 h-7 rounded-md hover:bg-[hsl(var(--muted))] text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer active:scale-90 focus:outline-none'
                  >
                    <ChevronRight size={18} strokeWidth={2.5} />
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
                        className={`h-8 text-[8px] rounded-md transition-all duration-150 flex flex-col justify-center items-center ${
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
                    className='h-7 text-xs px-4 w-full rounded-md'
                    onClick={() => setView('year')}
                  >
                    Kembali
                  </Button>
                </div>
              </div>
            )}
          </div>
        </PopoverCalculator>
      </div>

      {error && <p className='mt-1.5 text-sm text-[hsl(var(--danger))] animate-dropdown'>{error}</p>}
      {helperText && !error && <p className='mt-1.5 text-sm text-muted-foreground'>{helperText}</p>}
    </div>
  )
}
