// src/app/(dashboard)/database/passages/hooks/usePassagesPageLogic.ts

import { useTablePageLogic } from '@/hooks/ui/useTablePageLogic'
import { usePassages, useUpdatePassage, useAddPassage, useDeletePassages } from '@/hooks/queries/database/usePassages'
import { PassageRow, PassageInsert } from '@/api/database/passages'
import { passageColumns } from '../config/columns'
import { PASSAGE_TABLE_CONFIG } from '../config/constants'

// Tentukan kolom apa yang muncul di Modal "Lihat Terpilih"
const SELECTED_ROW_COLUMNS = ['global_order', 'kitab', 'dasar_perikop', 'judul_perikop']

export function usePassagesPageLogic() {
  return useTablePageLogic<PassageRow, PassageInsert>({
    columns: passageColumns,
    defaultHiddenColumns: PASSAGE_TABLE_CONFIG.defaultHiddenColumns,
    selectedRowDisplayColumns: SELECTED_ROW_COLUMNS,
    defaultSorting: [{ id: 'global_order', desc: false }],
    
    // Baris kosong sementara khusus untuk Passages
    generateTempRow: () => ({
      id: `temp-${Date.now()}`,
      global_order: 0,
      kitab: '',
      judul_perikop: '',
      dasar_perikop: ''
    }),

    useQueryHook: usePassages,
    useUpdateMutation: useUpdatePassage,
    useAddMutation: useAddPassage,
    useDeleteMutation: useDeletePassages
  })
}
