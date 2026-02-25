// src/components/ui/tablecomponents/TableDeleteConfirmModal.tsx

'use client'

import { AlertTriangle, X, Loader2 } from 'lucide-react'
import { useEffect } from 'react'

interface TableDeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  count: number
  isDeleting?: boolean
}

export function TableDeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  count,
  isDeleting
}: TableDeleteConfirmModalProps) {
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
        {!isDeleting && (
          <button
            onClick={onClose}
            className='absolute cursor-pointer top-4 right-4 text-danger hover:text-danger hover:bg-danger/20 p-1 rounded-md transition-colors outline-none'
          >
            <X size={20} />
          </button>
        )}

        <div className='flex flex-col items-center text-center gap-4 mt-2'>
          <div className='w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center'>
            <AlertTriangle size={24} />
          </div>

          <div className='space-y-2'>
            <h3 className='text-xl font-semibold text-foreground'>Hapus {count} Baris Permanen?</h3>
            <p className='text-sm text-foreground'>
              Baris yang dihapus akan <strong>hilang selamanya</strong> dari <em>database</em> dan tidak dapat
              dikembalikan. Apakah Anda yakin?
            </p>
          </div>

          <div className='flex items-center gap-3 w-full justify-center mt-5'>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className='px-4 py-2 text-sm font-medium cursor-pointer rounded-md border border-border bg-surface text-foreground hover:bg-muted/10 transition-colors outline-none'
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className='px-4 py-2 text-sm font-medium cursor-pointer rounded-md bg-danger text-white hover:bg-danger/80 transition-colors outline-none shadow-sm'
            >
              {isDeleting ? (
                <>
                  <Loader2 size={16} className='animate-spin' />
                  Menghapus...
                </>
              ) : (
                'Ya, Hapus Permanen'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
