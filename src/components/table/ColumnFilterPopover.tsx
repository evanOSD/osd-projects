// src/components/table/ColumnFilterPopover.tsx

'use client'

import { useState } from 'react'

import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

type ColumnFilterPopoverProps = {
  col: string
  options?: { label: string; value: string }[]
  currentFilterValue: string
  onApply: (col: string, val: string) => void
}

const ColumnFilterPopover = ({ col, options, currentFilterValue, onApply }: ColumnFilterPopoverProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [tempValue, setTempValue] = useState(currentFilterValue)

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget)
    setTempValue(currentFilterValue)
  }

  const handleClose = () => setAnchorEl(null)

  const handleApply = () => {
    onApply(col, tempValue)
    handleClose()
  }

  const handleClear = () => {
    setTempValue('')
    onApply(col, '')
    handleClose()
  }

  const isFilterActive = !!currentFilterValue

  return (
    <>
      <IconButton size='small' onClick={handleOpen} color={isFilterActive ? 'primary' : 'default'}>
        <i className={`text-base ${isFilterActive ? 'ri-filter-3-fill' : 'ri-filter-3-line'}`} />
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <div className='flex flex-col gap-3 p-4 min-w-[250px]'>
          <span className='text-sm font-semibold'>Filter: {col.replace(/_/g, ' ').toUpperCase()}</span>

          {options && options.length > 0 ? (
            <TextField
              select
              size='small'
              fullWidth
              SelectProps={{ native: true }}
              value={tempValue}
              onChange={e => setTempValue(e.target.value)}
            >
              <option value=''>-- Semua --</option>
              {options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </TextField>
          ) : (
            <TextField
              size='small'
              autoFocus
              fullWidth
              placeholder='Ketik filter...'
              value={tempValue}
              onChange={e => setTempValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleApply()}
            />
          )}

          <div className='flex justify-end mt-1 gap-2'>
            <Button size='small' color='inherit' onClick={handleClear}>
              Clear
            </Button>
            <Button size='small' variant='contained' onClick={handleApply}>
              Terapkan
            </Button>
          </div>
        </div>
      </Popover>
    </>
  )
}

export default ColumnFilterPopover
