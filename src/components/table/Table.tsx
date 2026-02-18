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
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import { alpha, useTheme } from '@mui/material/styles'

import TableToolbar from './TableToolbar'
import EditableCell from './EditableCell'
import ColumnFilterPopover from './ColumnFilterPopover'
import type { TableProps } from './types'
import { useTableLogic } from './useTableLogic'

const LOCKED_COLUMNS = ['id', 'created_at', 'last_updated_at', 'last_updated_by']

const toTitleCase = (str: string) => {
  if (!str) return ''
  
return str
    .replace(/_/g, ' ')                 // Ganti _ dengan spasi
    .toLowerCase()                      // Ubah ke huruf kecil semua dulu
    .replace(/\b\w/g, char => char.toUpperCase()) // Huruf pertama tiap kata jadi Besar
}

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
  onFilterChange,
  defaultColumns = [] // ✅ Tambahkan di props destructuring
}: TableProps) => {
  const theme = useTheme()

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
    handleAddRow,
    hiddenColumns,
    handleToggleColumn,
  } = useTableLogic({ data, columns, requiredColumns, defaultColumns, onSaveBatch, onDeleteBatch })

  // --- 1. PERBAIKAN: Gunakan 'columns' langsung, bukan 'props.columns' ---
  const visibleColumns = useMemo(() => {
    return columns.filter(col => !hiddenColumns.includes(col))
  }, [columns, hiddenColumns])

  const handleSortClick = (col: string) => {
    if (onSortChange) {
      const isAsc = sortConfig?.column === col ? !sortConfig.ascending : true

      onSortChange(col, isAsc)
    }
  }

  // --- LOGIKA FOOTER STATUS ---
  const footerStatusNode = useMemo(() => {
    const statusItems = []

    // 1. Status Sortir
    if (sortConfig) {
      statusItems.push(
        <span key="sort" style={{ marginRight: 16 }}>
          <strong>Sort:</strong> {toTitleCase(sortConfig.column)} ({sortConfig.ascending ? 'A->Z' : 'Z->A'})
        </span>
      )
    }

    // 2. Status Filter
    const activeFilters = Object.entries(filters).filter(([, val]) =>
      Array.isArray(val) ? val.length > 0 : !!val
    )

    if (activeFilters.length > 0) {
      const filterNames = activeFilters.map(([col]) => toTitleCase(col))
      
      // Logika pemotongan jika lebih dari 3 filter
      let filterText = ''

      if (filterNames.length > 3) {
        filterText = `${filterNames.slice(0, 3).join(', ')}, ...`
      } else {
        filterText = filterNames.join(', ')
      }

      statusItems.push(
        <span key="filter">
          <strong>Filter:</strong> {filterText}
        </span>
      )
    }

    if (statusItems.length === 0) return null

    return (
      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
        {statusItems}
      </Typography>
    )
  }, [sortConfig, filters])

  // --- 2. PERBAIKAN: Gunakan visibleColumns untuk menentukan colspan ---
  const tableBodyRows = useMemo(() => {
    if (paginatedData.length === 0) {
      return (
        <TableRow>
          {/* Colspan disesuaikan dengan visibleColumns + checkbox */}
          <TableCell colSpan={visibleColumns.length + 1} align='center' sx={{ py: 10 }}>
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
          {/* --- 3. PERBAIKAN: Gunakan visibleColumns di sini agar kolom tersembunyi tidak dirender --- */}
          {visibleColumns.map(col => {
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
  }, [paginatedData, selectedIds, draftChanges, visibleColumns, columnOptions, theme, handleSelectOne, handleCellSave]) // Ganti dependency 'columns' jadi 'visibleColumns'

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
        columns={columns}       // Kirim semua kolom (untuk list menu)
        hiddenColumns={hiddenColumns} // Kirim status hidden
        onToggleColumn={handleToggleColumn} // Kirim fungsi toggle
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
              {/* --- 4. PERBAIKAN: Gunakan visibleColumns di Header --- */}
              {visibleColumns.map(col => {
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
                      
                      <IconButton
                        size="small"
                        onClick={() => handleSortClick(col)}
                        sx={{ 
                          padding: '4px',
                          color: isSortActive ? theme.palette.primary.main : 'default',
                          backgroundColor: isSortActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                          '&:hover': {
                            backgroundColor: isSortActive ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.action.active, 0.05)
                          }
                        }}
                      >
                        <i 
                          className={`text-base ${
                            isSortActive 
                              ? (sortConfig?.ascending ? 'ri-arrow-up-line' : 'ri-arrow-down-line') 
                              : 'ri-arrow-up-down-line text-gray-400 opacity-50'
                          }`} 
                        />
                      </IconButton>

                      <span className="flex-grow select-text cursor-text">
                        {toTitleCase(col)}
                        {requiredColumns.includes(col) && (
                          <span style={{ color: theme.palette.error.main, marginLeft: '4px' }}>*</span>
                        )}
                        {LOCKED_COLUMNS.includes(col) && (
                          <i className='ml-1 text-xs ri-lock-line text-textDisabled' />
                        )}
                      </span>

                      <ColumnFilterPopover
                        col={col}
                        options={columnOptions[col]}
                        currentFilterValue={filters[col] || []}
                        onApply={(c, v) => onFilterChange && onFilterChange(c, v)}
                        tableData={data}
                        sortConfig={sortConfig}
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

      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          px: 2,
          borderTop: '1px solid var(--mui-palette-divider)',
          flexShrink: 0
        }}
      >
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          {footerStatusNode}
        </Box>

        <TablePagination
          rowsPerPageOptions={[100, 500, 1000]}
          component='div'
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage='Baris:'
          sx={{ borderTop: 0 }} 
        />
      </Box>
    </Paper>
  )
}

export default Table
