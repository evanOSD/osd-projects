// src/api/database/projectPlan.ts

import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

export type ProjectRow = Database['public']['Tables']['projects']['Row']
export type LanguageRow = Database['public']['Tables']['languages']['Row']
export type ProjectLanguageRow = Database['public']['Tables']['project_languages']['Row']

export type YearlyCapacityRow = Database['public']['Tables']['project_yearly_capacity']['Row']
export type YearlyCapacityInsert = Database['public']['Tables']['project_yearly_capacity']['Insert']
export type YearlyCapacityUpdate = Database['public']['Tables']['project_yearly_capacity']['Update']

export type OutcomeRow = Database['public']['Tables']['project_outcomes']['Row']
export type OutcomeInsert = Database['public']['Tables']['project_outcomes']['Insert']
export type OutcomeUpdate = Database['public']['Tables']['project_outcomes']['Update']

export type NonTranslationGoalRow = Database['public']['Tables']['project_non_translation_goals']['Row']
export type NonTranslationGoalInsert = Database['public']['Tables']['project_non_translation_goals']['Insert']
export type NonTranslationGoalUpdate = Database['public']['Tables']['project_non_translation_goals']['Update']

export type TranslationGoalRow = Database['public']['Tables']['project_translation_goals']['Row']
export type TranslationGoalInsert = Database['public']['Tables']['project_translation_goals']['Insert']
export type TranslationGoalUpdate = Database['public']['Tables']['project_translation_goals']['Update']

export type TranslationProgressRow = Database['public']['Tables']['project_translation_progress']['Row']
export type TranslationProgressUpdate = Database['public']['Tables']['project_translation_progress']['Update']

export type StepRow = Database['public']['Tables']['steps']['Row']

export type ActivityRow = Database['public']['Tables']['project_activities']['Row']
export type ActivityInsert = Database['public']['Tables']['project_activities']['Insert']
export type ActivityUpdate = Database['public']['Tables']['project_activities']['Update']

export type ProjectReportRow = Database['public']['Tables']['project_reports']['Row']
export type ProjectReportInsert = Database['public']['Tables']['project_reports']['Insert']
export type ProjectReportUpdate = Database['public']['Tables']['project_reports']['Update']

export const projectPlanApi = {
  // 1. PROJECT CONTEXT BY SHORT ID FETCHING
  getProjectContextByShortId: async (shortId: string) => {
    const supabase = createClient()

    // A. Dapatkan data Project
    const { data: project } = await supabase.from('projects').select('*').eq('short_id', shortId).maybeSingle()

    if (!project) {
      throw new Error(`Project dengan kode "${shortId}" tidak ditemukan di database.`)
    }

    // B. Dapatkan data Steps
    const { data: steps } = await supabase.from('steps').select('*').order('default_order')

    const { data: projectLanguage } = await supabase
      .from('project_languages')
      .select('*, languages(*)')
      .eq('project_id', project.id)
      .maybeSingle()

    const language = projectLanguage ? (projectLanguage as any).languages : null

    // D. Dapatkan daftar books
    const { data: books } = await supabase
      .from('books')
      .select('id, kitab, total_verses, chapter, pasal')
      .order('global_order')

    return {
      project,
      language: language || null,
      projectLanguage: projectLanguage || null,
      books: books || [],
      steps: steps || []
    }
  },

  // 1. PROJECT CONTEXT FETCHING
  getProjectContext: async (projectName: string) => {
    const supabase = createClient()

    // A. Dapatkan data Project
    const { data: project } = await supabase.from('projects').select('*').eq('project_name', projectName).maybeSingle()

    if (!project) {
      throw new Error(`Project "${projectName}" tidak ditemukan di database.`)
    }

    // B. Dapatkan data Steps
    const { data: steps } = await supabase.from('steps').select('*').order('default_order')

    // C. Dapatkan data Language
    // (Pencarian bahasa untuk sementara disederhanakan dengan asumsi project berhubungan dengan project_languages)
    // Akan di restrukturisasi nanti sesuai issue.md menggunakan short_id
    let langName = 'Ndom' // Fallback

    const { data: language } = await supabase
      .from('languages')
      .select('*')
      .eq('name_in_ethnologue', langName)
      .maybeSingle()

    let projectLanguage = null
    if (language) {
      const { data: pl } = await supabase
        .from('project_languages')
        .select('*')
        .eq('project_id', project.id)
        .eq('language_id', language.id)
        .maybeSingle()
      projectLanguage = pl
    }

    // D. Dapatkan daftar books
    const { data: books } = await supabase
      .from('books')
      .select('id, kitab, total_verses, chapter, pasal')
      .order('global_order')

    return {
      project,
      language: language || null,
      projectLanguage: projectLanguage || null,
      books: books || [],
      steps: steps || []
    }
  },

  // 2. YEARLY CAPACITY APIS
  getYearlyCapacity: async (projectLanguageId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('project_yearly_capacity')
      .select('*')
      .eq('project_language_id', projectLanguageId)
      .order('fiscal_year', { ascending: true })
    if (error) throw new Error(error.message)
    return data as YearlyCapacityRow[]
  },

  addYearlyCapacity: async (payload: YearlyCapacityInsert) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('project_yearly_capacity').insert(payload).select().single()
    if (error) throw new Error(error.message)
    return data as YearlyCapacityRow
  },

  updateYearlyCapacity: async (id: string, payload: YearlyCapacityUpdate) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('project_yearly_capacity')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as YearlyCapacityRow
  },

  deleteYearlyCapacity: async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('project_yearly_capacity').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return true
  },

  // 3. OUTCOMES APIS
  getOutcomes: async (projectId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('project_outcomes').select('*').eq('project_id', projectId)
    if (error) throw new Error(error.message)
    return data as OutcomeRow[]
  },

  addOutcome: async (payload: OutcomeInsert) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('project_outcomes').insert(payload).select().single()
    if (error) throw new Error(error.message)
    return data as OutcomeRow
  },

  updateOutcome: async (id: string, payload: OutcomeUpdate) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('project_outcomes').update(payload).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return data as OutcomeRow
  },

  deleteOutcome: async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('project_outcomes').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return true
  },

  // 4. NON-TRANSLATION GOALS APIS
  getNonTranslationGoals: async (projectId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('project_non_translation_goals')
      .select('*, project_outcomes(*), books(*)')
      .eq('project_id', projectId)
    if (error) throw new Error(error.message)
    return data as (NonTranslationGoalRow & { project_outcomes: OutcomeRow | null; books: any | null })[]
  },

  addNonTranslationGoal: async (payload: NonTranslationGoalInsert) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('project_non_translation_goals').insert(payload).select().single()
    if (error) throw new Error(error.message)
    return data as NonTranslationGoalRow
  },

  updateNonTranslationGoal: async (id: string, payload: NonTranslationGoalUpdate) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('project_non_translation_goals')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as NonTranslationGoalRow
  },

  deleteNonTranslationGoal: async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('project_non_translation_goals').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return true
  },

  // 5. TRANSLATION GOALS APIS & AUTO-INITIALIZATION OF PROGRESS
  getTranslationGoals: async (projectLanguageId: string) => {
    const supabase = createClient()
    // Ambil goal terjemahan dengan relasi ke book dan progress langkah
    const { data: goals, error } = await supabase
      .from('project_translation_goals')
      .select('*, books(*), project_translation_progress(*)')
      .eq('project_language_id', projectLanguageId)
    if (error) throw new Error(error.message)

    return goals as (TranslationGoalRow & {
      books: any | null
      project_translation_progress: TranslationProgressRow[]
    })[]
  },

  addTranslationGoal: async (payload: TranslationGoalInsert) => {
    const supabase = createClient()
    const { data: goal, error } = await supabase.from('project_translation_goals').insert(payload).select().single()
    if (error) throw new Error(error.message)

    // AUTO-INITIALIZE: Buat progress langkah untuk setiap step
    const { data: steps } = await supabase.from('steps').select('*').order('default_order')
    if (steps && steps.length > 0) {
      const progressPayloads = steps.map(step => ({
        translation_goal_id: goal.id,
        step_name: step.step_name,
        step_category: (step.step_category?.[0] as any) || 'translation',
        input_type: (step.input_type?.[0] as any) || 'date_picker',
        status: 'not_started' as const
      }))
      await supabase.from('project_translation_progress').insert(progressPayloads)
    }

    return goal as TranslationGoalRow
  },

  updateTranslationGoal: async (id: string, payload: TranslationGoalUpdate) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('project_translation_goals')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as TranslationGoalRow
  },

  deleteTranslationGoal: async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('project_translation_goals').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return true
  },

  // 6. TRANSLATION STEP PROGRESS UPDATES
  updateTranslationProgress: async (id: string, payload: TranslationProgressUpdate) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('project_translation_progress')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as TranslationProgressRow
  },

  // 7. ACTIVITIES APIS
  getActivities: async (projectId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('project_activities')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data as ActivityRow[]
  },

  addActivity: async (payload: ActivityInsert) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('project_activities').insert(payload).select().single()
    if (error) throw new Error(error.message)
    return data as ActivityRow
  },

  updateActivity: async (id: string, payload: ActivityUpdate) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('project_activities').update(payload).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return data as ActivityRow
  },

  deleteActivity: async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('project_activities').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return true
  },

  // 8. PROJECT REPORTS APIS
  getProjectReports: async (projectId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('project_reports')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data as ProjectReportRow[]
  },

  addProjectReport: async (payload: ProjectReportInsert) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('project_reports').insert(payload).select().single()
    if (error) throw new Error(error.message)
    return data as ProjectReportRow
  },

  updateProjectReport: async (id: string, payload: ProjectReportUpdate) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('project_reports').update(payload).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return data as ProjectReportRow
  },

  deleteProjectReport: async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('project_reports').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return true
  }
}
