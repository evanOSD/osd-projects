'use client'

import { useEffect, useState } from 'react'

import CircularProgress from '@mui/material/CircularProgress'
import toast from 'react-hot-toast'

import { createClient } from '@core/utils/supabaseClient'
import CustomTable from '@/components/table/Table'

type Props = {
  tableName: string
}

const SupabaseTableRenderer = ({ tableName }: Props) => {
  const [tableData, setTableData] = useState<any[]>([])
  const [tableColumns, setTableColumns] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const getRequiredColumns = () => {
    switch (tableName) {
      case 'steps':
        return ['default_order', 'step_name', 'input_type']
      case 'languages':
        return ['name', 'iso_code']
      case 'stories':
        return ['title']
      default:
        return ['id']
    }
  }

  const fetchTableData = async () => {
    setIsLoading(true)
    const supabase = createClient()

    const { data, error } = await supabase.from(tableName).select('*').order('id', { ascending: true })

    if (error) {
      console.error(`Error fetching ${tableName}:`, error)
      setTableData([])
      setTableColumns([])
    } else if (data && data.length > 0) {
      setTableData(data)
      setTableColumns(Object.keys(data[0]))
    } else {
      setTableData([])
      setTableColumns([])
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchTableData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableName])

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

  if (isLoading) {
    return (
      <div className='flex justify-center p-10'>
        <CircularProgress />
      </div>
    )
  }

  return (
    <CustomTable
      tableName={tableName}
      columns={tableColumns}
      data={tableData}
      requiredColumns={getRequiredColumns()}
      onSaveBatch={handleSaveBatch}
      onDeleteBatch={handleDeleteBatch}
    />
  )
}

export default SupabaseTableRenderer
