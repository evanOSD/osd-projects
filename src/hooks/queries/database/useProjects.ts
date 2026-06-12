// src/hooks/queries/database/useProjects.ts

import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '@/api/database/projects'

export function useProjectsList() {
  return useQuery({
    queryKey: ['projectsList'],
    queryFn: () => projectsApi.getAllProjects(),
    staleTime: 1000 * 60 * 5 // Cache for 5 minutes
  })
}
