// src/app/(dashboard)/database/stories/config/constants.ts

export const STORY_TABLE_CONFIG = {
  title: 'Data Cerita (Stories)',
  description: 'Manajemen data urutan cerita dan referensi kitab.',
  defaultHiddenColumns: {
    id: false,
    scripture_ref_id: false,
    last_updated_at: false,
    last_updated_by: false,
    story_title: false, // Disembunyikan karena sudah ada versi bahasa Indonesianya
    book_reference: false,
    book_ref_order: false
  }
} as const
