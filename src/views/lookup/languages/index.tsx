// src/view/lookup/languages/index.ts

'use client'
import SupabaseTableRenderer from '@/components/table/SupabaseTableRenderer'

const LanguagesTab = () => {
  return <SupabaseTableRenderer tableName='languages' />
}

export default LanguagesTab
