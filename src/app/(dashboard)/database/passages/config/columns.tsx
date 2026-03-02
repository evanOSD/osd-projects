// src/app/(dashboard)/database/passages/config/columns.tsx

import { ColumnDef } from '@tanstack/react-table'
import { PassageRow, passagesApi } from '@/api/database/passages'
import { createStandardColumn } from '@/components/ui/tablecomponents/ColumnHelper'

const fetchPassagesFilter = (col: keyof PassageRow) => () => passagesApi.getUniqueColumnValues(col)

export const passageColumns: ColumnDef<PassageRow>[] = [
  createStandardColumn<PassageRow>({
    id: 'id',
    header: 'ID',
    dataType: 'uuid',
    isReadOnly: true,
    isCopyable: true,
    fetchFilterOptions: fetchPassagesFilter('id')
  }),
  createStandardColumn<PassageRow>({
    id: 'global_order',
    header: 'Global Order',
    dataType: 'number',
    fetchFilterOptions: fetchPassagesFilter('global_order')
  }),
  createStandardColumn<PassageRow>({
    id: 'book_order',
    header: 'Book Order',
    dataType: 'text',
    size: 190,
    fetchFilterOptions: fetchPassagesFilter('book_order')
  }),
  createStandardColumn<PassageRow>({
    id: 'category',
    header: 'Kategori',
    dataType: 'text',
    dropdownOptions: ['Old Testament', 'New Testament'],
    size: 180,
    fetchFilterOptions: fetchPassagesFilter('category')
  }),
  createStandardColumn<PassageRow>({
    id: 'kitab',
    header: 'Kitab',
    dataType: 'text',
    size: 170,
    fetchFilterOptions: fetchPassagesFilter('kitab')
  }),
  createStandardColumn<PassageRow>({
    id: 'dasar_perikop',
    header: 'Dasar Perikop',
    dataType: 'text',
    size: 210,
    fetchFilterOptions: fetchPassagesFilter('dasar_perikop')
  }),
  createStandardColumn<PassageRow>({
    id: 'judul_perikop',
    header: 'Judul Perikop',
    dataType: 'text',
    size: 600,
    fetchFilterOptions: fetchPassagesFilter('judul_perikop')
  }),
  createStandardColumn<PassageRow>({
    id: 'book',
    header: 'Book (English)',
    dataType: 'text',
    size: 210,
    fetchFilterOptions: fetchPassagesFilter('book')
  }),
  createStandardColumn<PassageRow>({
    id: 'passage_reference',
    header: 'Reference',
    dataType: 'text',
    size: 180,
    fetchFilterOptions: fetchPassagesFilter('passage_reference')
  }),
  createStandardColumn<PassageRow>({
    id: 'passage_title',
    header: 'Title (English)',
    dataType: 'text',
    size: 550,
    fetchFilterOptions: fetchPassagesFilter('passage_title')
  }),
  createStandardColumn<PassageRow>({
    id: 'total_verses',
    header: 'Total Verses',
    dataType: 'number',
    fetchFilterOptions: fetchPassagesFilter('total_verses')
  }),
  createStandardColumn<PassageRow>({
    id: 'last_updated_at',
    header: 'Last Updated At',
    dataType: 'datetime',
    size: 230,
    isReadOnly: true,
    fetchFilterOptions: fetchPassagesFilter('last_updated_at')
  }),
  createStandardColumn<PassageRow>({
    id: 'last_updated_by',
    header: 'Last Updated By',
    dataType: 'text',
    isReadOnly: true,
    size: 230,
    fetchFilterOptions: fetchPassagesFilter('last_updated_by')
  })
]
