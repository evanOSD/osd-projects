// src/app/(dashboard)/users/permissions/config/constants.ts

export const PERMISSIONS_TABLE_CONFIG = {
  title: 'Hak Akses Pengguna',
  description: 'Matriks pengaturan hak akses (Read, Create, Update, Delete) tiap pengguna.',
  defaultHiddenColumns: {
    id: false
  }
} as const
