// src/components/table/TableToolbar.tsx

'use client'

// MUI Imports
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { alpha, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'

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
    setGlobalFilter
  } = props

  const theme = useTheme()

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        
        // Jika ada baris yang dipilih, ubah warna background toolbar
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

        {/* Tombol Hapus Muncul saat ada yang dipilih */}
        {selectedCount > 0 && (
          <Tooltip title='Hapus yang dipilih'>
            <IconButton onClick={onDeleteSelected} color='error'>
              <i className='ri-delete-bin-7-line' />
            </IconButton>
          </Tooltip>
        )}
      </div>

      {/* BAGIAN KANAN: Search & Action Buttons */}
      <div className='flex items-center gap-3'>
        {/* Kotak Pencarian */}
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

        {/* Tombol Batal (Muncul jika ada ketikan) */}
        {hasUnsavedChanges && (
          <Button variant='outlined' color='secondary' onClick={onDiscard} startIcon={<i className='ri-close-line' />}>
            Batal
          </Button>
        )}

        {/* Tombol Simpan (Selalu ada, tapi nyala/mati tergantung ketikan) */}
        <Button
          variant='contained'
          color='success'
          disabled={!hasUnsavedChanges}
          onClick={onSave}
          startIcon={<i className='ri-save-3-line' />}
        >
          Save
        </Button>

        {/* Tombol Tambah Baris */}
        <Button variant='outlined' onClick={onAddRow} startIcon={<i className='ri-add-line' />}>
          Add
        </Button>
      </div>
    </Toolbar>
  )
}

export default TableToolbar
