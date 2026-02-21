// src/hooks/useBooks.ts

import { useQuery } from '@tanstack/react-query'

import { createClient } from '@core/utils/supabaseClient'

export const useBooks = () => {
  const supabase = createClient()

  return useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data, error } = await supabase.from('books' as any).select('*')

      if (error) throw error
      
return data
    }
  })
}
