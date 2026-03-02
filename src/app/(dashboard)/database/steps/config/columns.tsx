// src/app/(dashboard)/database/steps/config/columns.tsx

import { ColumnDef } from '@tanstack/react-table'
import { StepRow, stepsApi } from '@/api/database/steps'
import { createStandardColumn } from '@/components/ui/tablecomponents/ColumnHelper'

const fetchStepsFilter = (col: keyof StepRow) => () => stepsApi.getUniqueColumnValues(col)

export const stepColumns: ColumnDef<StepRow>[] = [
  createStandardColumn<StepRow>({
    id: 'id',
    header: 'ID',
    dataType: 'uuid',
    isReadOnly: true,
    isCopyable: true,
    fetchFilterOptions: fetchStepsFilter('id')
  }),
  createStandardColumn<StepRow>({
    id: 'default_order',
    header: 'Default Order',
    dataType: 'text', // Kadang order pakai string seperti 'A-1'
    size: 210,
    isPinned: true,
    fetchFilterOptions: fetchStepsFilter('default_order')
  }),
  createStandardColumn<StepRow>({
    id: 'step_name',
    header: 'Step Name',
    dataType: 'text',
    size: 300,
    isPinned: true,
    fetchFilterOptions: fetchStepsFilter('step_name')
  }),
  createStandardColumn<StepRow>({
    id: 'step_category',
    header: 'Category',
    // KITA PAKAI ANY SEMENTARA AGAR TIDAK ERROR DI COLUMN HELPER LAMA
    dataType: 'text-array' as any,
    size: 300,
    dropdownOptions: ['administration', 'finance', 'translation'], // Contoh opsi multi-select
    fetchFilterOptions: fetchStepsFilter('step_category')
  }),
  createStandardColumn<StepRow>({
    id: 'input_type',
    header: 'Input Type',
    dataType: 'text-array' as any,
    size: 300,
    dropdownOptions: ['boolean','text', 'date_picker', 'google_drive_link'], // Contoh opsi
    fetchFilterOptions: fetchStepsFilter('input_type')
  }),
  createStandardColumn<StepRow>({
    id: 'step_description',
    header: 'Description',
    dataType: 'text',
    size: 350,
    fetchFilterOptions: fetchStepsFilter('step_description')
  }),
  createStandardColumn<StepRow>({
    id: 'last_updated_at',
    header: 'Last Updated At',
    dataType: 'datetime',
    size: 230,
    isReadOnly: true,
    fetchFilterOptions: fetchStepsFilter('last_updated_at')
  }),
  createStandardColumn<StepRow>({
    id: 'last_updated_by',
    header: 'Last Updated By',
    dataType: 'text',
    size: 350,
    fetchFilterOptions: fetchStepsFilter('step_description')
  })
]
