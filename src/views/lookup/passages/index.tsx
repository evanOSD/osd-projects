// src/view/lookup/passages/index.ts

'use client'
import SupabaseTableRenderer from '@/components/table/SupabaseTableRenderer'

const PassagesTab = () => {
  return (
    <SupabaseTableRenderer 
      tableName='passages' 
      defaultSort={{ column: 'name_with_code', ascending: true }} 
    />
  )
}

export default PassagesTab
