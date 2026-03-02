// src/app/(dashboard)/users/config/constants.ts

export const USER_TABLE_CONFIG = {
  title: 'Manajemen Pengguna (Users)',
  description: 'Pengaturan akses, peran (Role), dan status keanggotaan pengguna OSD.',
  defaultHiddenColumns: {
    id: false,
    user_url_photo_profile: false,
    providers: false,
    last_updated_at: false,
    last_updated_by: false
  }
} as const
