// src/components/ui/TrendSparkline.tsx

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface TrendSparklineProps {
  value: number
  label?: string
  isPercentage?: boolean
}

export function TrendSparkline({ value, label, isPercentage = true }: TrendSparklineProps) {
  const isPositive = value > 0
  const isNegative = value < 0
  const displayValue = Math.abs(value)

  return (
    <div className='flex items-center gap-1.5 text-sm font-medium'>
      {isPositive ? (
        <TrendingUp size={16} className='text-success' />
      ) : isNegative ? (
        <TrendingDown size={16} className='text-danger' />
      ) : (
        <Minus size={16} className='text-muted-foreground' />
      )}
      <span
        className={
          isPositive ? 'text-success-foreground' : isNegative ? 'text-danger-foreground' : 'text-muted-foreground'
        }
      >
        {displayValue}
        {isPercentage && '%'}
      </span>
      {label && <span className='text-muted-foreground ml-1 font-normal text-xs'>{label}</span>}
    </div>
  )
}
