// src/hooks/usePermissions.ts

import { useAuth } from '@/providers/AuthProvider'
import { useUserSettings } from '@/hooks/queries/users/useUserSettings'

export function usePermissions(menuId: string) {
  const { user } = useAuth()
  const { data: settings } = useUserSettings(user?.id)

  const role = user?.user_metadata?.role || user?.app_metadata?.role || 'Guest'
  // Jika user adalah Staff, secara default mereka punya semua akses (true),
  // KECUALI jika secara spesifik dicabut izinnya di database.
  const isStaff = role === 'Staff'
  const explicitPermissions = settings?.permissions?.[menuId]

  return {
    canRead: explicitPermissions?.can_read ?? (menuId === 'dashboard' ? true : isStaff),
    canCreate: explicitPermissions?.can_create ?? isStaff,
    canUpdate: explicitPermissions?.can_update ?? isStaff,
    canDelete: explicitPermissions?.can_delete ?? isStaff
  }
}
