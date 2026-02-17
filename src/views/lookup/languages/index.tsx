// src/view/lookup/languages/index.ts

'use client'
import SupabaseTableRenderer from '@/components/table/SupabaseTableRenderer'

const LanguagesTab = () => {
  return (
    <SupabaseTableRenderer 
      tableName='languages' 
      defaultSort={{ column: 'name_with_code', ascending: true }} 
    />
  )
}

export default LanguagesTab
