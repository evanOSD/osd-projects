// src/hooks/queries/users/useUserSettings.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userSettingsApi, UserPermissions } from '@/api/users/userSettings'
import toast from 'react-hot-toast'

export function useUserSettings(userId: string | undefined) {
  return useQuery({
    queryKey: ['user-settings', userId],
    queryFn: () => userSettingsApi.getSettings(userId!),
    enabled: !!userId // Query hanya menembak ke Supabase kalau userId sudah tersedia
  })
}

export function useUpdatePermissions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, permissions, adminId }: { userId: string; permissions: UserPermissions; adminId: string }) =>
      userSettingsApi.updatePermissions(userId, permissions, adminId),
    onSuccess: (_, variables) => {
      // Invalidate cache agar UI langsung refresh otomatis tanpa perlu F5
      queryClient.invalidateQueries({ queryKey: ['user-settings', variables.userId] })
      toast.success('Hak akses berhasil diperbarui!')
    }
    // Catatan: Jika error, otomatis ditangkap oleh Global MutationCache yang sudah kamu buat sebelumnya
  })
}

export function useUpdateHiddenMenus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, hiddenMenus }: { userId: string; hiddenMenus: string[] }) =>
      userSettingsApi.updateHiddenMenus(userId, hiddenMenus),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-settings', variables.userId] })
      toast.success('Tampilan menu diperbarui!')
    }
  })
}
