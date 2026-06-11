// src/api/users/users.ts

import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'
import { permissionsMatrixApi } from './permissionsMatrix'

export type UserRow = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export interface GetUsersParams {
  pageIndex: number
  pageSize: number
  filters?: Record<string, string[]>
  sorting?: { id: string; desc: boolean }[]
}

export const usersApi = {
  getUsers: async ({ pageIndex, pageSize, filters = {}, sorting = [] }: GetUsersParams) => {
    const supabase = createClient()
    const from = pageIndex * pageSize
    const to = from + pageSize - 1

    let query = supabase.from('users').select('*, updater:users!last_updated_by(user_name)').range(from, to)

    Object.entries(filters).forEach(([column, values]) => {
      if (values && values.length > 0) {
        query = query.in(column, values)
      }
    })

    if (sorting.length > 0) {
      sorting.forEach(sort => {
        query = query.order(sort.id, { ascending: !sort.desc })
      })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query
    if (error) throw new Error(error.message)

    return data.map((row: any) => ({
      ...row,
      last_updated_by: row.updater?.user_name || row.last_updated_by
    })) as UserRow[]
  },

  updateUser: async (id: string, payload: UserUpdate) => {
    const supabase = createClient()

    if (payload.email !== undefined && (!payload.email || String(payload.email).trim() === '')) {
      throw new Error('Kolom Email tidak boleh dikosongkan.')
    }
    if (payload.role !== undefined && (!payload.role || String(payload.role).trim() === '')) {
      throw new Error('Kolom Role tidak boleh dikosongkan.')
    }

    if (payload.email) {
      const { data: currentUser } = await supabase.from('users').select('email, last_sign_in_at').eq('id', id).single()
      if (currentUser && currentUser.last_sign_in_at !== null && currentUser.email !== payload.email) {
        throw new Error(
          'Dilarang mengubah email User yang sudah pernah Login. Jika anda ingin mengubah email, harap matikan User ini (Nonaktifkan) dan buat Baris Baru untuk staff/user pengganti.'
        )
      }
    }

    const { data, error } = await supabase.from('users').update(payload).eq('id', id).select().single()
    if (error) throw new Error(error.message)

    // SINKRONISASI HAK AKSES SAAT UPDATE
    if (payload.role !== undefined) {
      try {
        await permissionsMatrixApi.updateMatrixRow(id, { role: payload.role })
      } catch (matrixError: any) {
        console.error('Gagal sinkronisasi hak akses:', matrixError)
        throw new Error(`Role berhasil diubah, tapi gagal memperbarui Hak Akses otomatis: ${matrixError.message}`)
      }
    }

    return data as UserRow
  },

  addUser: async (payload: UserInsert) => {
    const supabase = createClient()
    const { id, ...cleanPayload } = payload as any

    if (!cleanPayload.email || String(cleanPayload.email).trim() === '') {
      throw new Error("Gagal menyimpan baris baru: Kolom 'Email' wajib diisi.")
    }
    if (!cleanPayload.role || String(cleanPayload.role).trim() === '') {
      throw new Error("Gagal menyimpan baris baru: Kolom 'Role' wajib diisi.")
    }

    const finalPayload = String(id).startsWith('temp-') ? cleanPayload : payload

    const { data, error } = await supabase.from('users').insert(finalPayload).select().single()
    if (error) throw new Error(error.message)

    // =================================================================
    // SINKRONISASI HAK AKSES SAAT CREATE (BARU DITAMBAHKAN)
    // =================================================================
    try {
      // Ini akan memaksa pembuatan baris di tabel user_settings dengan nilai default
      await permissionsMatrixApi.updateMatrixRow(data.id, { role: data.role })
    } catch (matrixError: any) {
      console.error('Gagal membuat hak akses awal:', matrixError)
    }

    return data as UserRow
  },

  deleteUser: async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('users').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return true
  },

  getUniqueColumnValues: async (columnName: keyof UserRow) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('users')
      .select(`${String(columnName)}`)
      .not(columnName as string, 'is', null)
      .limit(1000)

    if (error) throw new Error(error.message)
    const uniqueValues = new Set<string>()
    data.forEach(row => {
      const val = (row as any)[columnName]
      if (val !== null && val !== undefined && String(val).trim() !== '') {
        uniqueValues.add(String(val))
      }
    })
    return Array.from(uniqueValues)
  }
}
