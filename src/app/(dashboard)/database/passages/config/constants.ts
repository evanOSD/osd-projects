// src/app/(dashboard)/database/passages/config/constants.ts

export const PASSAGE_TABLE_CONFIG = {
  title: 'Data Perikop (Passages)',
  description: 'Manajemen data perikop alkitab.',
  defaultHiddenColumns: {
    id: false,
    last_updated_at: false,
    last_updated_by: false,
    book: false, // Disembunyikan karena sudah ada 'kitab'
    book_order: false, // Disembunyikan karena sudah ada 'kitab'
    passage_title: false // Disembunyikan karena sudah ada 'judul_perikop'
  }
} as const
