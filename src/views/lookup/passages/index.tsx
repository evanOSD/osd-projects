// src/view/lookup/passages/index.ts

'use client'
import SupabaseTableRenderer from '@/components/table/SupabaseTableRenderer'

const PassagesTab = () => {
  return (
    <SupabaseTableRenderer 
      tableName='passages' 
      defaultSort={{ column: 'global_order', ascending: true }}
      defaultColumns={['category', 'kitab', 'dasar_perikop', 'judul_perikop', 'total_verses', 'last_updated_at']}
    />
  )
}

export default PassagesTab
