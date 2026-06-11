// src/api/users/permissionsMatrix.ts

import { createClient } from '@/lib/supabase/client'
import { UserPermissions, generateDefaultPermissions } from './userSettings'

export interface PermissionMatrixRow {
  id: string
  user_name: string
  email: string
  role: string
  dashboard: string[]
  database: string[]
  users: string[]
  projects: string[]
  plan_progress: string[]
}

const mapToOptions = (perms: any) => {
  const options: string[] = []
  if (perms?.can_read) options.push('Read')
  if (perms?.can_create) options.push('Create')
  if (perms?.can_update) options.push('Update')
  if (perms?.can_delete) options.push('Delete')
  return options
}

export const permissionsMatrixApi = {
  getMatrix: async ({ pageIndex = 0, pageSize = 1000 }) => {
    const supabase = createClient()
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, user_name, email, role')
      .range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1)

    if (usersError) throw new Error(usersError.message)
    if (!users || users.length === 0) return []

    const userIds = users.map(u => u.id)
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('user_id, permissions')
      .in('user_id', userIds)

    if (settingsError) throw new Error(settingsError.message)

    return users.map(user => {
      const userSetting = settings?.find(s => s.user_id === user.id)
      const p = userSetting?.permissions || generateDefaultPermissions(user.role || 'Unknown')

      return {
        id: user.id,
        user_name: user.user_name || 'Tanpa Nama',
        email: user.email || 'Tanpa Email',
        role: user.role || 'Unknown',
        dashboard: mapToOptions(p?.dashboard),
        database: mapToOptions(p?.database),
        users: mapToOptions(p?.users),
        projects: mapToOptions(p?.projects),
        plan_progress: mapToOptions(p?.['plan-progress'])
      }
    })
  },

  updateMatrixRow: async (userId: string, payload: Partial<PermissionMatrixRow>) => {
    // ... (Kode updateMatrixRow tetap sama seperti sebelumnya) ...
    const supabase = createClient()
    let isRoleChanged = false
    let newRole = ''

    if (payload.role !== undefined) {
      const { error: roleError } = await supabase.from('users').update({ role: payload.role }).eq('id', userId)
      if (roleError) throw new Error(roleError.message)
      isRoleChanged = true
      newRole = payload.role
    }

    const { data: existing } = await supabase
      .from('user_settings')
      .select('permissions')
      .eq('user_id', userId)
      .maybeSingle()
    const currentPerms: UserPermissions = existing?.permissions || generateDefaultPermissions(newRole || 'Unknown')

    const applyOptions = (target: any, optionsArray: string[]) => {
      target.can_read = optionsArray.includes('Read')
      target.can_create = optionsArray.includes('Create')
      target.can_update = optionsArray.includes('Update')
      target.can_delete = optionsArray.includes('Delete')
    }

    if (isRoleChanged) {
      const defaults = generateDefaultPermissions(newRole)
      currentPerms.dashboard = { ...defaults.dashboard }
      currentPerms.database = { ...defaults.database }
      currentPerms.users = { ...defaults.users }
      currentPerms.projects = { ...defaults.projects }
      currentPerms['plan-progress'] = { ...defaults['plan-progress'] }
    }

    if (payload.dashboard !== undefined) applyOptions(currentPerms.dashboard, payload.dashboard)
    if (payload.database !== undefined) applyOptions(currentPerms.database, payload.database)
    if (payload.users !== undefined) applyOptions(currentPerms.users, payload.users)
    if (payload.projects !== undefined) applyOptions(currentPerms.projects, payload.projects)
    if (payload.plan_progress !== undefined) applyOptions(currentPerms['plan-progress'], payload.plan_progress)

    const { data, error } = await supabase
      .from('user_settings')
      .upsert(
        { user_id: userId, permissions: currentPerms, last_updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  // =======================================================================
  // FUNGSI BARU: VALIDASI KETAT SAAT NAMBAH BARIS DI TAB HAK AKSES
  // =======================================================================
  addMatrixRow: async (payload: Partial<PermissionMatrixRow>) => {
    const supabase = createClient()

    // 1. VALIDASI MUTLAK: Email dan Role (Persis seperti file users.ts)
    if (!payload.email || String(payload.email).trim() === '') {
      throw new Error("Gagal menyimpan baris baru: Kolom 'Email' wajib diisi.")
    }
    if (!payload.role || String(payload.role).trim() === '') {
      throw new Error("Gagal menyimpan baris baru: Kolom 'Role' wajib diisi.")
    }

    // 2. INSERT KE TABEL USERS
    // Kita pisahkan data khusus users dari payload array hak akses
    const { id, dashboard, database, users, projects, plan_progress, ...cleanUserPayload } = payload as any

    const finalUserPayload = {
      email: cleanUserPayload.email,
      role: cleanUserPayload.role,
      user_name: cleanUserPayload.user_name || null
    }

    const { data: newUser, error: userError } = await supabase.from('users').insert(finalUserPayload).select().single()

    if (userError) throw new Error(userError.message)

    // 3. GENERATE HAK AKSES DEFAULT
    const currentPerms: UserPermissions = generateDefaultPermissions(newUser.role)

    // 4. TIMPA DENGAN CHIP MANUAL JIKA ADMIN MENGISINYA SAAT TAMBAH BARIS
    const applyOptions = (target: any, optionsArray: string[]) => {
      target.can_read = optionsArray.includes('Read')
      target.can_create = optionsArray.includes('Create')
      target.can_update = optionsArray.includes('Update')
      target.can_delete = optionsArray.includes('Delete')
    }

    if (payload.dashboard) applyOptions(currentPerms.dashboard, payload.dashboard)
    if (payload.database) applyOptions(currentPerms.database, payload.database)
    if (payload.users) applyOptions(currentPerms.users, payload.users)
    if (payload.projects) applyOptions(currentPerms.projects, payload.projects)
    if (payload.plan_progress) applyOptions(currentPerms['plan-progress'], payload.plan_progress)

    // 5. INSERT KE TABEL USER_SETTINGS
    const { error: settingsError } = await supabase.from('user_settings').insert({
      user_id: newUser.id,
      permissions: currentPerms,
      last_updated_at: new Date().toISOString()
    })

    // Rollback jika gagal simpan setting
    if (settingsError) {
      await supabase.from('users').delete().eq('id', newUser.id)
      throw new Error(`Gagal menyimpan hak akses: ${settingsError.message}`)
    }

    return { ...payload, id: newUser.id }
  }
}
