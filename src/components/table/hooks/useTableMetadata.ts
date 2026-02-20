// src/components/table/hooks/useTableMetadata.ts

import { useState, useEffect } from 'react'

import { createClient } from '@core/utils/supabaseClient'

export const useTableMetadata = (tableName: string) => {
  const [columnTypes, setColumnTypes] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchTypes = async () => {
      const supabase = createClient()
      
      // Query ke tabel sistem Postgres untuk mendapatkan info kolom
      // Ini query standar untuk melihat struktur tabel
      const { data } = await supabase
        .rpc('get_column_types', { table_name_param: tableName }) 

        // Catatan: Kamu perlu membuat fungsi RPC ini di Supabase SQL Editor
        // Jika tidak ingin pakai RPC, kita bisa pakai pendekatan "tebak-tebakan" di formatUtils tadi.
      
      if (data) {
        const types: Record<string, string> = {}

        data.forEach((row: any) => {
          types[row.column_name] = row.udt_name // udt_name berisi 'uuid', 'int4', 'text', dll
        })
        setColumnTypes(types)
      }
    }

    if (tableName) fetchTypes()
  }, [tableName])

  return columnTypes
}
