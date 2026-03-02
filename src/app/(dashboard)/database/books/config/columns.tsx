// src/app/(dashboard)/database/books/config/columns.tsx

import { ColumnDef } from '@tanstack/react-table'
import { BookRow, booksApi } from '@/api/database/books'
import { createStandardColumn } from '@/components/ui/tablecomponents/ColumnHelper'

// Helper kecil agar tidak perlu mengulang penulisan fetcher
const fetchBooksFilter = (col: keyof BookRow) => () => booksApi.getUniqueColumnValues(col)

export const bookColumns: ColumnDef<BookRow>[] = [
  createStandardColumn<BookRow>({
    id: 'id',
    header: 'ID',
    dataType: 'uuid',
    isReadOnly: true,
    isCopyable: true,
    fetchFilterOptions: fetchBooksFilter('id')
  }),
  createStandardColumn<BookRow>({
    id: 'global_order',
    header: 'Global Order',
    dataType: 'number',
    fetchFilterOptions: fetchBooksFilter('global_order')
  }),
  createStandardColumn<BookRow>({
    id: 'scripture_id',
    header: 'Scripture ID',
    dataType: 'text',
    isCopyable: true,
    fetchFilterOptions: fetchBooksFilter('scripture_id')
  }),
  createStandardColumn<BookRow>({
    id: 'category',
    header: 'Kategori',
    dataType: 'text',
    dropdownOptions: ['Old Testament', 'New Testament'],
    fetchFilterOptions: fetchBooksFilter('category')
  }),
  createStandardColumn<BookRow>({
    id: 'kitab',
    header: 'Kitab',
    dataType: 'text',
    fetchFilterOptions: fetchBooksFilter('kitab')
  }),
  createStandardColumn<BookRow>({
    id: 'pasal',
    header: 'Pasal',
    dataType: 'number',
    fetchFilterOptions: fetchBooksFilter('pasal')
  }),
  createStandardColumn<BookRow>({
    id: 'book',
    header: 'Book',
    dataType: 'text',
    fetchFilterOptions: fetchBooksFilter('book')
  }),
  createStandardColumn<BookRow>({
    id: 'chapter',
    header: 'Chapter',
    dataType: 'number',
    fetchFilterOptions: fetchBooksFilter('chapter')
  }),
  createStandardColumn<BookRow>({
    id: 'total_verses',
    header: 'Total Verses',
    dataType: 'number',
    fetchFilterOptions: fetchBooksFilter('total_verses')
  }),
  createStandardColumn<BookRow>({
    id: 'last_updated_at',
    header: 'Last Updated At',
    dataType: 'datetime',
    isReadOnly: true,
    size: 250, // Bisa custom lebar kolom juga!
    fetchFilterOptions: fetchBooksFilter('last_updated_at')
  }),
  createStandardColumn<BookRow>({
    id: 'last_updated_by',
    header: 'Last Updated By',
    dataType: 'text',
    isReadOnly: true,
    fetchFilterOptions: fetchBooksFilter('last_updated_by')
  })
]
