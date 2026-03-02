// src/app/(dashboard)/database/languages/config/constants.ts

export const LANGUAGE_TABLE_CONFIG = {
  title: 'Data Bahasa (Languages)',
  description: 'Manajemen data bahasa, kode ISO, dan metrik populasi/aksesibilitas.',
  defaultHiddenColumns: {
    id: false,
    name_in_ethnologue: false,
    communities_dialects_subgroups_diaspora: false,
    completed_scripture_products: false,
    last_updated_at: false,
    last_updated_by: false
  }
} as const
