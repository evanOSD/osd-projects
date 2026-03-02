// src/app/(dashboard)/database/steps/hooks/useStepsPageLogic.ts

import { useTablePageLogic } from '@/hooks/ui/useTablePageLogic'
import { useSteps, useUpdateStep, useAddStep, useDeleteSteps } from '@/hooks/queries/database/useSteps'
import { StepRow, StepInsert } from '@/api/database/steps'
import { stepColumns } from '../config/columns'
import { STEP_TABLE_CONFIG } from '../config/constants'

const SELECTED_ROW_COLUMNS = ['default_order', 'step_name', 'step_category', 'input_type']

export function useStepsPageLogic() {
  return useTablePageLogic<StepRow, StepInsert>({
    columns: stepColumns,
    defaultHiddenColumns: STEP_TABLE_CONFIG.defaultHiddenColumns,
    selectedRowDisplayColumns: SELECTED_ROW_COLUMNS,
    defaultSorting: [{ id: 'default_order', desc: false }],

    generateTempRow: () => ({
      id: `temp-${Date.now()}`,
      default_order: 0,
      step_name: '',
      step_category: [],
      input_type: []
    }),

    useQueryHook: useSteps,
    useUpdateMutation: useUpdateStep,
    useAddMutation: useAddStep,
    useDeleteMutation: useDeleteSteps
  })
}
