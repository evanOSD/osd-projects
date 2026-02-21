// src/components/table/hooks/useTableMetadata.ts

import { useState, useEffect } from 'react'

import { createClient } from '@core/utils/supabaseClient'

export const useTableMetadata = (tableName: string) => {
  const [columnTypes, setColumnTypes] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchTypes = async () => {
      // 1. Panggil createClient() di sini untuk mendapatkan koneksi tunggal
      const supabase = createClient()
      
      // Query ke tabel sistem Postgres untuk mendapatkan info kolom
      const { data } = await supabase
        .rpc('get_column_types', { table_name_param: tableName }) 

      if (data) {
        const types: Record<string, string> = {}

        data.forEach((row: any) => {
          types[row.column_name] = row.udt_name
        })
        setColumnTypes(types)
      }
    }

    if (tableName) fetchTypes()
  }, [tableName])

  return columnTypes
}
