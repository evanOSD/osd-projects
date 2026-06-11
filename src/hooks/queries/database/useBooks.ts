// src/hooks/queries/database/useBooks.ts

import { useInfiniteQuery, useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import toast from 'react-hot-toast' // <--- IMPORT TOAST DI SINI
import { booksApi, BookUpdate, BookInsert, BookRow } from '@/api/database/books'

export function useBooks(filters: Record<string, string[]> = {}, sorting: any[] = [], pageSize = 1000) {
  return useInfiniteQuery({
    queryKey: ['books', filters, sorting],
    queryFn: ({ pageParam = 0 }) => booksApi.getBooks({ pageIndex: pageParam, pageSize, filters, sorting }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === pageSize ? allPages.length : undefined
    },
    placeholderData: keepPreviousData
  })
}

export function useBookFilterOptions(columnName: keyof BookRow, enabled: boolean = true) {
  return useQuery({
    queryKey: ['books', 'filterOptions', columnName],
    queryFn: () => booksApi.getUniqueColumnValues(columnName),
    staleTime: 1000 * 60 * 60,
    enabled: enabled
  })
}

export function useUpdateBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BookUpdate }) => booksApi.updateBook(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Tersimpan!', { duration: 1500, id: 'auto-save-toast' }) // Tambahkan ID agar toast tidak menumpuk spam
    },
    onError: error => {
      toast.error(`Gagal menyimpan: ${error.message}`)
    }
  })
}

export function useAddBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: BookInsert) => booksApi.addBook(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Baris baru ditambahkan di paling atas!')
    },
    onError: error => {
      toast.error(`Gagal menambah baris: ${error.message}`)
    }
  })
}

// --- FUNGSI HAPUS BARIS ---
export function useDeleteBooks() {
  const queryClient = useQueryClient()

  return useMutation({
    // Asumsi: Anda memiliki fungsi deleteBook di booksApi.
    // Kita gunakan Promise.all agar bisa menghapus banyak baris sekaligus
    mutationFn: async (ids: string[]) => {
      const promises = ids.map(id => booksApi.deleteBook(id))
      await Promise.all(promises)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
    }
  })
}
