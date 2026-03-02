// src/api/database/steps.ts

import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

export type StepRow = Database['public']['Tables']['steps']['Row']
export type StepInsert = Database['public']['Tables']['steps']['Insert']
export type StepUpdate = Database['public']['Tables']['steps']['Update']

export interface GetStepsParams {
  pageIndex: number
  pageSize: number
  filters?: Record<string, string[]>
  sorting?: { id: string; desc: boolean }[]
}

export const stepsApi = {
  getSteps: async ({ pageIndex, pageSize, filters = {}, sorting = [] }: GetStepsParams) => {
    const supabase = createClient()
    const from = pageIndex * pageSize
    const to = from + pageSize - 1

    let query = supabase.from('steps').select('*').range(from, to)

    Object.entries(filters).forEach(([column, values]) => {
      if (values && values.length > 0) {
        // Untuk array column, kita bisa menggunakan .contains atau .overlaps
        // Tapi untuk filter TanStack standar, kita pakai in() atau overlaps()
        query = query.overlaps(column, values)
      }
    })

    if (sorting.length > 0) {
      sorting.forEach(sort => {
        query = query.order(sort.id, { ascending: !sort.desc })
      })
    } else {
      query = query.order('default_order', { ascending: true })
    }

    const { data, error } = await query
    if (error) throw new Error(error.message)
    return data as StepRow[]
  },

  updateStep: async (id: string, payload: StepUpdate) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('steps').update(payload).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return data as StepRow
  },

  addStep: async (payload: StepInsert) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('steps').insert(payload).select().single()
    if (error) throw new Error(error.message)
    return data as StepRow
  },

  deleteStep: async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('steps').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return true
  },

  getUniqueColumnValues: async (columnName: keyof StepRow) => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('steps')
      .select(`${String(columnName)}, default_order`)
      .not(columnName as string, 'is', null)
      .order('default_order', { ascending: true })

    if (error) throw new Error(error.message)

    const uniqueValues = new Set<string>()

    data.forEach(row => {
      const val = (row as any)[columnName]
      if (Array.isArray(val)) {
        val.forEach(v => uniqueValues.add(String(v)))
      } else if (val !== null && val !== undefined && String(val).trim() !== '') {
        uniqueValues.add(String(val))
      }
    })

    return Array.from(uniqueValues)
  }
}
