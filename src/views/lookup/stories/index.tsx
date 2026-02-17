// src/view/lookup/stories/index.ts

'use client'
import SupabaseTableRenderer from '@/components/table/SupabaseTableRenderer'

const StoriesTab = () => {
  return (
    <SupabaseTableRenderer 
      tableName='books' 
      defaultSort={{ column: 'global_order', ascending: true }} 
    />
  )
}

export default StoriesTab
