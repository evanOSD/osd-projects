// src/api/database/projects.ts

import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

export type ProjectRow = Database['public']['Tables']['projects']['Row']

export type ProjectWithRelations = ProjectRow & {
  organizations: { org_acronym: string | null } | null
  project_managers: (Database['public']['Tables']['project_managers']['Row'] & {
    users: { id: string; user_name: string | null } | null
  })[]
  project_languages: (Database['public']['Tables']['project_languages']['Row'] & {
    languages: { name_in_ethnologue: string | null } | null
    project_translation_goals: { id: string }[]
    project_yearly_capacity: { num_translators: number }[]
  })[]
  project_outcomes: { id: string }[]
}

export const projectsApi = {
  getAllProjects: async (): Promise<ProjectWithRelations[]> => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        organizations (
          org_acronym
        ),
        project_managers (
          *,
          users (
            id,
            user_name
          )
        ),
        project_languages (
          *,
          languages (
            name_in_ethnologue
          ),
          project_translation_goals (
            id
          ),
          project_yearly_capacity (
            num_translators
          )
        ),
        project_outcomes (
          id
        )
      `)
      .order('project_name', { ascending: true })

    if (error) throw new Error(error.message)
    return (data || []) as unknown as ProjectWithRelations[]
  }
}

