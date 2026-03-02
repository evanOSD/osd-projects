// src/api/database/stories.ts

import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

export type StoryRow = Database['public']['Tables']['stories']['Row']
export type StoryInsert = Database['public']['Tables']['stories']['Insert']
export type StoryUpdate = Database['public']['Tables']['stories']['Update']

export interface GetStoriesParams {
  pageIndex: number
  pageSize: number
  filters?: Record<string, string[]>
  sorting?: { id: string; desc: boolean }[]
}

export const storiesApi = {
  getStories: async ({ pageIndex, pageSize, filters = {}, sorting = [] }: GetStoriesParams) => {
    const supabase = createClient()
    const from = pageIndex * pageSize
    const to = from + pageSize - 1

    let query = supabase.from('stories').select('*').range(from, to)

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
    return data as StoryRow[]
  },

  updateStory: async (id: string, payload: StoryUpdate) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('stories').update(payload).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return data as StoryRow
  },

  addStory: async (payload: StoryInsert) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('stories').insert(payload).select().single()
    if (error) throw new Error(error.message)
    return data as StoryRow
  },

  deleteStory: async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('stories').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return true
  },

  getUniqueColumnValues: async (columnName: keyof StoryRow) => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('stories')
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
