// src/app/(dashboard)/database/stories/hooks/useStoriesPageLogic.ts

import { useTablePageLogic } from '@/hooks/ui/useTablePageLogic'
import { useStories, useUpdateStory, useAddStory, useDeleteStories } from '@/hooks/queries/database/useStories'
import { StoryRow, StoryInsert } from '@/api/database/stories'
import { storyColumns } from '../config/columns'
import { STORY_TABLE_CONFIG } from '../config/constants'

// Tentukan kolom apa yang muncul di Modal "Lihat Terpilih"
const SELECTED_ROW_COLUMNS = ['global_order', 'story_category', 'judul_cerita', 'dasar_perikop']

export function useStoriesPageLogic() {
  return useTablePageLogic<StoryRow, StoryInsert>({
    columns: storyColumns,
    defaultHiddenColumns: STORY_TABLE_CONFIG.defaultHiddenColumns,
    selectedRowDisplayColumns: SELECTED_ROW_COLUMNS,
    defaultSorting: [{ id: 'global_order', desc: false }],

    // Baris kosong sementara saat menekan tombol "Tambah Baris"
    generateTempRow: () => ({
      id: `temp-${Date.now()}`,
      global_order: 0,
      scripture_ref_id: '',
      judul_cerita: '',
      dasar_perikop: '',
      story_category: 'OSD OBS Animations', // Default cerdas untuk kenyamanan user
      book_category: 'Old Testament'
    }),

    useQueryHook: useStories,
    useUpdateMutation: useUpdateStory,
    useAddMutation: useAddStory,
    useDeleteMutation: useDeleteStories
  })
}
