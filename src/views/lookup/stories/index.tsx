// src/view/lookup/stories/index.ts

'use client'
import SupabaseTableRenderer from '@/components/table/SupabaseTableRenderer'

const StoriesTab = () => {
  return (
    <SupabaseTableRenderer 
      tableName='stories' 
      defaultSort={{ column: 'global_order', ascending: true }}
      defaultColumns={['story_category', 'book_category', 'judul_cerita', 'dasar_perikop', 'last_updated_at']}
    />
  )
}

export default StoriesTab
