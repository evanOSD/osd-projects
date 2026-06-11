// src/hooks/queries/users/usePermissionsMatrix.ts

import { useInfiniteQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { permissionsMatrixApi, PermissionMatrixRow } from '@/api/users/permissionsMatrix'
import { createClient } from '@/lib/supabase/client'

export function usePermissionsMatrix(filters: Record<string, string[]> = {}, sorting: any[] = [], pageSize = 1000) {
  return useInfiniteQuery({
    queryKey: ['permissions-matrix', filters, sorting],
    queryFn: ({ pageParam = 0 }) => permissionsMatrixApi.getMatrix({ pageIndex: pageParam, pageSize }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => (lastPage.length === pageSize ? allPages.length : undefined),
    placeholderData: keepPreviousData
  })
}

export function useAddPermissionMatrix() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<PermissionMatrixRow>) => permissionsMatrixApi.addMatrixRow(payload),
    onSuccess: () => {
      // Toast biarkan ditangani oleh tabel Anda jika sudah ada, atau tambahkan di sini:
      toast.success('Pengguna dan Hak Akses berhasil ditambahkan!')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions-matrix'] })
      queryClient.invalidateQueries({ queryKey: ['users'] }) // Sinkronkan ke Tab 1
    }
  })
}

export function useUpdatePermissionMatrix() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<PermissionMatrixRow> }) =>
      permissionsMatrixApi.updateMatrixRow(id, payload),
    onSuccess: () => {
      toast.success('Hak akses tersimpan otomatis!', { duration: 1500, id: 'auto-save-toast' })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions-matrix'] })
    }
  })
}

// FUNGSI HAPUS ASLI (Menggantikan useDummyDelete)
export function useDeleteUsersMatrix() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (rows: PermissionMatrixRow[]) => {
      const supabase = createClient()
      const idsToDelete = rows.map(r => r.id)

      // Cukup tembak public.users, maka user_settings akan otomatis hancur karena CASCADE
      const { error } = await supabase.from('users').delete().in('id', idsToDelete)

      if (error) throw new Error(error.message)
      return idsToDelete
    },
    onSuccess: deletedIds => {
      toast.success(`${deletedIds.length} Pengguna berhasil dihapus dari sistem!`)
    },
    onError: (error: any) => {
      toast.error(`Gagal menghapus pengguna: ${error.message}`)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions-matrix'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}

// Dummy add (karena tambah user tetap hanya lewat Tab 1 atau register otomatis)
export function useDummyAdd() {
  return useMutation({ mutationFn: async () => {} })
}
