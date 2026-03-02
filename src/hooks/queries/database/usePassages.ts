// src/hooks/queries/database/usePassages.ts

import { useInfiniteQuery, useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { passagesApi, PassageUpdate, PassageInsert, PassageRow } from "@/api/database/passages"

export function usePassages(filters: Record<string, string[]> = {}, sorting: any[] = [], pageSize = 1000) {
  return useInfiniteQuery({
    queryKey: ['passages', filters, sorting],
    queryFn: ({ pageParam = 0 }) => passagesApi.getPassages({ pageIndex: pageParam, pageSize, filters, sorting }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === pageSize ? allPages.length : undefined
    },
    placeholderData: keepPreviousData, 
  })
}

export function usePassageFilterOptions(columnName: keyof PassageRow, enabled: boolean = true) {
  return useQuery({
    queryKey: ['passages', 'filterOptions', columnName],
    queryFn: () => passagesApi.getUniqueColumnValues(columnName),
    staleTime: 1000 * 60 * 60, 
    enabled: enabled, 
  })
}

export function useUpdatePassage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PassageUpdate }) => passagesApi.updatePassage(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passages'] })
      toast.success("Tersimpan!", { duration: 1500, id: "auto-save-toast" })
    },
    onError: (error) => {
      toast.error(`Gagal menyimpan: ${error.message}`)
    }
  })
}

export function useAddPassage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PassageInsert) => passagesApi.addPassage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passages'] })
      toast.success("Baris baru ditambahkan di paling atas!")
    },
    onError: (error) => {
      toast.error(`Gagal menambah baris: ${error.message}`)
    }
  })
}

export function useDeletePassages() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const promises = ids.map(id => passagesApi.deletePassage(id))
      await Promise.all(promises)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passages'] })
    }
  })
}
