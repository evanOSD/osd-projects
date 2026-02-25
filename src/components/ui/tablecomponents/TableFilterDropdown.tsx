// src/components/ui/tablecomponents/TableFilterDropdown.tsx

'use client'

import React, { useState, useRef } from 'react'
import { Filter, Check, Loader2 } from 'lucide-react'
import { PopoverCalculator } from './PopoverCalculator' // <--- 1. Gunakan Kalkulator kita

interface TableFilterDropdownProps {
  label: string
  selectedValues: string[]
  onFilterChange: (values: string[]) => void
  // --- 2. TERIMA DATA DARI LUAR SEBAGAI PROPS ---
  options: { label: string; value: string }[]
  isLoading?: boolean
}

export function TableFilterDropdown({
  label,
  selectedValues,
  onFilterChange,
  options,
  isLoading = false
}: TableFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const toggleValue = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value]
    onFilterChange(newValues)
  }

  const isActive = selectedValues.length > 0

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors outline-none cursor-pointer ${
          isActive || isOpen
            ? 'bg-primary/10 border-primary text-primary'
            : 'bg-background border-border text-foreground hover:bg-muted/10'
        }`}
      >
        <Filter size={16} />
        <span>{label}</span>
        {isActive && (
          <span className='flex items-center justify-center w-5 h-5 ml-1 text-[10px] rounded-full bg-primary text-primary-foreground'>
            {selectedValues.length}
          </span>
        )}
      </button>

      {/* --- 3. GANTI LOGIKA PORTAL DENGAN POPOVER CALCULATOR --- */}
      <PopoverCalculator
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        triggerRef={triggerRef}
        className='w-56 p-2 bg-surface border border-border rounded-xl shadow-xl z-100 flex flex-col gap-1 animate-in fade-in zoom-in-95'
      >
        <div className='text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-2 pt-1'>Filter {label}</div>

        <div className='flex flex-col max-h-60 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full'>
          {isLoading ? (
            <div className='flex items-center justify-center py-4 text-muted'>
              <Loader2 size={16} className='animate-spin' />
            </div>
          ) : options.length === 0 ? (
            <div className='text-center py-3 text-xs text-muted'>Tidak ada opsi</div>
          ) : (
            options.map(opt => {
              const isSelected = selectedValues.includes(opt.value)
              return (
                <label
                  key={opt.value}
                  className='flex items-center gap-2.5 w-full px-2 py-1.5 text-sm rounded-md transition-colors cursor-pointer hover:bg-primary/10 hover:text-primary group'
                >
                  <div
                    className={`flex items-center justify-center w-4 h-4 rounded-sm border transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-muted-foreground/30 bg-background group-hover:border-primary'
                    }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>
                  <span className='truncate select-none'>{opt.label}</span>
                </label>
              )
            })
          )}
        </div>

        {isActive && (
          <>
            <div className='w-full h-px bg-border my-1'></div>
            <button
              type='button'
              onClick={() => {
                onFilterChange([])
                setIsOpen(false)
              }}
              className='w-full py-1.5 text-xs font-medium text-danger hover:bg-danger/10 rounded-md transition-colors cursor-pointer'
            >
              Hapus Filter
            </button>
          </>
        )}
      </PopoverCalculator>
    </>
  )
}
