// src/components/table/Table.tsx

'use client'

import { useState, useMemo, useEffect } from 'react'

import toast from 'react-hot-toast'

// MUI Imports
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import MuiTable from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Checkbox from '@mui/material/Checkbox'
import InputBase from '@mui/material/InputBase'
import TablePagination from '@mui/material/TablePagination'
import { alpha, useTheme } from '@mui/material/styles'

// Custom Components
import TableToolbar from './TableToolbar'

type TableProps = {
  tableName: string
  columns: string[]
  data: any[]
  requiredColumns?: string[]
  columnOptions?: Record<string, { label: string; value: string }[]>
  onSaveBatch: (drafts: Record<string, any>) => void
  onDeleteBatch: (ids: string[]) => void
}

// --- KOMPONEN SEL SUPER RINGAN ---

const EditableCell = ({
  initialValue,
  onSave,
  theme,
  options // <--- Tambahkan ini
}: {
  initialValue: any
  onSave: (val: string) => void
  theme: any
  options?: { label: string; value: string }[] // <--- Dan ini
}) => {
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
    // JIKA ADA OPTIONS: Render Dropdown (Select)
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

    // JIKA TIDAK ADA OPTIONS: Render Input Biasa
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

  // Tampilan Default (Teks)
  const displayLabel = options ? options.find(o => o.value === localValue)?.label || localValue : localValue

  return (
    <div
      onClick={() => setIsEditing(true)}
      className='w-full px-2 py-1 min-h-[30px] flex items-center cursor-text rounded transition-colors hover:bg-black/5 dark:hover:bg-white/10'
    >
      {displayLabel !== null && displayLabel !== '' ? (
        displayLabel
      ) : (
        <span className='opacity-0 hover:opacity-50 text-xs italic text-gray-400'>klik untuk isi</span>
      )}
    </div>
  )
}

const Table = ({
  tableName,
  columns,
  data,
  requiredColumns = [],
  columnOptions = {},
  onSaveBatch,
  onDeleteBatch
}: TableProps) => {
  const theme = useTheme()

  // --- STATES ---
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [draftChanges, setDraftChanges] = useState<Record<string, any>>({})
  const [newRows, setNewRows] = useState<any[]>([])

  // States Pagination
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(100) // Tampilkan 10 baris saja agar ringan!

  const lockedColumns = ['id', 'created_at', 'last_updated_at', 'last_updated_by']

  // --- LOGIKA FILTERING (SEARCH) ---
  const filteredData = useMemo(() => {
    const combinedData = [...newRows, ...data]

    if (!globalFilter) return combinedData

    const lowerFilter = globalFilter.toLowerCase()

    return combinedData.filter(row => {
      return Object.values(row).some(val => val !== null && String(val).toLowerCase().includes(lowerFilter))
    })
  }, [data, newRows, globalFilter])

  // --- LOGIKA PAGINATION ---
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage

    return filteredData.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredData, page, rowsPerPage])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0) // Kembali ke halaman 1 jika mengubah jumlah baris
  }

  // --- LOGIKA CHECKBOX ---
  const isAllSelected = paginatedData.length > 0 && selectedIds.length === paginatedData.length
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < paginatedData.length

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(paginatedData.map(row => row.id))

      return
    }

    setSelectedIds([])
  }

  const handleSelectOne = (id: string) => {
    const selectedIndex = selectedIds.indexOf(id)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1))
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selectedIds.slice(0, selectedIndex), selectedIds.slice(selectedIndex + 1))
    }

    setSelectedIds(newSelected)
  }

  // --- LOGIKA INLINE EDITING ---
  const handleCellSave = (rowId: string, colName: string, newValue: string, originalValue: any) => {
    // Jangan simpan jika tidak ada perubahan ketikan
    if (newValue === (originalValue || '')) return

    setDraftChanges(prev => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [colName]: newValue
      }
    }))
  }

  const hasUnsavedChanges = Object.keys(draftChanges).length > 0

  // --- ACTIONS TOOLBAR ---
  const handleSave = () => {
    // Validasi Generik
    const draftsArray = Object.entries(draftChanges)

    for (const [id, fields] of draftsArray) {
      for (const col of requiredColumns) {
        if (columns.includes(col)) {
          // Cek di draft atau di data asli
          const valueInDraft = fields[col]
          const originalRow = data.find(r => r.id === id)
          const valueInOriginal = originalRow ? originalRow[col] : null

          if (
            (valueInDraft === '' || valueInDraft === null || valueInDraft === undefined) &&
            (valueInOriginal === '' || valueInOriginal === null || valueInOriginal === undefined)
          ) {
            toast.error(`Kolom "${col.replace(/_/g, ' ')}" wajib diisi!`)

            return // Stop!
          }
        }
      }
    }

    onSaveBatch(draftChanges)
    setDraftChanges({})
    setNewRows([])
  }

  const handleDiscard = () => {
    setDraftChanges({})
    setNewRows([])
  }

  const handleDeleteSelected = () => {
    onDeleteBatch(selectedIds)
    setSelectedIds([])
  }

  const handleAddRow = () => {
    const tempId = crypto.randomUUID()
    const emptyRow: any = { id: tempId }

    columns.forEach(col => {
      if (col !== 'id') emptyRow[col] = ''
    })

    setNewRows([emptyRow, ...newRows])
    setDraftChanges(prev => ({
      ...prev,
      [tempId]: emptyRow
    }))
    setPage(0) // Otomatis ke halaman 1 jika nambah data
  }

  return (
    <Paper
      sx={{
        width: '100%',
        height: 'calc(100vh - 220px)',
        display: 'flex',
        flexDirection: 'column'
      }}
      className='shadow-md'
    >
      {/* 2. TOOLBAR (Tertempel di atas) */}
      <TableToolbar
        tableName={tableName}
        selectedCount={selectedIds.length}
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={handleSave}
        onDiscard={handleDiscard}
        onDeleteSelected={handleDeleteSelected}
        onAddRow={handleAddRow}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />

      {/* 3. TABLE CONTAINER (Melar mengisi ruang kosong, ini satu-satunya yang boleh di-scroll) */}
      <TableContainer sx={{ flex: '1 1 auto', overflow: 'auto' }}>
        <MuiTable stickyHeader size='small' aria-label='spreadsheet table'>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox' sx={{ bgcolor: 'background.paper', zIndex: 3 }}>
                <Checkbox
                  color='primary'
                  indeterminate={isIndeterminate}
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {columns.map(col => (
                <TableCell
                  key={col}
                  sx={{
                    bgcolor: 'background.paper',
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {col.replace(/_/g, ' ')}

                  {/* Tanda bintang merah untuk kolom wajib */}
                  {requiredColumns.includes(col) && (
                    <span style={{ color: theme.palette.error.main, marginLeft: '4px' }}>*</span>
                  )}

                  {lockedColumns.includes(col) && <i className='ri-lock-line ml-1 text-xs text-textDisabled' />}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map(row => {
                const isItemSelected = selectedIds.includes(row.id)
                const isRowEdited = draftChanges.hasOwnProperty(row.id)

                return (
                  <TableRow
                    key={row.id}
                    hover
                    role='checkbox'
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    selected={isItemSelected}
                    sx={{
                      // Efek hover normal (Cyan sangat tipis)
                      '&.MuiTableRow-hover:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.04)
                      },

                      // Efek saat baris SEDANG DIEDIT
                      ...(isRowEdited && {
                        // Background dasar saat diedit (Cyan tipis)
                        bgcolor: alpha(theme.palette.primary.main, 0.08),

                        // Background saat baris yang diedit itu di-hover (Cyan sedikit lebih tebal)
                        '&.MuiTableRow-hover:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.12)
                        }
                      })
                    }}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox color='primary' checked={isItemSelected} onChange={() => handleSelectOne(row.id)} />
                    </TableCell>

                    {columns.map(col => {
                      const options = columnOptions?.[col]
                      const isLocked = lockedColumns.includes(col)
                      const originalValue = row[col]
                      const displayValue = draftChanges[row.id]?.[col] ?? originalValue

                      return (
                        <TableCell key={`${row.id}-${col}`} sx={{ whiteSpace: 'nowrap', padding: '0px 8px' }}>
                          {isLocked ? (
                            <div className='py-2 px-2 text-textDisabled'>{displayValue || '-'}</div>
                          ) : (
                            <EditableCell
                              initialValue={displayValue}
                              options={options}
                              onSave={newVal => handleCellSave(row.id, col, newVal, originalValue)}
                              theme={theme}
                            />
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align='center' sx={{ py: 10 }}>
                  Tidak ada data ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>

      {/* 4. PAGINATION (Tertempel di bawah, dijamin muncul!) */}
      <TablePagination
        rowsPerPageOptions={[100, 500, 1000]}
        component='div'
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage='Baris per halaman:'
        sx={{ borderTop: '1px solid var(--mui-palette-divider)', flexShrink: 0 }}
      />
    </Paper>
  )
}

export default Table
