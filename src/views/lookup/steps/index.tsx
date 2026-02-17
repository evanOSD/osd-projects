// src/view/lookup/steps/index.ts

'use client'
import SupabaseTableRenderer from '@/components/table/SupabaseTableRenderer'

const StepsTab = () => {
  return (
    <SupabaseTableRenderer 
      tableName='steps' 
      defaultSort={{ column: 'default_order', ascending: true }} 
    />
  )
}

export default StepsTab
