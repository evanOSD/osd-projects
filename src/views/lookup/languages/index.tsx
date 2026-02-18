// src/view/lookup/languages/index.ts

'use client'
import SupabaseTableRenderer from '@/components/table/SupabaseTableRenderer'

const LanguagesTab = () => {
  return (
    <SupabaseTableRenderer 
      tableName='languages' 
      defaultSort={{ column: 'name_with_code', ascending: true }}
      defaultColumns={['name_with_code', 'iso_code', 'pseudonym', 'communities_dialects_subgroups_diaspora',
        'global_egids', 'province', 'completed_scripture_products', 'total_population_ethnologue', 'last_updated_at']}
    />
  )
}

export default LanguagesTab
