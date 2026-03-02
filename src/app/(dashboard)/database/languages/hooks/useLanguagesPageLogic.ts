// src/app/(dashboard)/database/languages/hooks/useLanguagesPageLogic.ts

import { useTablePageLogic } from '@/hooks/ui/useTablePageLogic'
import { useLanguages, useUpdateLanguage, useAddLanguage, useDeleteLanguages } from '@/hooks/queries/database/useLanguages'
import { LanguageRow, LanguageInsert } from '@/api/database/languages'
import { languageColumns } from '../config/columns'
import { LANGUAGE_TABLE_CONFIG } from '../config/constants'

// Tentukan kolom apa yang muncul di Modal "Lihat Terpilih"
const SELECTED_ROW_COLUMNS = ['name_with_code', 'iso_code', 'primary_country', 'province', 'population']

export function useLanguagesPageLogic() {
  return useTablePageLogic<LanguageRow, LanguageInsert>({
    columns: languageColumns,
    defaultHiddenColumns: LANGUAGE_TABLE_CONFIG.defaultHiddenColumns,
    selectedRowDisplayColumns: SELECTED_ROW_COLUMNS,
    // SETTING DEFAULT SORTING SESUAI PERMINTAAN:
    defaultSorting: [{ id: 'name_with_code', desc: false }],
    
    // Baris kosong sementara
    generateTempRow: () => ({
      id: `temp-${Date.now()}`,
      name_with_code: '',
      iso_code: '',
      primary_country: 'Indonesia', // Default praktis
      is_v2025: false
    }),

    useQueryHook: useLanguages,
    useUpdateMutation: useUpdateLanguage,
    useAddMutation: useAddLanguage,
    useDeleteMutation: useDeleteLanguages
  })
}
