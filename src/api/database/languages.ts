// src/api/database/languages.ts

import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

export type LanguageRow = Database['public']['Tables']['languages']['Row']
export type LanguageInsert = Database['public']['Tables']['languages']['Insert']
export type LanguageUpdate = Database['public']['Tables']['languages']['Update']

export interface GetLanguagesParams {
  pageIndex: number
  pageSize: number
  filters?: Record<string, string[]>
  sorting?: { id: string; desc: boolean }[]
}

export const languagesApi = {
  getLanguages: async ({ pageIndex, pageSize, filters = {}, sorting = [] }: GetLanguagesParams) => {
    const supabase = createClient()
    const from = pageIndex * pageSize
    const to = from + pageSize - 1

    let query = supabase.from('languages').select('*').range(from, to)

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
      // DEFAULT SORTING: name_with_code
      query = query.order('name_with_code', { ascending: true })
    }

    const { data, error } = await query
    if (error) throw new Error(error.message)
    return data as LanguageRow[]
  },

  updateLanguage: async (id: string, payload: LanguageUpdate) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('languages').update(payload).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return data as LanguageRow
  },

  addLanguage: async (payload: LanguageInsert) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('languages').insert(payload).select().single()
    if (error) throw new Error(error.message)
    return data as LanguageRow
  },

  deleteLanguage: async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('languages').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return true
  },

  getUniqueColumnValues: async (columnName: keyof LanguageRow) => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('languages')
      .select(`${String(columnName)}, name_with_code`)
      .not(columnName as string, 'is', null)
      .order('name_with_code', { ascending: true })

    if (error) throw new Error(error.message)

    const uniqueValues = new Set<string>()

    data.forEach(row => {
      const val = (row as any)[columnName]
      if (val !== null && val !== undefined && String(val).trim() !== '') {
        uniqueValues.add(String(val))
      }
    })

    return Array.from(uniqueValues)
  },

  getAllLanguages: async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('languages')
      .select('*')
      .order('name_in_ethnologue', { ascending: true })
    if (error) throw new Error(error.message)
    return data as LanguageRow[]
  }
}
