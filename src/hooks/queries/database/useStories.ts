// src/hooks/queries/database/useStories.ts

import { useInfiniteQuery, useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { storiesApi, StoryUpdate, StoryInsert, StoryRow } from '@/api/database/stories'

export function useStories(filters: Record<string, string[]> = {}, sorting: any[] = [], pageSize = 1000) {
  return useInfiniteQuery({
    queryKey: ['stories', filters, sorting],
    queryFn: ({ pageParam = 0 }) => storiesApi.getStories({ pageIndex: pageParam, pageSize, filters, sorting }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === pageSize ? allPages.length : undefined
    },
    placeholderData: keepPreviousData
  })
}

export function useStoryFilterOptions(columnName: keyof StoryRow, enabled: boolean = true) {
  return useQuery({
    queryKey: ['stories', 'filterOptions', columnName],
    queryFn: () => storiesApi.getUniqueColumnValues(columnName),
    staleTime: 1000 * 60 * 60,
    enabled: enabled
  })
}

export function useUpdateStory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: StoryUpdate }) => storiesApi.updateStory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] })
      toast.success('Tersimpan!', { duration: 1500, id: 'auto-save-toast' })
    },
    onError: error => {
      toast.error(`Gagal menyimpan: ${error.message}`)
    }
  })
}

export function useAddStory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: StoryInsert) => storiesApi.addStory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] })
      toast.success('Baris baru ditambahkan di paling atas!')
    },
    onError: error => {
      toast.error(`Gagal menambah baris: ${error.message}`)
    }
  })
}

export function useDeleteStories() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const promises = ids.map(id => storiesApi.deleteStory(id))
      await Promise.all(promises)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] })
    }
  })
}
