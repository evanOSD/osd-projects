// src/view/lookup/stories/index.ts

'use client'
import SupabaseTableRenderer from '@/components/table/SupabaseTableRenderer'

const StoriesTab = () => {
  return <SupabaseTableRenderer tableName='stories' />
}

export default StoriesTab
