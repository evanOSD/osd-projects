// src/app/(dashboard)/database/books/config/constants.ts

export const BOOK_TABLE_CONFIG = {
  title: 'Data Struktur Buku',
  description: 'Manajemen struktur kitab dan pasal, tersinkronisasi langsung dengan Supabase.',
  defaultHiddenColumns: {
    id: false,
    scripture_id: false,
    book: false,
    chapter: false,
    last_updated_at: false,
    last_updated_by: false,
    book_order: false
  }
} as const
