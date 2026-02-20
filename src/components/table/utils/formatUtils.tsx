// src/components/table/utils/formatUtils.tsx

import Chip from '@mui/material/Chip'
import { format } from 'date-fns'
import { id } from 'date-fns/locale' // Format bahasa Indonesia

// Helper untuk memotong UUID agar tidak kepanjangan
export const formatUUID = (uuid: string) => {
  if (!uuid) return '-'
  
  return (
    <span title={uuid} className="font-mono text-xs cursor-help">
      {uuid.slice(0, 8)}...{uuid.slice(-4)}
    </span>
  )
}

// Helper untuk format angka (mata uang/bilangan)
export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('id-ID').format(num)
}

// Helper untuk Boolean (True/False)
export const formatBoolean = (val: boolean) => {
  return (
    <Chip 
      label={val ? 'Ya' : 'Tidak'} 
      color={val ? 'success' : 'default'} 
      size="small" 
      variant="outlined"
    />
  )
}

// Helper untuk Tanggal/Waktu
export const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)

  // Format: 17 Agt 2024, 14:30
  return format(date, 'd MMM yyyy, HH:mm', { locale: id }) 
}

// FUNGSI UTAMA: Jembatan Rendering
export const renderCellContent = (value: any, columnType?: string) => {
  if (value === null || value === undefined || value === '') {
    return <span className="text-gray-300">-</span>
  }

  // 1. Deteksi Tipe Data Spesifik Supabase (jika metadata tersedia)
  switch (columnType) {
    case 'uuid':
      return formatUUID(value)
    case 'bool':
    case 'boolean':
      return formatBoolean(value)
    case 'int2':
    case 'int4':
    case 'int8':
    case 'float4':
    case 'float8':
    case 'numeric':
      return <div className="text-right font-mono">{formatNumber(value)}</div>
    case 'timestamptz':
    case 'timestamp':
    case 'date':
      return formatDate(value)
    case 'json':
    case 'jsonb':
      return (
        <code className="text-xs bg-gray-100 p-1 rounded">
          {JSON.stringify(value).slice(0, 20)}...
        </code>
      )
    default:
      // 2. Deteksi Fallback berdasarkan Tipe Primitif JS (jika columnType tidak dikirim)
      if (typeof value === 'boolean') return formatBoolean(value)
      if (typeof value === 'number') return <div className="text-right font-mono">{formatNumber(value)}</div>
      
      // Deteksi string tanggal ISO (contoh: 2023-10-25T10:00:00Z)
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        return formatDate(value)
      }

      // Deteksi UUID string secara manual
      if (typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}/.test(value)) {
        return formatUUID(value)
      }

      // String Biasa
      return <span className="truncate max-w-[200px] block" title={value}>{value}</span>
  }
}
