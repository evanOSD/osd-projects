// src/hooks/ui/useTablePageLogic.ts

import { useState, useMemo, useRef } from 'react'
import { ColumnFiltersState, SortingState, ColumnDef } from '@tanstack/react-table'
import toast from 'react-hot-toast'
import { useAuth } from '@/providers/AuthProvider'

export interface UseTablePageLogicProps<TRow, TInsert> {
  columns: ColumnDef<TRow, any>[]
  defaultHiddenColumns?: Record<string, boolean>
  selectedRowDisplayColumns?: string[]
  defaultSorting?: SortingState
  generateTempRow: () => Partial<TRow>
  useQueryHook: (filters: Record<string, string[]>, sorting: SortingState) => any
  useUpdateMutation: () => any
  useAddMutation: () => any
  useDeleteMutation: () => any
}

export function useTablePageLogic<TRow extends { id?: any }, TInsert>({
  columns,
  defaultHiddenColumns,
  selectedRowDisplayColumns,
  defaultSorting = [],
  generateTempRow,
  useQueryHook,
  useUpdateMutation,
  useAddMutation,
  useDeleteMutation
}: UseTablePageLogicProps<TRow, TInsert>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>(defaultSorting)

  const [newRows, setNewRows] = useState<Partial<TRow>[]>([])
  const [dbRowsToDelete, setDbRowsToDelete] = useState<TRow[]>([])
  const clearSelectionRef = useRef<() => void>(() => {})

  // --- AMBIL DATA USER LOGIN ---
  const { user } = useAuth() // <--- INI BARIS YANG TADI TERLEWAT!
  const currentUserId = user?.id || null
  const currentUserName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? 'Unknown User'

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
  } = useQueryHook(activeFilters, sorting)
  const updateMutation = useUpdateMutation()
  const addMutation = useAddMutation()
  const deleteMutation = useDeleteMutation()

  const flatData = useMemo(() => {
    const dbData = queryData?.pages?.flatMap((page: any) => page) || []
    return [...newRows, ...dbData] as TRow[]
  }, [queryData, newRows])

  // --- FUNGSI UPDATE DATA SEMENTARA & PERMANEN ---
  const handleUpdateData = (rowIndex: number, columnId: string, value: unknown) => {
    const row = flatData[rowIndex]
    if (!row) return

    // Siapkan data audit (Waktu sekarang format ISO string UTC)
    const auditData = {
      last_updated_at: new Date().toISOString(),
      last_updated_by: currentUserId
    }

    if (row.id && String(row.id).startsWith('temp-')) {
      // Jika masih baris sementara, cukup ubah state lokal ditambah audit data
      setNewRows(prev => prev.map(r => (r.id === row.id ? { ...r, ...auditData, [columnId]: value } : r)))
    } else {
      updateMutation.mutate({
        id: String(row.id),
        payload: { ...auditData, [columnId]: value }
      })
    }
  }

  const handleAddRow = () => {
    // Sisipkan juga audit data langsung saat baris baru diciptakan
    const tempRow = generateTempRow()
    setNewRows(prev => [
      {
        ...tempRow,
        last_updated_at: new Date().toISOString(),
        last_updated_by: currentUserName // Boleh tetap currentUserName untuk preview UI sebelum di save
      } as Partial<TRow>,
      ...prev
    ])
  }

  // --- FUNGSI SIMPAN BARIS BARU (INSERT) ---
  const handleSave = async () => {
    if (newRows.length === 0) return

    // Gunakan toast.promise agar loading dan sukses diurus otomatis,
    // error dibiarkan bocor ke global
    const savePromises = newRows.map(row => {
      const { id, ...payloadToInsert } = row
      const finalPayload = {
        ...payloadToInsert,
        last_updated_at: new Date().toISOString(),
        last_updated_by: currentUserId
      }
      return addMutation.mutateAsync(finalPayload as unknown as TInsert)
    })

    try {
      toast.loading(`Menyimpan ${newRows.length} baris baru...`, { id: 'save-rows' })
      await Promise.all(savePromises)

      setNewRows([])
      toast.success('Semua baris baru berhasil disimpan!', { id: 'save-rows' })
    } catch (error: any) {
      toast.dismiss('save-rows')
    }
  }

  const handleCancel = () => {
    if (newRows.length === 0) return
    setNewRows([])
    toast.success('Perubahan dibatalkan')
  }

  const handleDeleteRows = (rowsToDelete: TRow[], clearSelection: () => void) => {
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
      toast.dismiss('delete-toast')
    }
  }

  const defaultColumnPinning = useMemo(() => {
    const left: string[] = []
    const right: string[] = []

    columns.forEach(col => {
      const pin = (col as any).meta?.isPinned
      const colId = (col as any).accessorKey || col.id
      if (pin === true || pin === 'left') left.push(colId)
      else if (pin === 'right') right.push(colId)
    })

    return { left, right }
  }, [columns])

  return {
    isLoading,
    isFetching,
    tableProps: {
      columns,
      data: flatData,
      updateData: handleUpdateData,
      defaultHiddenColumns,
      fetchNextPage: () => fetchNextPage(),
      hasMore: hasNextPage,
      isFetchingNextPage,
      columnFilters,
      setColumnFilters,
      sorting,
      setSorting,
      manualSorting: true,
      manualFiltering: true,
      isSaving: updateMutation.isPending || addMutation.isPending || deleteMutation.isPending,
      onAddRow: handleAddRow,
      onSave: handleSave,
      onCancel: handleCancel,
      onDeleteRows: handleDeleteRows,
      unsavedCount: newRows.length,
      selectedRowDisplayColumns,
      defaultColumnPinning
    },
    deleteModalProps: {
      isOpen: dbRowsToDelete.length > 0,
      onClose: () => setDbRowsToDelete([]),
      onConfirm: confirmDeleteRows,
      count: dbRowsToDelete.length,
      isDeleting: deleteMutation.isPending
    }
  }
}
