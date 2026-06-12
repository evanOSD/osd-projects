// src/hooks/queries/database/useProjects.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '@/api/database/projects'
import toast from 'react-hot-toast'
import { Database } from '@/types/supabase'

export function useProjectsList() {
  return useQuery({
    queryKey: ['projectsList'],
    queryFn: () => projectsApi.getAllProjects(),
    staleTime: 1000 * 60 * 5 // Cache for 5 minutes
  })
}

export function useProjectByShortId(shortId: string) {
  return useQuery({
    queryKey: ['projectByShortId', shortId],
    queryFn: () => projectsApi.getProjectByShortId(shortId),
    enabled: !!shortId,
    staleTime: 1000 * 60 * 5 // Cache for 5 minutes
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      projectsApi.updateProject(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projectByShortId', data.short_id] })
      queryClient.invalidateQueries({ queryKey: ['projectsList'] })
      toast.success('Informasi proyek berhasil diperbarui!')
    },
    onError: (error: any) => {
      toast.error(`Gagal menyimpan: ${error.message}`)
    }
  })
}

export function useUpdateProjectLanguages(shortId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, selections }: { projectId: string; selections: { language_id: string; language_pseudonym: string | null }[] }) =>
      projectsApi.updateProjectLanguages(projectId, selections),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectByShortId', shortId] })
      queryClient.invalidateQueries({ queryKey: ['projectsList'] })
      toast.success('Bahasa proyek berhasil diperbarui!')
    },
    onError: (error: any) => {
      toast.error(`Gagal memperbarui bahasa: ${error.message}`)
    }
  })
}

export function useAllOrganizationsList() {
  return useQuery({
    queryKey: ['organizationsList'],
    queryFn: () => projectsApi.getAllOrganizations(),
    staleTime: 1000 * 60 * 10
  })
}

export function useUpdateProjectMembers(shortId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      projectId,
      role,
      userIds
    }: {
      projectId: string
      role: Database['public']['Enums']['project_role']
      userIds: string[]
    }) => projectsApi.updateProjectMembers(projectId, role, userIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectByShortId', shortId] })
      queryClient.invalidateQueries({ queryKey: ['projectsList'] })
      toast.success('Anggota tim proyek berhasil diperbarui!')
    },
    onError: (error: any) => {
      toast.error(`Gagal memperbarui anggota tim: ${error.message}`)
    }
  })
}
