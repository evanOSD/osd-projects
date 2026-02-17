// src/components/table/Table.tsx

'use client'

import { useMemo } from 'react'

import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import MuiTable from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Checkbox from '@mui/material/Checkbox'
import TablePagination from '@mui/material/TablePagination'
import { alpha, useTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'

import TableToolbar from './TableToolbar'
import EditableCell from './EditableCell'
import ColumnFilterPopover from './ColumnFilterPopover'
import type { TableProps } from './types'
import { useTableLogic } from './useTableLogic' // <--- Import custom hook

const LOCKED_COLUMNS = ['id', 'created_at', 'last_updated_at', 'last_updated_by']

const Table = ({
  tableName,
  columns,
  data,
  requiredColumns = [],
  columnOptions = {},
  onSaveBatch,
  onDeleteBatch,
  sortConfig,
  onSortChange,
  filters = {},
  onFilterChange
}: TableProps) => {
  const theme = useTheme()

  // --- MENGGUNAKAN CUSTOM HOOK ---
  const {
    globalFilter,
    setGlobalFilter,
    selectedIds,
    draftChanges,
    page,
    rowsPerPage,
    filteredData,
    paginatedData,
    isAllSelected,
    isIndeterminate,
    hasUnsavedChanges,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSelectAll,
    handleSelectOne,
    handleCellSave,
    handleSave,
    handleDiscard,
    handleDeleteSelected,
    handleAddRow
  } = useTableLogic({ data, columns, requiredColumns, onSaveBatch, onDeleteBatch })

  const handleSortClick = (col: string) => {
    if (onSortChange) {
      const isAsc = sortConfig?.column === col ? !sortConfig.ascending : true

      onSortChange(col, isAsc)
    }
  }

  const tableBodyRows = useMemo(() => {
    if (paginatedData.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length + 1} align='center' sx={{ py: 10 }}>
            Tidak ada data ditemukan.
          </TableCell>
        </TableRow>
      )
    }

    return paginatedData.map(row => {
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
            '&.MuiTableRow-hover:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
            ...(isRowEdited && {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              '&.MuiTableRow-hover:hover': { bgcolor: alpha(theme.palette.primary.main, 0.12) }
            })
          }}
        >
          <TableCell padding='checkbox'>
            <Checkbox color='primary' checked={isItemSelected} onChange={() => handleSelectOne(row.id)} />
          </TableCell>
          {columns.map(col => {
            const options = columnOptions?.[col]
            const isLocked = LOCKED_COLUMNS.includes(col)
            const originalValue = row[col]
            const displayValue = draftChanges[row.id]?.[col] ?? originalValue

            return (
              <TableCell key={`${row.id}-${col}`} sx={{ whiteSpace: 'nowrap', padding: '0px 8px' }}>
                {isLocked ? (
                  <div className='px-2 py-2 text-textDisabled'>{displayValue || '-'}</div>
                ) : (
                  <EditableCell
                    initialValue={displayValue}
                    options={options}
                    theme={theme}
                    onSave={newVal => handleCellSave(row.id, col, newVal, originalValue)}
                  />
                )}
              </TableCell>
            )
          })}
        </TableRow>
      )
    })
  }, [paginatedData, selectedIds, draftChanges, columns, columnOptions, theme, handleSelectOne, handleCellSave])

  return (
    <Paper
      sx={{ width: '100%', height: 'calc(100vh - 220px)', display: 'flex', flexDirection: 'column' }}
      className='shadow-md'
    >
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

      <TableContainer sx={{ flex: '1 1 auto', overflow: 'auto' }}>
        <MuiTable stickyHeader size='small'>
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
              {columns.map(col => {
                const isSortActive = sortConfig?.column === col

                return (
                  <TableCell
                    key={col}
                    sx={{
                      bgcolor: 'background.paper',
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <div className='flex items-center gap-2'>
                      {/* 1. TOMBOL SORT (KIRI & SELALU MUNCUL) */}
                      <IconButton
                        size='small'
                        onClick={() => handleSortClick(col)}
                        color={isSortActive ? 'primary' : 'default'}
                        sx={{ padding: '4px' }}
                      >
                        <i
                          className={`text-base ${
                            isSortActive
                              ? sortConfig.ascending
                                ? 'ri-arrow-up-line'
                                : 'ri-arrow-down-line'
                              : 'ri-arrow-up-down-line text-gray-400 opacity-50'
                          }`}
                        />
                      </IconButton>

                      {/* 2. TEKS HEADER (TENGAH & BISA DI-SELECT/COPY) */}
                      <span className='flex-grow select-text cursor-text'>
                        {col.replace(/_/g, ' ')}
                        {requiredColumns.includes(col) && (
                          <span style={{ color: theme.palette.error.main, marginLeft: '4px' }}>*</span>
                        )}
                        {LOCKED_COLUMNS.includes(col) && <i className='ml-1 text-xs ri-lock-line text-textDisabled' />}
                      </span>

                      {/* 3. TOMBOL FILTER (KANAN) */}
                      <ColumnFilterPopover
                        col={col}
                        options={columnOptions[col]}
                        currentFilterValue={filters[col] || ''}
                        onApply={(c, v) => onFilterChange && onFilterChange(c, v)}
                        tableData={data}
                        sortConfig={sortConfig} // ✅ TAMBAHKAN BARIS INI
                      />
                    </div>
                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>

          <TableBody>{tableBodyRows}</TableBody>
        </MuiTable>
      </TableContainer>

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
