// src/app/(dashboard)/database/books/hooks/useBooksPageLogic.ts

import { useState, useMemo, useRef } from 'react'
import { ColumnFiltersState, SortingState } from '@tanstack/react-table'
import toast from 'react-hot-toast'
import { useBooks, useUpdateBook, useAddBook, useDeleteBooks } from '@/hooks/queries/database/useBooks'
import { BookRow, BookInsert } from '@/api/database/books'

import { bookColumns } from '../config/columns'
import { BOOK_TABLE_CONFIG } from '../config/constants'

export function useBooksPageLogic() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const deleteMutation = useDeleteBooks()
  const [newRows, setNewRows] = useState<Partial<BookRow>[]>([])

  const [dbRowsToDelete, setDbRowsToDelete] = useState<BookRow[]>([])
  const clearSelectionRef = useRef<() => void>(() => {})

  const activeFilters = useMemo(() => {
    const filters: Record<string, string[]> = {}
    columnFilters.forEach(filter => {
      filters[filter.id] = filter.value as string[]
    })
    return filters
  }, [columnFilters])

  const {
    data: queryData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching
  } = useBooks(activeFilters, sorting)

  const updateMutation = useUpdateBook()
  const addMutation = useAddBook()

  const flatData = useMemo(() => {
    const dbData = queryData?.pages.flatMap(page => page) || []
    return [...newRows, ...dbData] as BookRow[]
  }, [queryData, newRows])

  const handleUpdateData = (rowIndex: number, columnId: string, value: unknown) => {
    const row = flatData[rowIndex]
    if (!row) return

    if (row.id && String(row.id).startsWith('temp-')) {
      setNewRows(prev => prev.map(r => (r.id === row.id ? { ...r, [columnId]: value } : r)))
    } else {
      updateMutation.mutate({ id: String(row.id), payload: { [columnId]: value } })
    }
  }

  const handleAddRow = () => {
    const tempId = `temp-${Date.now()}`

    setNewRows(prev => [
      {
        id: tempId,
        book: '',
        scripture_id: '',
        global_order: 0
      },
      ...prev
    ])
  }

  const handleSave = async () => {
    if (newRows.length === 0) return
    toast.loading(`Menyimpan ${newRows.length} baris baru...`, { id: 'save-rows' })
    try {
      for (const row of newRows) {
        const { id, ...payloadToInsert } = row
        await addMutation.mutateAsync(payloadToInsert as BookInsert)
      }
      setNewRows([])
      toast.success('Semua baris baru berhasil disimpan!', { id: 'save-rows' })
    } catch (error: any) {
      toast.error(`Gagal menyimpan: ${error.message}`, { id: 'save-rows' })
    }
  }

  const handleCancel = () => {
    if (newRows.length === 0) return
    setNewRows([])
    toast.success('Perubahan dibatalkan')
  }

  const handleDeleteRows = (rowsToDelete: BookRow[], clearSelection: () => void) => {
    const tempRows = rowsToDelete.filter(r => String(r.id).startsWith('temp-'))
    const dbRows = rowsToDelete.filter(r => !String(r.id).startsWith('temp-'))

    if (tempRows.length > 0) {
      const tempIds = tempRows.map(r => r.id)
      setNewRows(prev => prev.filter(r => (r.id ? !tempIds.includes(r.id) : true)))

      if (dbRows.length === 0) clearSelection()
    }

    if (dbRows.length > 0) {
      clearSelectionRef.current = clearSelection
      setDbRowsToDelete(dbRows)
    }
  }

  const confirmDeleteRows = async () => {
    if (dbRowsToDelete.length === 0) return

    toast.loading(`Menghapus ${dbRowsToDelete.length} baris...`, { id: 'delete-toast' })
    try {
      const dbIds = dbRowsToDelete.map(r => String(r.id))
      await deleteMutation.mutateAsync(dbIds)

      toast.success(`${dbRowsToDelete.length} baris berhasil dihapus!`, { id: 'delete-toast' })

      clearSelectionRef.current()
      setDbRowsToDelete([])
    } catch (error: any) {
      toast.error(`Gagal menghapus: ${error.message}`, { id: 'delete-toast' })
    }
  }

  const closeDeleteModal = () => {
    setDbRowsToDelete([])
  }

  const tableProps = {
    columns: bookColumns,
    data: flatData,
    updateData: handleUpdateData,
    defaultHiddenColumns: BOOK_TABLE_CONFIG.defaultHiddenColumns,
    fetchNextPage: () => fetchNextPage(),
    hasMore: hasNextPage,
    isFetchingNextPage,
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting,
    isSaving: updateMutation.isPending || addMutation.isPending || deleteMutation.isPending,
    onAddRow: handleAddRow,
    onSave: handleSave,
    onCancel: handleCancel,
    onDeleteRows: handleDeleteRows,
    unsavedCount: newRows.length
  }

  const deleteModalProps = {
    isOpen: dbRowsToDelete.length > 0,
    onClose: closeDeleteModal,
    onConfirm: confirmDeleteRows,
    count: dbRowsToDelete.length,
    isDeleting: deleteMutation.isPending
  }

  return {
    isLoading,
    isFetching,
    tableProps,
    deleteModalProps
  }
}
