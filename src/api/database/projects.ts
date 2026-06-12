// src/api/database/projects.ts

import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

export type ProjectRow = Database['public']['Tables']['projects']['Row']

export type ProjectWithRelations = ProjectRow & {
  organizations: { org_acronym: string | null } | null
  project_members: (Database['public']['Tables']['project_members']['Row'] & {
    users: { id: string; user_name: string | null } | null
  })[]
  project_languages: (Database['public']['Tables']['project_languages']['Row'] & {
    languages: { name_in_ethnologue: string | null } | null
    project_translation_goals: { id: string }[]
  })[]
  project_plans: { number_of_translators: number; fiscal_year: number }[]
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
        project_members (
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
          )
        ),
        project_plans (
          number_of_translators,
          fiscal_year
        ),
        project_outcomes (
          id
        )
      `)
      .order('project_name', { ascending: true })

    if (error) throw new Error(error.message)
    return (data || []) as unknown as ProjectWithRelations[]
  },

  getProjectByShortId: async (shortId: string): Promise<ProjectWithRelations> => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        organizations (
          org_acronym
        ),
        project_members (
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
          )
        ),
        project_plans (
          number_of_translators,
          fiscal_year
        ),
        project_outcomes (
          id
        )
      `)
      .eq('short_id', shortId)
      .maybeSingle()

    if (error) throw new Error(error.message)
    if (!data) throw new Error(`Project dengan kode "${shortId}" tidak ditemukan`)
    return data as unknown as ProjectWithRelations
  },

  updateProject: async (id: string, payload: Partial<ProjectRow>): Promise<ProjectRow> => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  updateProjectLanguages: async (
    projectId: string,
    selections: { language_id: string; language_pseudonym: string | null }[]
  ): Promise<any> => {
    const supabase = createClient()

    // 1. Dapatkan relasi project-languages yang ada saat ini
    const { data: existing, error: getErr } = await supabase
      .from('project_languages')
      .select('id, language_id')
      .eq('project_id', projectId)

    if (getErr) throw new Error(getErr.message)

    const existingMap = new Map(existing?.map(x => [x.language_id, x.id]))

    // 2. Tentukan data yang harus dihapus, dimasukkan baru, atau diperbarui
    const selectedIds = new Set(selections.map(s => s.language_id))
    const idsToDelete = existing
      ?.filter(x => !selectedIds.has(x.language_id))
      .map(x => x.id) || []

    const toInsert = selections
      .filter(s => !existingMap.has(s.language_id))
      .map(s => ({
        project_id: projectId,
        language_id: s.language_id,
        language_pseudonym: s.language_pseudonym
      }))

    const toUpdate = selections
      .filter(s => existingMap.has(s.language_id))
      .map(s => ({
        id: existingMap.get(s.language_id)!,
        project_id: projectId,
        language_id: s.language_id,
        language_pseudonym: s.language_pseudonym
      }))

    // 3. Eksekusi Hapus (Delete)
    if (idsToDelete.length > 0) {
      const { error: delErr } = await supabase
        .from('project_languages')
        .delete()
        .in('id', idsToDelete)
      if (delErr) throw new Error(delErr.message)
    }

    // 4. Eksekusi Tambah (Insert)
    if (toInsert.length > 0) {
      const { error: insErr } = await supabase
        .from('project_languages')
        .insert(toInsert)
      if (insErr) throw new Error(insErr.message)
    }

    // 5. Eksekusi Perbarui (Update)
    for (const item of toUpdate) {
      const { error: updErr } = await supabase
        .from('project_languages')
        .update({ language_pseudonym: item.language_pseudonym })
        .eq('id', item.id)
      if (updErr) throw new Error(updErr.message)
    }

    return true
  },

  getAllOrganizations: async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('organizations')
      .select('id, org_name, org_acronym')
      .order('org_acronym', { ascending: true })
    if (error) throw new Error(error.message)
    return data
  },

  updateProjectMembers: async (
    projectId: string,
    role: Database['public']['Enums']['project_role'],
    userIds: string[]
  ): Promise<any> => {
    const supabase = createClient()

    // 1. Delete all existing members with the specific role for the project
    const { error: delErr } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('role', role)

    if (delErr) throw new Error(delErr.message)

    // 2. Insert new members
    if (userIds.length > 0) {
      const inserts = userIds.map(uid => ({
        project_id: projectId,
        user_id: uid,
        role: role
      }))
      const { error: insErr } = await supabase
        .from('project_members')
        .insert(inserts)
      if (insErr) throw new Error(insErr.message)
    }

    return true
  }
}

