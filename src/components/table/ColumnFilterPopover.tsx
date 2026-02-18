// src/components/table/ColumnFilterPopover.tsx

'use client'

import { useState, useMemo } from 'react'

import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import { alpha, useTheme } from '@mui/material/styles' // 1. Import Theme Utils

type ColumnFilterPopoverProps = {
  col: string
  options?: { label: string; value: string }[]
  currentFilterValue: string | string[]
  onApply: (col: string, val: string[]) => void
  tableData: any[]
  sortConfig?: { column: string; ascending: boolean } | null
}

const formatColumnLabel = (text: string) => {
  return text
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase())
}

const filterOptionsLimit = createFilterOptions<{ label: string; value: string }>({
  limit: 50,
})

const ColumnFilterPopover = ({ 
  col, 
  options, 
  currentFilterValue, 
  onApply, 
  tableData,
  sortConfig 
}: ColumnFilterPopoverProps) => {
  const theme = useTheme() // 2. Init Theme
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const initialValue = Array.isArray(currentFilterValue) 
    ? currentFilterValue 
    : (currentFilterValue ? [currentFilterValue] : [])
    
  const [tempValue, setTempValue] = useState<string[]>(initialValue)
  
  // 3. State baru untuk menahan teks pencarian agar tidak hilang
  const [inputValue, setInputValue] = useState('') 

  const filterOptions = useMemo(() => {
    if (options && options.length > 0) return options
    if (!tableData || tableData.length === 0) return []

    const sortColumn = sortConfig?.column || 'id'
    const isAscending = sortConfig?.ascending ?? true
    const uniqueMap = new Map<string, any>()

    tableData.forEach(row => {
      const rawVal = row[col]

      if (rawVal !== null && rawVal !== undefined && rawVal !== '') {
        const strVal = String(rawVal)

        if (!uniqueMap.has(strVal)) {
          uniqueMap.set(strVal, row[sortColumn])
        }
      }
    })

    const sortedUniqueVals = Array.from(uniqueMap.entries()).sort((a, b) => {
      const valA = a[1]
      const valB = b[1]

      if (valA == null && valB == null) return 0
      if (valA == null) return isAscending ? 1 : -1
      if (valB == null) return isAscending ? -1 : 1

      if (typeof valA === 'number' && typeof valB === 'number') {
        return isAscending ? valA - valB : valB - valA
      }

      const strA = String(valA).toLowerCase()
      const strB = String(valB).toLowerCase()
      
      if (strA < strB) return isAscending ? -1 : 1
      if (strA > strB) return isAscending ? 1 : -1
      
      return 0
    })

    return sortedUniqueVals.map(([val]) => ({ label: val, value: val }))
  }, [tableData, col, options, sortConfig])

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget)
    setTempValue(Array.isArray(currentFilterValue) ? currentFilterValue : (currentFilterValue ? [currentFilterValue] : []))
  }

  const handleClose = () => setAnchorEl(null)

  const handleApply = () => {
    onApply(col, tempValue)
    handleClose()
  }

  const handleClear = () => {
    setTempValue([])
    setInputValue('') // Clear input juga saat tombol Clear ditekan
    onApply(col, [])
    handleClose()
  }

  const isFilterActive = tempValue.length > 0 || (Array.isArray(currentFilterValue) && currentFilterValue.length > 0)

  return (
    <>
      <IconButton 
        size='small' 
        onClick={handleOpen} 

        // 4. LOGIKA WARNA TOMBOL: Jika aktif, warna Primary dengan Background semi-transparan
        sx={{ 
          color: isFilterActive ? theme.palette.primary.main : 'default',
          backgroundColor: isFilterActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
          '&:hover': {
            backgroundColor: isFilterActive ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.action.active, 0.05)
          }
        }}
      >
        <i className={`text-base ${isFilterActive ? 'ri-filter-3-fill' : 'ri-filter-3-line'}`} />
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        transitionDuration={150} 
      >
        <div className='flex flex-col gap-3 p-4 min-w-[300px]'>
          <span className='text-sm font-semibold'>Filter: {formatColumnLabel(col)}</span>

          <Autocomplete
            multiple
            limitTags={3}
            options={filterOptions}
            disableCloseOnSelect
            filterOptions={filterOptionsLimit}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            value={filterOptions.filter(opt => tempValue.includes(opt.value))}
            onChange={(_event, newValue) => {
              setTempValue(newValue.map(v => v.value))
            }}
            
            // 5. FITUR PERTAHANAN INPUT: Jangan hapus teks saat user memilih item!
            inputValue={inputValue}
            onInputChange={(_, newInputValue, reason) => {
              // Jika reason adalah 'reset' (biasanya terjadi setelah select), JANGAN hapus teksnya
              if (reason === 'reset') return
              setInputValue(newInputValue)
            }}

            renderOption={(props, option, { selected }) => {
              const { key, ...otherProps } = props as any

              return (
                <li key={key} {...otherProps} style={{ padding: '4px 8px' }}>
                  <Checkbox size="small" style={{ marginRight: 8, padding: 0 }} checked={selected} />
                  <span className="truncate">{option.label}</span>
                </li>
              )
            }}
            renderInput={(params) => (
              <TextField {...params} size='small' placeholder='Cari / Pilih nilai...' autoFocus />
            )}
          />

          <div className='flex justify-end mt-1 gap-2'>
            <Button size='small' color='inherit' onClick={handleClear}>Clear</Button>
            <Button size='small' variant='contained' onClick={handleApply}>Terapkan</Button>
          </div>
        </div>
      </Popover>
    </>
  )
}

export default ColumnFilterPopover
