// src/components/ui/ErrorModal.tsx

interface ErrorModalProps {
  isOpen: boolean
  message: string
  onClose: () => void
}

export default function ErrorModal({ isOpen, message, onClose }: ErrorModalProps) {
  // Jika state isOpen false, jangan render apapun
  if (!isOpen) return null

  return (
    // Overlay background gelap
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      {/* Kotak Modal */}
      <div className='bg-background rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden animate-in fade-in zoom-in duration-200'>
        {/* Header dengan border bawah */}
        <div className='flex justify-between items-center p-4 border-b border-gray-100'>
          <h3 className='text-lg font-bold text-danger flex items-center gap-2'>⚠️ Peringatan</h3>

          {/* Tombol X di sudut kanan atas */}
          <button
            onClick={onClose}
            className='text-danger hover:bg-danger/20 cursor-pointer transition-colors p-1 rounded-full '
            aria-label='Tutup'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <line x1='18' y1='6' x2='6' y2='18'></line>
              <line x1='6' y1='6' x2='18' y2='18'></line>
            </svg>
          </button>
        </div>

        {/* Isi Pesan Error */}
        <div className='p-6'>
          <p className='text-foreground leading-relaxed'>{message}</p>
        </div>

        {/* Footer dengan Tombol Mengerti */}
        <div className='bg-background p-4 flex justify-end'>
          <button
            onClick={onClose}
            className='px-6 py-2 bg-danger hover:text-foreground cursor-pointer text-background font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2'
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  )
}
