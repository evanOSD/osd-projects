// src/hooks/useProjects.ts

import { useQuery } from '@tanstack/react-query'

import { createClient } from '@core/utils/supabaseClient'

export const useProjects = () => {
  const supabase = createClient() // <-- Panggil di dalam hook

  return useQuery({
    queryKey: ['projects'], // Nama cache agar data tidak ditarik berulang-ulang
    queryFn: async () => {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data
    }
  })
}
