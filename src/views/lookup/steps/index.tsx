// src/view/lookup/steps/index.ts

'use client'
import SupabaseTableRenderer from '@/components/table/SupabaseTableRenderer'

const StepsTab = () => {
  return (
    <SupabaseTableRenderer 
      tableName='steps' 
      defaultSort={{ column: 'default_order', ascending: true }}
      defaultColumns={['step_name', 'default_order', 'is_mandatory', 'input_type', 'required_input_types', 'depends_on_step', 'step_category']}
    />
  )
}

export default StepsTab
