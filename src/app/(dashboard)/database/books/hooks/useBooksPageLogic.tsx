// src/app/(dashboard)/database/books/hooks/useBooksPageLogic.ts

import { useTablePageLogic } from '@/hooks/ui/useTablePageLogic'
import { useBooks, useUpdateBook, useAddBook, useDeleteBooks } from '@/hooks/queries/database/useBooks'
import { BookRow, BookInsert } from '@/api/database/books'
import { bookColumns } from '../config/columns'
import { BOOK_TABLE_CONFIG } from '../config/constants'

const SELECTED_ROW_COLUMNS = ['global_order', 'scripture_id', 'category', 'kitab', 'pasal']

export function useBooksPageLogic() {
  // Panggil Mesin Logika dengan konfigurasi spesifik milik Books
  return useTablePageLogic<BookRow, BookInsert>({
    columns: bookColumns,
    defaultHiddenColumns: BOOK_TABLE_CONFIG.defaultHiddenColumns,
    selectedRowDisplayColumns: SELECTED_ROW_COLUMNS,
    defaultSorting: [{ id: 'global_order', desc: false }],

    // Fungsi pembuat baris kosong khusus untuk tabel Books
    generateTempRow: () => ({
      id: `temp-${Date.now()}`,
      book: '',
      scripture_id: '',
      global_order: 0
    }),

    // Kaitkan hook API Books
    useQueryHook: useBooks,
    useUpdateMutation: useUpdateBook,
    useAddMutation: useAddBook,
    useDeleteMutation: useDeleteBooks
  })
}
