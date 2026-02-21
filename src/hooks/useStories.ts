// src/hooks/useStories.ts

import { useQuery } from '@tanstack/react-query'

import { createClient } from '@core/utils/supabaseClient'

export const useStories = () => {
  const supabase = createClient()

  return useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('stories' as any).select('*')

      if (error) throw error
      
return data
    }
  })
}
