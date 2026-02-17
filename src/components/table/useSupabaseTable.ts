// src/components/table/useSupabaseTable.ts

import { useState, useCallback, useEffect } from 'react'

import toast from 'react-hot-toast'

import { createClient } from '@core/utils/supabaseClient'

export const useSupabaseTable = (
  tableName: string, 
  
  // Terima param baru, set default fallback ke 'id' jika tidak diisi
  defaultSort: { column: string; ascending: boolean } = { column: 'id', ascending: true }
) => {
  const [tableData, setTableData] = useState<any[]>([])
  const [tableColumns, setTableColumns] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Gunakan defaultSort sebagai state awal saat pertama kali dirender
  const [sortConfig, setSortConfig] = useState<{ column: string; ascending: boolean } | null>(defaultSort)
  const [filters, setFilters] = useState<Record<string, string>>({})

  const fetchTableData = useCallback(async () => {
    setIsLoading(true)
    const supabase = createClient()

    let query = supabase.from(tableName).select('*')

    // 1. Terapkan Filter
    Object.entries(filters).forEach(([col, val]) => {
      if (val) query = query.ilike(col, `%${val}%`)
    })

    // 2. Terapkan Sorting (Karena state awal adalah defaultSort, logika ini akan langsung jalan)
    if (sortConfig) {
      query = query.order(sortConfig.column, { ascending: sortConfig.ascending })
    } else {
      // Fallback aman seandainya sortConfig entah bagaimana menjadi null
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
  }, [tableName, sortConfig, filters, defaultSort.column, defaultSort.ascending]) // <-- tambahkan defaultSort ke dependency

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTableData()
    }, 300)

    return () => clearTimeout(timer)
  }, [fetchTableData])

  const handleSaveBatch = async (drafts: Record<string, any>) => {
    const supabase = createClient()

    const recordsToUpsert = Object.values(drafts).map(record => {
      const cleanedRecord: any = { ...record }

      Object.keys(cleanedRecord).forEach(key => {
        if (cleanedRecord[key] === '') cleanedRecord[key] = null
      })
      
      return cleanedRecord
    })

    const { error } = await supabase.from(tableName).upsert(recordsToUpsert)

    if (error) {
      toast.error(`Gagal menyimpan: ${error.message}`)
    } else {
      toast.success('Data berhasil disimpan!')
      fetchTableData()
    }
  }

  const handleDeleteBatch = async (ids: string[]) => {
    if (!window.confirm(`Yakin ingin menghapus ${ids.length} baris data ini secara permanen?`)) return

    const supabase = createClient()
    const { error } = await supabase.from(tableName).delete().in('id', ids)

    if (error) {
      toast.error('Gagal menghapus data! Pastikan Anda punya akses.')
    } else {
      toast.success('Data berhasil dihapus!')
      fetchTableData()
    }
  }

  const handleSortChange = (column: string, ascending: boolean) => {
    setSortConfig({ column, ascending })
  }

  const handleFilterChange = (column: string, value: string) => {
    setFilters(prev => ({ ...prev, [column]: value }))
  }

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
