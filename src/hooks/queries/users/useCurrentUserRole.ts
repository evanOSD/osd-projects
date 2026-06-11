// src/hooks/queries/users/useCurrentUserRole.ts

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useCurrentUserRole(userId: string | undefined) {
  return useQuery({
    queryKey: ['current-user-role', userId],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('users') // Mengambil data dari public.users
        .select('role')
        .eq('id', userId!)
        .single()

      if (error) throw new Error(error.message)
      return data?.role || 'Guest'
    },
    enabled: !!userId
  })
}
