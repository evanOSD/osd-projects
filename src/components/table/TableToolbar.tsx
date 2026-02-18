'use client'

import { useState } from 'react'

// MUI Imports
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import InputAdornment from '@mui/material/InputAdornment'
import { alpha, useTheme } from '@mui/material/styles'

type TableToolbarProps = {
  tableName: string
  selectedCount: number
  hasUnsavedChanges: boolean
  onSave: () => void
  onDiscard: () => void
  onDeleteSelected: () => void
  onAddRow: () => void
  globalFilter: string
  setGlobalFilter: (val: string) => void
  
  // Props untuk Show/Hide Columns
  columns: string[]
  hiddenColumns: string[]
  onToggleColumn: (column: string) => void
}

// Helper untuk format label kolom di Menu (misal: "user_name" -> "User Name")
const formatLabel = (str: string) => {
  return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const TableToolbar = (props: TableToolbarProps) => {
  const {
    tableName,
    selectedCount,
    hasUnsavedChanges,
    onSave,
    onDiscard,
    onDeleteSelected,
    onAddRow,
    globalFilter,
    setGlobalFilter,
    columns,
    hiddenColumns,
    onToggleColumn
  } = props

  const theme = useTheme()

  // --- STATE MENU KOLOM ---
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(selectedCount > 0 && {
          bgcolor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        }),
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'space-between',
        py: 2
      }}
    >
      {/* BAGIAN KIRI: Judul atau Info Select */}
      <div className='flex items-center gap-4'>
        {selectedCount > 0 ? (
          <Typography color='inherit' variant='subtitle1' component='div'>
            {selectedCount} baris dipilih
          </Typography>
        ) : (
          <Typography variant='h6' id='tableTitle' component='div' className='capitalize'>
            Data {tableName}
          </Typography>
        )}

        {selectedCount > 0 && (
          <Tooltip title='Hapus yang dipilih'>
            <IconButton onClick={onDeleteSelected} color='error'>
              <i className='ri-delete-bin-7-line' />
            </IconButton>
          </Tooltip>
        )}
      </div>

      {/* BAGIAN KANAN: Actions */}
      <div className='flex items-center gap-3'>
        {/* 1. INPUT PENCARIAN */}
        <TextField
          size='small'
          placeholder='Cari data...'
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          sx={{ minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <i className='ri-search-line' />
              </InputAdornment>
            )
          }}
        />

        {/* 2. TOMBOL COLUMNS (Toggle Show/Hide) */}
        <Button 
          variant='outlined' 
          color='secondary' 
          onClick={handleOpenMenu}
          startIcon={<i className='ri-layout-column-line' />}
        >
          Columns
        </Button>

        {/* DROPDOWN MENU PILIH KOLOM */}
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ 
            paper: { 
              style: { 
                maxHeight: 300, // Batasi tinggi menu agar bisa di-scroll jika kolom banyak
                width: 250      // Lebar menu yang pas
              } 
            } 
          }}
        >
          {columns.map((col) => {
            // Kolom ditampilkan jika TIDAK ada di dalam array hiddenColumns
            const isVisible = !hiddenColumns.includes(col)
            
            return (
              <MenuItem key={col} onClick={() => onToggleColumn(col)}>
                <Checkbox checked={isVisible} size="small" />
                <ListItemText primary={formatLabel(col)} />
              </MenuItem>
            )
          })}
        </Menu>

        {/* 3. TOMBOL BATAL (Muncul saat edit) */}
        {hasUnsavedChanges && (
          <Button variant='outlined' color='secondary' onClick={onDiscard} startIcon={<i className='ri-close-line' />}>
            Batal
          </Button>
        )}

        {/* 4. TOMBOL SIMPAN */}
        <Button
          variant='contained'
          color='success'
          disabled={!hasUnsavedChanges}
          onClick={onSave}
          startIcon={<i className='ri-save-3-line' />}
        >
          Save
        </Button>

        {/* 5. TOMBOL TAMBAH */}
        <Button variant='outlined' onClick={onAddRow} startIcon={<i className='ri-add-line' />}>
          Add
        </Button>
      </div>
    </Toolbar>
  )
}

export default TableToolbar
