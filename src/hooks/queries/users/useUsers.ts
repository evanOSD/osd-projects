// src/hooks/queries/users/useUsers.ts
import { useInfiniteQuery, useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { usersApi, UserUpdate, UserInsert, UserRow } from '@/api/users/users'

export function useUsers(filters: Record<string, string[]> = {}, sorting: any[] = [], pageSize = 1000) {
  return useInfiniteQuery({
    queryKey: ['users', filters, sorting],
    queryFn: ({ pageParam = 0 }) => usersApi.getUsers({ pageIndex: pageParam, pageSize, filters, sorting }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === pageSize ? allPages.length : undefined
    },
    placeholderData: keepPreviousData
  })
}

export function useUserFilterOptions(columnName: keyof UserRow, enabled: boolean = true) {
  return useQuery({
    queryKey: ['users', 'filterOptions', columnName],
    queryFn: () => usersApi.getUniqueColumnValues(columnName),
    staleTime: 1000 * 60 * 60,
    enabled: enabled
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UserUpdate }) => usersApi.updateUser(id, payload),
    onSuccess: () => {
      // Toast hanya muncul kalau sukses
      toast.success('Profil User Tersimpan!', { duration: 1500, id: 'auto-save-toast' })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}

export function useAddUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UserInsert) => usersApi.addUser(payload),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}

export function useDeleteUsers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const promises = ids.map(id => usersApi.deleteUser(id))
      await Promise.all(promises)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}
