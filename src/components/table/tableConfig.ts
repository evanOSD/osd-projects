// src/components/table/tableConfig.ts

// Daftarkan semua konfigurasi tabel di sini
export const TABLE_CONFIGS = {
  steps: {
    requiredColumns: ['default_order', 'step_name', 'input_type']
  },
  languages: {
    requiredColumns: ['name', 'iso_code']
  },
  stories: {
    requiredColumns: ['title']
  },
  books: {
    requiredColumns: ['id']
  },
  passages: {
    requiredColumns: ['id']
  }
} as const;

// Ini akan menghasilkan tipe gabungan: 'steps' | 'languages' | 'stories' | 'books' | 'passages'
// Tipe ini akan mencegah error typo saat kita memanggil komponen dari tab lain
export type AllowedTableName = keyof typeof TABLE_CONFIGS;

// Fungsi helper untuk mengambil kolom wajib secara dinamis
export const getRequiredColumnsForTable = (tableName: AllowedTableName | string): string[] => {
  const config = TABLE_CONFIGS[tableName as AllowedTableName];
  
  return config ? [...config.requiredColumns] : ['id']; // Fallback default 'id'
}
