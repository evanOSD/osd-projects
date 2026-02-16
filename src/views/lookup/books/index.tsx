'use client'
import SupabaseTableRenderer from '@/app/(dashboard)/lookup/SupabaseTableRenderer'

const BooksTab = () => {
  return <SupabaseTableRenderer tableName='books' />
}

export default BooksTab
