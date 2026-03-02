// src/api/database/books.ts

import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

export type BookRow = Database['public']['Tables']['books']['Row']
export type BookInsert = Database['public']['Tables']['books']['Insert']
export type BookUpdate = Database['public']['Tables']['books']['Update']

export interface GetBooksParams {
  pageIndex: number
  pageSize: number
  filters?: Record<string, string[]>
  sorting?: { id: string; desc: boolean }[]
}

export const booksApi = {
  getBooks: async ({ pageIndex, pageSize, filters = {}, sorting = [] }: GetBooksParams) => {
    const supabase = createClient()
    const from = pageIndex * pageSize
    const to = from + pageSize - 1

    let query = supabase.from('books').select('*').range(from, to)

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
    return data as BookRow[]
  },

  updateBook: async (id: string, payload: BookUpdate) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('books').update(payload).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return data as BookRow
  },

  addBook: async (payload: BookInsert) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('books').insert(payload).select().single()
    if (error) throw new Error(error.message)
    return data as BookRow
  },

  deleteBook: async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('books').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return true
  },

  getUniqueColumnValues: async (columnName: keyof BookRow) => {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('books')
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
