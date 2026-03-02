// src/api/users/users.ts

import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

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

    // MAGIC JOIN: Kita narik nama dari tabel users untuk kolom last_updated_by!
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

    // Trik meratakan data agar ColumnHelper Lapis 1 kita bisa langsung membacanya
    return data.map((row: any) => ({
      ...row,
      last_updated_by: row.updater?.user_name || row.last_updated_by
    })) as UserRow[]
  },

  updateUser: async (id: string, payload: UserUpdate) => {
    const supabase = createClient()
    
    // CEK KEAMANAN: Jika Admin mencoba mengubah email
    if (payload.email) {
      // Ambil data user saat ini untuk dicek
      const { data: currentUser } = await supabase.from('users').select('email, last_sign_in_at').eq('id', id).single()
      
      // Jika user sudah pernah login dan emailnya mau diubah ke email orang lain, TOLAK!
      if (currentUser && currentUser.last_sign_in_at !== null && currentUser.email !== payload.email) {
        throw new Error("Dilarang mengubah email User yang sudah pernah Login. Harap matikan User ini (Nonaktifkan) dan buat Baris Baru untuk staff pengganti.")
      }
    }

    const { data, error } = await supabase.from('users').update(payload).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return data as UserRow
  },

  addUser: async (payload: UserInsert) => {
    const supabase = createClient()
    const { id, ...cleanPayload } = payload as any
    const finalPayload = String(id).startsWith('temp-') ? cleanPayload : payload

    const { data, error } = await supabase.from('users').insert(finalPayload).select().single()
    if (error) throw new Error(error.message)
    return data as UserRow
  },

  deleteUser: async (id: string) => {
    const supabase = createClient()
    // Menghapus user di public.users akan gagal jika tidak dihapus dari auth.users via Admin API.
    // Tapi jika kamu mau izinkan hapus profile publik saja, biarkan kodenya begini.
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
