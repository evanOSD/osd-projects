// src/app/(dashboard)/database/stories/config/columns.tsx

import { ColumnDef } from '@tanstack/react-table'
import { StoryRow, storiesApi } from '@/api/database/stories'
import { createStandardColumn } from '@/components/ui/tablecomponents/ColumnHelper'

const fetchStoriesFilter = (col: keyof StoryRow) => () => storiesApi.getUniqueColumnValues(col)

export const storyColumns: ColumnDef<StoryRow>[] = [
  createStandardColumn<StoryRow>({
    id: 'id',
    header: 'ID',
    dataType: 'uuid',
    isReadOnly: true,
    isCopyable: true,
    fetchFilterOptions: fetchStoriesFilter('id')
  }),
  createStandardColumn<StoryRow>({
    id: 'global_order',
    header: 'Global Order',
    dataType: 'number',
    fetchFilterOptions: fetchStoriesFilter('global_order')
  }),
  createStandardColumn<StoryRow>({
    id: 'scripture_ref_id',
    header: 'Scripture Ref ID',
    dataType: 'text',
    isCopyable: true,
    size: 220,
    fetchFilterOptions: fetchStoriesFilter('scripture_ref_id')
  }),
  createStandardColumn<StoryRow>({
    id: 'story_category',
    header: 'Kategori Cerita',
    dataType: 'text',
    size: 220,
    fetchFilterOptions: fetchStoriesFilter('story_category')
  }),
  createStandardColumn<StoryRow>({
    id: 'judul_cerita',
    header: 'Judul Cerita',
    dataType: 'text',
    size: 280, // Diperlebar karena teksnya sering panjang, fitur auto-wrap kita akan sangat berguna di sini!
    fetchFilterOptions: fetchStoriesFilter('judul_cerita')
  }),
  createStandardColumn<StoryRow>({
    id: 'dasar_perikop',
    header: 'Dasar Perikop',
    dataType: 'text',
    size: 220,
    fetchFilterOptions: fetchStoriesFilter('dasar_perikop')
  }),
  createStandardColumn<StoryRow>({
    id: 'story_title',
    header: 'Story Title (English)',
    dataType: 'text',
    size: 280,
    fetchFilterOptions: fetchStoriesFilter('story_title')
  }),
  createStandardColumn<StoryRow>({
    id: 'book_reference',
    header: 'Reference (English)',
    dataType: 'text',
    size: 250,
    fetchFilterOptions: fetchStoriesFilter('book_reference')
  }),
  createStandardColumn<StoryRow>({
    id: 'last_updated_at',
    header: 'Last Updated At',
    dataType: 'datetime',
    isReadOnly: true,
    size: 230,
    fetchFilterOptions: fetchStoriesFilter('last_updated_at')
  }),
  createStandardColumn<StoryRow>({
    id: 'last_updated_by',
    header: 'Last Updated By',
    dataType: 'text',
    isReadOnly: true,
    size: 230,
    fetchFilterOptions: fetchStoriesFilter('last_updated_by')
  })
]
