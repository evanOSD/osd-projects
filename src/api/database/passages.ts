// src/api/database/passages.ts

import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

export type PassageRow = Database['public']['Tables']['passages']['Row']
export type PassageInsert = Database['public']['Tables']['passages']['Insert']
export type PassageUpdate = Database['public']['Tables']['passages']['Update']

export interface GetPassagesParams {
  pageIndex: number
  pageSize: number
  filters?: Record<string, string[]>
  sorting?: { id: string; desc: boolean }[]
}

export const passagesApi = {
  getPassages: async ({ pageIndex, pageSize, filters = {}, sorting = [] }: GetPassagesParams) => {
    const supabase = createClient()
    const from = pageIndex * pageSize
    const to = from + pageSize - 1

    let query = supabase.from('passages').select('*').range(from, to)

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
      query = query.order('global_order', { ascending: true })
    }

    const { data, error } = await query
    if (error) throw new Error(error.message)
    return data as PassageRow[]
  },

  updatePassage: async (id: string, payload: PassageUpdate) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('passages').update(payload).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return data as PassageRow
  },

  addPassage: async (payload: PassageInsert) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('passages').insert(payload).select().single()
    if (error) throw new Error(error.message)
    return data as PassageRow
  },

  deletePassage: async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('passages').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return true
  },

  getUniqueColumnValues: async (columnName: keyof PassageRow) => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('passages')
      .select(`${String(columnName)}, global_order`)
      .not(columnName as string, 'is', null)
      .order('global_order', { ascending: true })

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
