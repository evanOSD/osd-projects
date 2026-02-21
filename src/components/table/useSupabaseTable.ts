// src/components/table/useSupabaseTable.ts

import { useState, useCallback, useEffect } from 'react'

import toast from 'react-hot-toast'

// Menggunakan Singleton Supabase Client (Menghilangkan warning GoTrueClient)
import { createClient } from '@core/utils/supabaseClient'

export const useSupabaseTable = (
  tableName: string, 
  defaultSort: { column: string; ascending: boolean } = { column: 'id', ascending: true }
) => {

  const supabase = createClient()

  const [tableData, setTableData] = useState<any[]>([])
  const [tableColumns, setTableColumns] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [sortConfig, setSortConfig] = useState<{ column: string; ascending: boolean } | null>(defaultSort)
  const [filters, setFilters] = useState<Record<string, string | string[]>>({})

  const fetchTableData = useCallback(async () => {
    setIsLoading(true)

    let query = supabase.from(tableName as any).select('*')

    // 1. Terapkan Filter
    Object.entries(filters).forEach(([col, val]) => {
      if (Array.isArray(val)) {
        if (val.length > 0) {
          query = query.in(col, val)
        }
      } else if (val) {
        query = query.ilike(col, `%${val}%`)
      }
    })

    // 2. Terapkan Sorting
    if (sortConfig) {
      query = query.order(sortConfig.column, { ascending: sortConfig.ascending })
    } else {
      query = query.order(defaultSort.column, { ascending: defaultSort.ascending })
    }

    const { data, error } = await query

    if (error) {
      console.error(`Error fetching ${tableName}:`, error)
      setTableData([])
      if (Object.keys(filters).length === 0) setTableColumns([]) 
    } else if (data && data.length > 0) {
      setTableData(data)
      setTableColumns(prev => prev.length === 0 ? Object.keys(data[0]) : prev)
    } else {
      setTableData([])
      if (Object.keys(filters).length === 0) setTableColumns([])
    }

    setIsLoading(false)
  }, [supabase, tableName, filters, sortConfig, defaultSort.column, defaultSort.ascending])

  useEffect(() => {
    // Debounce fetch untuk mencegah spam query ke database
    const timer = setTimeout(() => {
      fetchTableData()
    }, 300)

    return () => clearTimeout(timer)
  }, [fetchTableData])

  // --- PERBAIKAN: Membungkus semua handler dengan useCallback ---

  const handleSaveBatch = useCallback(async (drafts: Record<string, any>) => {    
    const recordsToUpsert = Object.values(drafts).map(record => {
      const cleanedRecord: any = { ...record }

      Object.keys(cleanedRecord).forEach(key => {
        if (cleanedRecord[key] === '') cleanedRecord[key] = null
      })

      return cleanedRecord
    })

    const { error } = await supabase.from(tableName as any).upsert(recordsToUpsert)

    if (error) {
      toast.error(`Gagal menyimpan: ${error.message}`)
    } else {
      toast.success('Data berhasil disimpan!')
      fetchTableData()
    }
  }, [supabase, tableName, fetchTableData]) // Dependency ditambah

  const handleDeleteBatch = useCallback(async (ids: string[]) => {
    if (!window.confirm(`Yakin ingin menghapus ${ids.length} baris data ini secara permanen?`)) return    
    const { error } = await supabase.from(tableName as any).delete().in('id', ids)

    if (error) {
      toast.error('Gagal menghapus data! Pastikan Anda punya akses.')
    } else {
      toast.success('Data berhasil dihapus!')
      fetchTableData()
    }
  }, [supabase, tableName, fetchTableData]) // Dependency ditambah

  const handleSortChange = useCallback((column: string, ascending: boolean) => {
    setSortConfig({ column, ascending })
  }, []) // Kosong karena tidak bergantung pada state luar

  const handleFilterChange = useCallback((column: string, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [column]: value }))
  }, []) // Kosong karena menggunakan setState callback (prev)

  return {
    tableData,
    tableColumns,
    isLoading,
    sortConfig,
    filters,
    handleSaveBatch,
    handleDeleteBatch,
    handleSortChange,
    handleFilterChange
  }
}
