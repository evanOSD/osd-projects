// src/hooks/useSteps.ts

import { useQuery } from '@tanstack/react-query'

import { createClient } from '@core/utils/supabaseClient'

export const useSteps = (categoryFilter?: string) => {
  const supabase = createClient()

  return useQuery({
    // Cache key dinamis berdasarkan filter
    queryKey: ['steps', categoryFilter], 
    queryFn: async () => {
      let query = supabase.from('steps' as any).select('*').order('default_order', { ascending: true })
      
      // Jika ada filter kategori (misal: 'translation'), gunakan .contains() karena step_category adalah ARRAY di database Anda
      if (categoryFilter) {
        query = query.contains('step_category', [categoryFilter])
      }

      const { data, error } = await query

      if (error) throw error
      
return data
    }
  })
}
