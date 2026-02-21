// src/hooks/usePassages.ts

import { useQuery } from '@tanstack/react-query'

import { createClient } from '@core/utils/supabaseClient'

export const usePassages = () => {
  const supabase = createClient()

  return useQuery({
    queryKey: ['passages'],
    queryFn: async () => {
      const { data, error } = await supabase.from('passages' as any).select('*')

      if (error) throw error
      
return data
    }
  })
}
