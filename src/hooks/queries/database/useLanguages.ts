// src/hooks/queries/database/useLanguages.ts

import { useInfiniteQuery, useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { languagesApi, LanguageUpdate, LanguageInsert, LanguageRow } from "@/api/database/languages"

export function useLanguages(filters: Record<string, string[]> = {}, sorting: any[] = [], pageSize = 1000) {
  return useInfiniteQuery({
    queryKey: ['languages', filters, sorting],
    queryFn: ({ pageParam = 0 }) => languagesApi.getLanguages({ pageIndex: pageParam, pageSize, filters, sorting }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === pageSize ? allPages.length : undefined
    },
    placeholderData: keepPreviousData, 
  })
}

export function useLanguageFilterOptions(columnName: keyof LanguageRow, enabled: boolean = true) {
  return useQuery({
    queryKey: ['languages', 'filterOptions', columnName],
    queryFn: () => languagesApi.getUniqueColumnValues(columnName),
    staleTime: 1000 * 60 * 60, 
    enabled: enabled, 
  })
}

export function useUpdateLanguage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: LanguageUpdate }) => languagesApi.updateLanguage(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] })
      toast.success("Tersimpan!", { duration: 1500, id: "auto-save-toast" })
    },
    onError: (error) => {
      toast.error(`Gagal menyimpan: ${error.message}`)
    }
  })
}

export function useAddLanguage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: LanguageInsert) => languagesApi.addLanguage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] })
      toast.success("Baris baru ditambahkan di paling atas!")
    },
    onError: (error) => {
      toast.error(`Gagal menambah baris: ${error.message}`)
    }
  })
}

export function useDeleteLanguages() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const promises = ids.map(id => languagesApi.deleteLanguage(id))
      await Promise.all(promises)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] })
    }
  })
}
