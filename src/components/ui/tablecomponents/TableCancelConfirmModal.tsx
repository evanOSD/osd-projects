// src/components/ui/tablecomponents/TableCancelConfirmModal.tsx

'use client'

import { AlertTriangle, X } from 'lucide-react'
import { useEffect } from 'react'

interface TableCancelConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function TableCancelConfirmModal({ isOpen, onClose, onConfirm }: TableCancelConfirmModalProps) {
  // Mencegah scroll di background saat modal terbuka
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-100 flex items-center justify-center bg-black/50 animate-in fade-in duration-200'>
      <div className='bg-background border border-border rounded-xl shadow-xl w-[30vw] p-6 relative animate-in zoom-in-95 duration-200'>
        <button
          onClick={onClose}
          className='absolute cursor-pointer top-4 right-4 text-danger hover:text-danger hover:bg-danger/20 p-1 rounded-md transition-colors outline-none'
        >
          <X size={20} />
        </button>
        <div className='flex flex-col items-center text-center gap-4 mt-2'>
          <div className='w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center'>
            <AlertTriangle size={24} />
          </div>
          <div className='space-y-2'>
            <h3 className='text-xl font-semibold text-foreground'>Batalkan Perubahan?</h3>
            <p className='text-sm text-foreground'>
              Semua baris baru yang belum Anda simpan akan dihapus secara permanen dari layar. Tindakan ini tidak bisa
              dibatalkan.
            </p>
          </div>
          <div className='flex items-center gap-3 w-full justify-center mt-4'>
            <button
              onClick={onClose}
              className='px-4 py-2 text-sm font-medium cursor-pointer rounded-md border border-border bg-surface text-foreground hover:bg-muted/10 transition-colors outline-none'
            >
              Kembali
            </button>
            <button
              onClick={onConfirm}
              className='px-4 py-2 text-sm font-medium cursor-pointer rounded-md bg-danger text-white hover:bg-danger/80 transition-colors outline-none shadow-sm'
            >
              Ya, Hapus Baris
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
