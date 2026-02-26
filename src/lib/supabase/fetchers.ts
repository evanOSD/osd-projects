// src/lib/supabase/fetchers.ts

import { createClient } from '@/lib/supabase/client'

export const createSupabaseFetcher = (tableName: string, columnName: string) => {
  return async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from(tableName)
      .select(columnName)
      .not(columnName, 'is', null)

    if (error || !data) return []

    // Dinamis mengambil field berdasarkan variable columnName
    const values = data.map((item: any) => item[columnName])
    return [...new Set(values)].sort()
  }
}
