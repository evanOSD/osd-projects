// src/components/table/useTableLogic.ts

import { useState, useMemo, useCallback } from 'react'

import toast from 'react-hot-toast'

import type { TableProps } from './types'

// Kita hanya butuh sebagian props untuk logika ini
type UseTableLogicProps = Pick<
  TableProps,
  'data' | 'columns' | 'requiredColumns' | 'onSaveBatch' | 'onDeleteBatch'
>

export const useTableLogic = ({
  data,
  columns,
  requiredColumns = [],
  onSaveBatch,
  onDeleteBatch
}: UseTableLogicProps) => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [draftChanges, setDraftChanges] = useState<Record<string, any>>({})
  const [newRows, setNewRows] = useState<any[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(100)

  const filteredData = useMemo(() => {
    const combinedData = [...newRows, ...data]

    if (!globalFilter) return combinedData
    const lowerFilter = globalFilter.toLowerCase()

    return combinedData.filter(row =>
      Object.values(row).some(val => val !== null && String(val).toLowerCase().includes(lowerFilter))
    )
  }, [data, newRows, globalFilter])

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage

    return filteredData.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredData, page, rowsPerPage])

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage)

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isAllSelected = paginatedData.length > 0 && selectedIds.length === paginatedData.length
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < paginatedData.length

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(paginatedData.map(row => row.id))

      return
    }

    setSelectedIds([])
  }

  const handleSelectOne = useCallback((id: string) => {
    setSelectedIds(prev => {
      const selectedIndex = prev.indexOf(id)
      let newSelected: string[] = []

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(prev, id)
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(prev.slice(1))
      } else if (selectedIndex === prev.length - 1) {
        newSelected = newSelected.concat(prev.slice(0, -1))
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(prev.slice(0, selectedIndex), prev.slice(selectedIndex + 1))
      }

      return newSelected
    })
  }, [])

  const handleCellSave = useCallback((rowId: string, colName: string, newValue: string, originalValue: any) => {
    if (newValue === (originalValue || '')) return
    setDraftChanges(prev => ({ ...prev, [rowId]: { ...prev[rowId], [colName]: newValue } }))
  }, [])

  const hasUnsavedChanges = Object.keys(draftChanges).length > 0

  const handleSave = () => {
    const draftsArray = Object.entries(draftChanges)

    for (const [id, fields] of draftsArray) {
      for (const col of requiredColumns) {
        if (columns.includes(col)) {
          const valueInDraft = fields[col]
          const originalRow = data.find(r => r.id === id)
          const valueInOriginal = originalRow ? originalRow[col] : null

          if (
            (valueInDraft === '' || valueInDraft === null || valueInDraft === undefined) &&
            (valueInOriginal === '' || valueInOriginal === null || valueInOriginal === undefined)
          ) {
            toast.error(`Kolom "${col.replace(/_/g, ' ')}" wajib diisi!`)
            
            return
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
    setDraftChanges(prev => ({ ...prev, [tempId]: emptyRow }))
    setPage(0)
  }

  // Mengembalikan semua state dan fungsi yang dibutuhkan oleh UI
  return {
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
  }
}
