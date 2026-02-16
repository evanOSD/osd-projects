// src/app/(dashboard)/lookup/page.tsx

'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import CircularProgress from '@mui/material/CircularProgress'

import toast from 'react-hot-toast'

// Supabase Import
import { createClient } from '@core/utils/supabaseClient'

// Custom Component Import (Tabel Canggih Kita!)
import CustomTable from '@/components/table/Table'

// Definisikan daftar tabel yang tersedia di dropdown
const TABLE_OPTIONS = [
  { value: 'languages', label: 'Tabel Languages' },
  { value: 'books', label: 'Tabel Books' },
  { value: 'passages', label: 'Tabel Passages' },
  { value: 'stories', label: 'Tabel Stories' },
  { value: 'steps', label: 'Tabel Steps' }
]

const LookupPage = () => {
  // States
  const [selectedTable, setSelectedTable] = useState('languages')
  const [tableData, setTableData] = useState<any[]>([])
  const [tableColumns, setTableColumns] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const getRequiredColumns = () => {
    switch (selectedTable) {
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

  // Fungsi untuk mengambil data dari Supabase
  const fetchTableData = async () => {
    setIsLoading(true)
    const supabase = createClient()

    // Ambil data dari tabel yang sedang dipilih
    const { data, error } = await supabase.from(selectedTable).select('*').order('id', { ascending: true })

    if (error) {
      console.error(`Error fetching ${selectedTable}:`, error)
      setTableData([])
      setTableColumns([])
    } else if (data && data.length > 0) {
      setTableData(data)

      // Ambil nama-nama kolom secara otomatis dari struktur baris pertama
      setTableColumns(Object.keys(data[0]))
    } else {
      setTableData([])
      setTableColumns([])
    }

    setIsLoading(false)
  }

  // Efek ini menyala otomatis saat Dropdown diganti
  useEffect(() => {
    fetchTableData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTable])

  // --- LOGIKA MENYIMPAN DATA (DARI TOMBOL SAVE DI TOOLBAR) ---
  const handleSaveBatch = async (drafts: Record<string, any>) => {
    const supabase = createClient()

    // 1. Bersihkan Data: Ubah string kosong ("") menjadi null
    const recordsToUpsert = Object.values(drafts).map(record => {
      const cleanedRecord: any = { ...record }

      Object.keys(cleanedRecord).forEach(key => {
        // Jika isinya murni string kosong, paksa menjadi null agar Postgres tidak marah
        if (cleanedRecord[key] === '') {
          cleanedRecord[key] = null
        }
      })

      return cleanedRecord
    })

    // 2. Kirim data yang sudah bersih ke Supabase
    const { error } = await supabase.from(selectedTable).upsert(recordsToUpsert)

    if (error) {
      console.error('Error detail:', error.message, error.details, error.hint)
      toast.error(`Gagal menyimpan: ${error.message}`)
    } else {
      toast.success('Data berhasil disimpan!')
      fetchTableData()
    }
  }

  // --- LOGIKA MENGHAPUS DATA (DARI TOMBOL TONG SAMPAH DI TOOLBAR) ---
  const handleDeleteBatch = async (ids: string[]) => {
    // Konfirmasi dulu agar tidak tidak sengaja terhapus
    if (!window.confirm(`Yakin ingin menghapus ${ids.length} baris data ini secara permanen?`)) {
      return
    }

    const supabase = createClient()

    const { error } = await supabase.from(selectedTable).delete().in('id', ids) // Hapus semua ID yang ada di dalam array 'ids'

    if (error) {
      console.error('Error deleting data:', error)
      toast.error('Gagal menghapus data! Pastikan Anda punya akses.')
    } else {
      toast.success('Data berhasil dihapus!')
      fetchTableData()
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Header & Dropdown Pilihan Tabel */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <Typography variant='h4'>Database Lookup</Typography>
        </div>

        <FormControl size='small' className='min-is-[200px] bg-backgroundPaper rounded'>
          {/* Berikan id yang unik dan statis di sini */}
          <InputLabel id='lookup-table-select-label'>Pilih Tabel</InputLabel>
          <Select
            labelId='lookup-table-select-label' // Harus sama dengan id InputLabel
            id='lookup-table-select' // Berikan ID statis, jangan biarkan default
            value={selectedTable}
            label='Pilih Tabel'
            onChange={e => setSelectedTable(e.target.value)}
          >
            {TABLE_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Render Komponen Custom Table Kita */}
      {isLoading ? (
        <div className='flex justify-center p-10'>
          <CircularProgress />
        </div>
      ) : (
        <CustomTable
          tableName={selectedTable}
          columns={tableColumns}
          data={tableData}
          requiredColumns={getRequiredColumns()}
          onSaveBatch={handleSaveBatch}
          onDeleteBatch={handleDeleteBatch}
        />
      )}
    </div>
  )
}

export default LookupPage
