// src/api/users/userSettings.ts

import { createClient } from '@/lib/supabase/client'

export interface UserPermissions {
  [menuId: string]: {
    can_read: boolean
    can_create: boolean
    can_update: boolean
    can_delete: boolean
  }
}

export interface UserSettingsRow {
  id?: string
  user_id: string
  permissions: UserPermissions
  hidden_menus: string[]
  last_updated_at: string
  last_updated_by: string | null
}

// ==========================================================
// KAMUS DEFAULT HAK AKSES (SINGLE SOURCE OF TRUTH)
// Akan dipanggil oleh userSettings, permissionsMatrix, dan users API
// ==========================================================
export const generateDefaultPermissions = (role: string): UserPermissions => {
  const FULL = { can_read: true, can_create: true, can_update: true, can_delete: true }
  const READ_WRITE = { can_read: true, can_create: true, can_update: true, can_delete: false } // Create & Update, no delete
  const READ_ONLY = { can_read: true, can_create: false, can_update: false, can_delete: false }
  const NONE = { can_read: false, can_create: false, can_update: false, can_delete: false }

  switch (role) {
    case 'Staff':
      return { dashboard: FULL, database: FULL, users: FULL, projects: FULL, 'plan-progress': FULL }
    case 'Facilitator':
    case 'MTT':
      return {
        dashboard: READ_ONLY,
        database: READ_WRITE,
        users: NONE,
        projects: READ_WRITE,
        'plan-progress': READ_WRITE
      }
    case 'Consultant':
    case 'Guest':
      return {
        dashboard: READ_ONLY,
        database: READ_ONLY,
        users: NONE,
        projects: READ_ONLY,
        'plan-progress': READ_ONLY
      }
    default:
      // Unknown / Karantina
      return { dashboard: NONE, database: NONE, users: NONE, projects: NONE, 'plan-progress': NONE }
  }
}

export const userSettingsApi = {
  getSettings: async (userId: string) => {
    const supabase = createClient()

    const { data: existingSettings, error: fetchError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (fetchError) throw new Error(fetchError.message)
    if (existingSettings) return existingSettings as UserSettingsRow

    // JIKA TIDAK ADA: Generate pakai Kamus Pusat
    const { data: userData } = await supabase.from('users').select('role').eq('id', userId).maybeSingle()
    const actualRole = userData?.role || 'Unknown'

    const newSettings = {
      user_id: userId,
      permissions: generateDefaultPermissions(actualRole),
      hidden_menus: [],
      last_updated_at: new Date().toISOString()
    }

    const { data: insertedSettings, error: insertError } = await supabase
      .from('user_settings')
      .insert(newSettings)
      .select()
      .single()

    if (insertError) throw new Error(insertError.message)
    return insertedSettings as UserSettingsRow
  },

  updatePermissions: async (userId: string, permissions: UserPermissions, adminId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: userId,
          permissions: permissions,
          last_updated_at: new Date().toISOString(),
          last_updated_by: adminId
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  updateHiddenMenus: async (userId: string, hiddenMenus: string[]) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: userId,
          hidden_menus: hiddenMenus,
          last_updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }
}
