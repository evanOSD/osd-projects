// src/app/(dashboard)/database/languages/config/columns.tsx

import { ColumnDef } from '@tanstack/react-table'
import { LanguageRow, languagesApi } from '@/api/database/languages'
import { createStandardColumn } from '@/components/ui/tablecomponents/ColumnHelper'

const fetchLanguagesFilter = (col: keyof LanguageRow) => () => languagesApi.getUniqueColumnValues(col)

export const languageColumns: ColumnDef<LanguageRow>[] = [
  createStandardColumn<LanguageRow>({
    id: 'id',
    header: 'ID',
    dataType: 'uuid',
    isReadOnly: true,
    isCopyable: true,
    fetchFilterOptions: fetchLanguagesFilter('id')
  }),
  createStandardColumn<LanguageRow>({
    id: 'name_with_code',
    header: 'Name with Code',
    isReadOnly: true,
    dataType: 'text',
    size: 230,
    isCopyable: true,
    isPinned: true, // Kolom utama yang selalu terlihat
    fetchFilterOptions: fetchLanguagesFilter('name_with_code')
  }),
  createStandardColumn<LanguageRow>({
    id: 'name_in_rev79',
    header: 'Name (Rev79)',
    isReadOnly: true,
    dataType: 'text',
    size: 220,
    fetchFilterOptions: fetchLanguagesFilter('name_in_rev79')
  }),
  createStandardColumn<LanguageRow>({
    id: 'name_in_ethnologue',
    header: 'Name (Ethnologue)',
    isReadOnly: true,
    dataType: 'text',
    size: 250,
    fetchFilterOptions: fetchLanguagesFilter('name_in_ethnologue')
  }),
  createStandardColumn<LanguageRow>({
    id: 'iso_code',
    header: 'ISO Code',
    isReadOnly: true,
    dataType: 'text',
    size: 175,
    fetchFilterOptions: fetchLanguagesFilter('iso_code')
  }),
  createStandardColumn<LanguageRow>({
    id: 'pseudonym',
    header: 'Pseudonym',
    dataType: 'text',
    size: 230,
    fetchFilterOptions: fetchLanguagesFilter('pseudonym')
  }),
  createStandardColumn<LanguageRow>({
    id: 'is_v2025',
    header: 'V2025',
    dataType: 'boolean',
    isReadOnly: true,
    size: 160,
    fetchFilterOptions: fetchLanguagesFilter('is_v2025')
  }),
  createStandardColumn<LanguageRow>({
    id: 'primary_country',
    header: 'Country',
    dataType: 'text',
    isReadOnly: true,
    size: 180,
    fetchFilterOptions: fetchLanguagesFilter('primary_country')
  }),
  createStandardColumn<LanguageRow>({
    id: 'province',
    header: 'Province',
    dataType: 'text',
    isReadOnly: true,
    size: 180,
    fetchFilterOptions: fetchLanguagesFilter('province')
  }),
  createStandardColumn<LanguageRow>({
    id: 'reached_status_joshua_project',
    header: 'Reached Status',
    dataType: 'text',
    isReadOnly: true,
    size: 220,
    fetchFilterOptions: fetchLanguagesFilter('reached_status_joshua_project')
  }),
  createStandardColumn<LanguageRow>({
    id: 'population',
    header: 'Population Category',
    dataType: 'text',
    isReadOnly: true,
    size: 250,
    fetchFilterOptions: fetchLanguagesFilter('population')
  }),
  createStandardColumn<LanguageRow>({
    id: 'total_population_ethnologue',
    header: 'Total Pop (Ethnologue)',
    dataType: 'text',
    isReadOnly: true,
    size: 270,
    fetchFilterOptions: fetchLanguagesFilter('total_population_ethnologue')
  }),
  createStandardColumn<LanguageRow>({
    id: 'global_egids',
    header: 'Global EGIDS',
    dataType: 'text',
    isReadOnly: true,
    size: 200,
    fetchFilterOptions: fetchLanguagesFilter('global_egids')
  }),
  createStandardColumn<LanguageRow>({
    id: 'aag_target',
    header: 'AAG Target',
    dataType: 'text',
    isReadOnly: true,
    fetchFilterOptions: fetchLanguagesFilter('aag_target')
  }),
  createStandardColumn<LanguageRow>({
    id: 'aag_status',
    header: 'AAG Status',
    dataType: 'text',
    isReadOnly: true,
    fetchFilterOptions: fetchLanguagesFilter('aag_status')
  }),
  createStandardColumn<LanguageRow>({
    id: 'geographical_access',
    header: 'Geographical Access',
    dataType: 'text',
    isReadOnly: true,
    size: 260,
    fetchFilterOptions: fetchLanguagesFilter('geographical_access')
  }),
  createStandardColumn<LanguageRow>({
    id: 'sociocultural_access',
    header: 'Sociocultural Access',
    dataType: 'text',
    isReadOnly: true,
    size: 260,
    fetchFilterOptions: fetchLanguagesFilter('sociocultural_access')
  }),
  createStandardColumn<LanguageRow>({
    id: 'alternate_names',
    header: 'Alternate Names',
    dataType: 'text',
    isReadOnly: true,
    size: 250,
    fetchFilterOptions: fetchLanguagesFilter('alternate_names')
  }),
  createStandardColumn<LanguageRow>({
    id: 'communities_dialects_subgroups_diaspora',
    header: 'Communities/Dialects',
    dataType: 'text',
    isReadOnly: true,
    size: 300,
    fetchFilterOptions: fetchLanguagesFilter('communities_dialects_subgroups_diaspora')
  }),
  createStandardColumn<LanguageRow>({
    id: 'completed_scripture_products',
    header: 'Completed Scripture',
    dataType: 'text',
    isReadOnly: true,
    size: 250,
    fetchFilterOptions: fetchLanguagesFilter('completed_scripture_products')
  }),
  createStandardColumn<LanguageRow>({
    id: 'last_updated_at',
    header: 'Last Updated At',
    dataType: 'datetime',
    isReadOnly: true,
    fetchFilterOptions: fetchLanguagesFilter('last_updated_at')
  }),
  createStandardColumn<LanguageRow>({
    id: 'last_updated_by',
    header: 'Last Updated By',
    dataType: 'text',
    isReadOnly: true,
    fetchFilterOptions: fetchLanguagesFilter('last_updated_by')
  })
]
