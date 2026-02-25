// src/components/ui/tablecomponents/TableAddRow.tsx

'use client'

import { Plus } from 'lucide-react'
import toast from 'react-hot-toast' // Tambahkan ini untuk tes UI

interface TableAddRowProps {
  onClick?: () => void
}

export function TableAddRow({ onClick }: TableAddRowProps) {
  const handleClick = () => {
    console.log('[DEBUG 1] Tombol UI diklik!')
    if (onClick) {
      onClick() // Jalankan fungsi asli jika ada
    } else {
      console.error('[DEBUG ERROR] Kabel onClick KOSONG! Prop onAddRow gagal sampai ke komponen ini.')
      toast.error('Error UI: Kabel onAddRow terputus!')
    }
  }

  return (
    <button
      type='button'
      onClick={handleClick}
      className='flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors outline-none shadow-sm cursor-pointer'
    >
      <Plus size={16} />
      <span className='hidden sm:inline-block'>Tambah Baris</span>
    </button>
  )
}
