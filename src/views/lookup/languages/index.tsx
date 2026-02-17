// src/view/lookup/languages/index.ts

'use client'
import SupabaseTableRenderer from '@/components/table/SupabaseTableRenderer'

const LanguagesTab = () => {
  return (
    <SupabaseTableRenderer 
      tableName='books' 
      defaultSort={{ column: 'global_order', ascending: true }} 
    />
  )
}

export default LanguagesTab
