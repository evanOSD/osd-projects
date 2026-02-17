// src/components/table/EditableCell.tsx

'use client'

import { useState, useEffect } from 'react'

import InputBase from '@mui/material/InputBase'

type EditableCellProps = {
  initialValue: any
  onSave: (val: string) => void
  theme: any
  options?: { label: string; value: string }[]
}

const EditableCell = ({ initialValue, onSave, theme, options }: EditableCellProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [localValue, setLocalValue] = useState(initialValue || '')

  useEffect(() => {
    setLocalValue(initialValue || '')
  }, [initialValue])

  const handleFinishEdit = () => {
    setIsEditing(false)
    onSave(localValue)
  }

  if (isEditing) {
    if (options) {
      return (
        <select
          autoFocus
          value={localValue}
          onChange={e => {
            setLocalValue(e.target.value)
            onSave(e.target.value)
            setIsEditing(false)
          }}
          onBlur={() => setIsEditing(false)}
          style={{
            width: '100%',
            padding: '4px',
            borderRadius: '4px',
            border: `2px solid ${theme.palette.primary.main}`,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontSize: 'inherit'
          }}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )
    }

    return (
      <InputBase
        autoFocus
        value={localValue}
        onChange={e => setLocalValue(e.target.value)}
        onBlur={handleFinishEdit}
        onKeyDown={e => {
          if (e.key === 'Enter') handleFinishEdit()
        }}
        sx={{
          width: '100%',
          fontSize: 'inherit',
          '& .MuiInputBase-input': {
            padding: '4px 8px',
            borderRadius: 1,
            backgroundColor: theme.palette.background.paper,
            boxShadow: `0 0 0 2px ${theme.palette.primary.main}`
          }
        }}
      />
    )
  }

  const displayLabel = options ? options.find(o => o.value === localValue)?.label || localValue : localValue

  return (
    <div
      onClick={() => setIsEditing(true)}
      className='flex items-center w-full min-h-[30px] px-2 py-1 transition-colors rounded cursor-text hover:bg-black/5 dark:hover:bg-white/10'
    >
      {displayLabel !== null && displayLabel !== '' ? (
        displayLabel
      ) : (
        <span className='text-xs italic text-gray-400 opacity-0 hover:opacity-50'>klik untuk isi</span>
      )}
    </div>
  )
}

export default EditableCell
