// src/components/ui/tablecomponents/TableHeaderPin.tsx

'use client'

import { useState } from 'react'
import { Pin, PinOff } from 'lucide-react'
import { Column } from '@tanstack/react-table'
import MainContentTooltip from '@/components/ui/MainContentTooltip'

interface TableHeaderPinProps<TData, TValue> {
  column: Column<TData, TValue>
}

export function TableHeaderPin<TData, TValue>({ column }: TableHeaderPinProps<TData, TValue>) {
  const [isGhosting, setIsGhosting] = useState(false)
  if (!column.getCanPin()) return null
  const isPinned = column.getIsPinned()
  const handleTogglePin = () => {
    setIsGhosting(true)
    column.pin(isPinned ? false : 'left')
    setTimeout(() => {
      setIsGhosting(false)
    }, 150)
  }
  const ButtonContent = (
    <button
      onClick={handleTogglePin}
      className={`p-1 cursor-pointer rounded-md transition-colors outline-none shrink-0 ${
        isPinned ? 'bg-rose-300 text-primary hover:bg-rose-300' : 'bg-muted/0 hover:bg-muted/10 text-primary'
      }`}
    >
      {isPinned ? <PinOff size={18} /> : <Pin size={18} />}
    </button>
  )
  if (isGhosting) {
    return ButtonContent
  }
  return (
    <MainContentTooltip content={isPinned ? 'Unfreeze Kolom' : 'Freeze Kolom ke Kiri'}>
      {ButtonContent}
    </MainContentTooltip>
  )
}
