// src/view/lookup/passages/index.ts

'use client'
import SupabaseTableRenderer from '@/components/table/SupabaseTableRenderer'

const PassagesTab = () => {
  return <SupabaseTableRenderer tableName='passages' />
}

export default PassagesTab
