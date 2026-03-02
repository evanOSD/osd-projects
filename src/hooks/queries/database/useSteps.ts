// src/hooks/queries/database/useSteps.ts

import { useInfiniteQuery, useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { stepsApi, StepUpdate, StepInsert, StepRow } from '@/api/database/steps'

export function useSteps(filters: Record<string, string[]> = {}, sorting: any[] = [], pageSize = 1000) {
  return useInfiniteQuery({
    queryKey: ['steps', filters, sorting],
    queryFn: ({ pageParam = 0 }) => stepsApi.getSteps({ pageIndex: pageParam, pageSize, filters, sorting }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === pageSize ? allPages.length : undefined
    },
    placeholderData: keepPreviousData
  })
}

export function useStepFilterOptions(columnName: keyof StepRow, enabled: boolean = true) {
  return useQuery({
    queryKey: ['steps', 'filterOptions', columnName],
    queryFn: () => stepsApi.getUniqueColumnValues(columnName),
    staleTime: 1000 * 60 * 60,
    enabled: enabled
  })
}

export function useUpdateStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: StepUpdate }) => stepsApi.updateStep(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['steps'] })
      toast.success('Tersimpan!', { duration: 1500, id: 'auto-save-toast' })
    },
    onError: error => {
      toast.error(`Gagal menyimpan: ${error.message}`)
    }
  })
}

export function useAddStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: StepInsert) => stepsApi.addStep(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['steps'] })
      toast.success('Tahapan baru ditambahkan!')
    },
    onError: error => {
      toast.error(`Gagal menambah tahapan: ${error.message}`)
    }
  })
}

export function useDeleteSteps() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const promises = ids.map(id => stepsApi.deleteStep(id))
      await Promise.all(promises)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['steps'] })
    }
  })
}
