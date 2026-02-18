// src/view/lookup/books/index.ts

'use client'
import SupabaseTableRenderer from '@/components/table/SupabaseTableRenderer'

const BooksTab = () => {
  // Melempar default sort langsung dari sini!
  return (
    <SupabaseTableRenderer 
      tableName='books' 
      defaultSort={{ column: 'global_order', ascending: true }}
      defaultColumns={['category', 'kitab', 'pasal', 'total_verses', 'last_updated_at']}
    />
  )
}

export default BooksTab
