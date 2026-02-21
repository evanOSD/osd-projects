// src/hooks/useLanguages.ts

import { useQuery } from '@tanstack/react-query'

import { createClient } from '@core/utils/supabaseClient'

export const useLanguages = () => {
  const supabase = createClient()

  return useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      const { data, error } = await supabase.from('languages' as any).select('*')

      if (error) throw error
      
return data
    }
  })
}
