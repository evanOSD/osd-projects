export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      books: {
        Row: {
          book: string | null
          book_order: string | null
          category: string | null
          chapter: number | null
          global_order: number
          id: string
          kitab: string | null
          last_updated_at: string | null
          last_updated_by: string | null
          pasal: number | null
          scripture_id: string
          total_verses: number | null
        }
        Insert: {
          book?: string | null
          book_order?: string | null
          category?: string | null
          chapter?: number | null
          global_order: number
          id?: string
          kitab?: string | null
          last_updated_at?: string | null
          last_updated_by?: string | null
          pasal?: number | null
          scripture_id: string
          total_verses?: number | null
        }
        Update: {
          book?: string | null
          book_order?: string | null
          category?: string | null
          chapter?: number | null
          global_order?: number
          id?: string
          kitab?: string | null
          last_updated_at?: string | null
          last_updated_by?: string | null
          pasal?: number | null
          scripture_id?: string
          total_verses?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "books_last_updated_by_fkey"
            columns: ["last_updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      languages: {
        Row: {
          aag_status: string | null
          aag_target: string | null
          alternate_names: string | null
          communities_dialects_subgroups_diaspora: string | null
          completed_scripture_products: string | null
          geographical_access: string | null
          global_egids: string | null
          id: string
          is_v2025: boolean | null
          iso_code: string | null
          last_updated_at: string | null
          last_updated_by: string | null
          name_in_ethnologue: string | null
          name_in_rev79: string | null
          name_with_code: string | null
          population: string | null
          primary_country: string | null
          province: string | null
          pseudonym: string | null
          reached_status_joshua_project: string | null
          sociocultural_access: string | null
          total_population_ethnologue: number | null
        }
        Insert: {
          aag_status?: string | null
          aag_target?: string | null
          alternate_names?: string | null
          communities_dialects_subgroups_diaspora?: string | null
          completed_scripture_products?: string | null
          geographical_access?: string | null
          global_egids?: string | null
          id?: string
          is_v2025?: boolean | null
          iso_code?: string | null
          last_updated_at?: string | null
          last_updated_by?: string | null
          name_in_ethnologue?: string | null
          name_in_rev79?: string | null
          name_with_code?: string | null
          population?: string | null
          primary_country?: string | null
          province?: string | null
          pseudonym?: string | null
          reached_status_joshua_project?: string | null
          sociocultural_access?: string | null
          total_population_ethnologue?: number | null
        }
        Update: {
          aag_status?: string | null
          aag_target?: string | null
          alternate_names?: string | null
          communities_dialects_subgroups_diaspora?: string | null
          completed_scripture_products?: string | null
          geographical_access?: string | null
          global_egids?: string | null
          id?: string
          is_v2025?: boolean | null
          iso_code?: string | null
          last_updated_at?: string | null
          last_updated_by?: string | null
          name_in_ethnologue?: string | null
          name_in_rev79?: string | null
          name_with_code?: string | null
          population?: string | null
          primary_country?: string | null
          province?: string | null
          pseudonym?: string | null
          reached_status_joshua_project?: string | null
          sociocultural_access?: string | null
          total_population_ethnologue?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "languages_last_updated_by_fkey"
            columns: ["last_updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          country: string | null
          created_at: string
          id: string
          last_updated_at: string | null
          last_updated_by: string | null
          org_acronym: string | null
          org_description: string | null
          org_logo: string | null
          org_name: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          last_updated_at?: string | null
          last_updated_by?: string | null
          org_acronym?: string | null
          org_description?: string | null
          org_logo?: string | null
          org_name: string
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          last_updated_at?: string | null
          last_updated_by?: string | null
          org_acronym?: string | null
          org_description?: string | null
          org_logo?: string | null
          org_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_last_updated_by_fkey"
            columns: ["last_updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      passages: {
        Row: {
          book: string | null
          book_order: string | null
          category: string | null
          dasar_perikop: string | null
          global_order: number | null
          id: string
          judul_perikop: string | null
          kitab: string | null
          last_updated_at: string | null
          last_updated_by: string | null
          organization_id: string | null
          passage_reference: string | null
          passage_title: string | null
          total_verses: number | null
          verse_mapping: Json | null
        }
        Insert: {
          book?: string | null
          book_order?: string | null
          category?: string | null
          dasar_perikop?: string | null
          global_order?: number | null
          id?: string
          judul_perikop?: string | null
          kitab?: string | null
          last_updated_at?: string | null
          last_updated_by?: string | null
          organization_id?: string | null
          passage_reference?: string | null
          passage_title?: string | null
          total_verses?: number | null
          verse_mapping?: Json | null
        }
        Update: {
          book?: string | null
          book_order?: string | null
          category?: string | null
          dasar_perikop?: string | null
          global_order?: number | null
          id?: string
          judul_perikop?: string | null
          kitab?: string | null
          last_updated_at?: string | null
          last_updated_by?: string | null
          organization_id?: string | null
          passage_reference?: string | null
          passage_title?: string | null
          total_verses?: number | null
          verse_mapping?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "passages_last_updated_by_fkey"
            columns: ["last_updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "passages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      project_activities: {
        Row: {
          activity_name: string
          created_at: string
          goal_type: string | null
          id: string
          planned_end_date: string | null
          planned_start_date: string | null
          planned_team_days: number | null
          progress_notes: string | null
          project_id: string
          project_language_id: string | null
          status: Database["public"]["Enums"]["completion_status"] | null
        }
        Insert: {
          activity_name: string
          created_at?: string
          goal_type?: string | null
          id?: string
          planned_end_date?: string | null
          planned_start_date?: string | null
          planned_team_days?: number | null
          progress_notes?: string | null
          project_id: string
          project_language_id?: string | null
          status?: Database["public"]["Enums"]["completion_status"] | null
        }
        Update: {
          activity_name?: string
          created_at?: string
          goal_type?: string | null
          id?: string
          planned_end_date?: string | null
          planned_start_date?: string | null
          planned_team_days?: number | null
          progress_notes?: string | null
          project_id?: string
          project_language_id?: string | null
          status?: Database["public"]["Enums"]["completion_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "project_activities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_impacts: {
        Row: {
          created_at: string
          file: string | null
          id: string
          impact_story_description: string
          project_id: string
          project_language_id: string | null
          submit_date: string | null
        }
        Insert: {
          created_at?: string
          file?: string | null
          id?: string
          impact_story_description: string
          project_id: string
          project_language_id?: string | null
          submit_date?: string | null
        }
        Update: {
          created_at?: string
          file?: string | null
          id?: string
          impact_story_description?: string
          project_id?: string
          project_language_id?: string | null
          submit_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_impacts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_impacts_project_language_id_fkey"
            columns: ["project_language_id"]
            isOneToOne: false
            referencedRelation: "project_languages"
            referencedColumns: ["id"]
          },
        ]
      }
      project_languages: {
        Row: {
          created_at: string
          facilitator: string | null
          id: string
          language_id: string
          language_pseudonym: string | null
          project_id: string
          sub_cluster: string | null
        }
        Insert: {
          created_at?: string
          facilitator?: string | null
          id?: string
          language_id: string
          language_pseudonym?: string | null
          project_id: string
          sub_cluster?: string | null
        }
        Update: {
          created_at?: string
          facilitator?: string | null
          id?: string
          language_id?: string
          language_pseudonym?: string | null
          project_id?: string
          sub_cluster?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_languages_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_languages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          created_at: string | null
          id: string
          project_id: string | null
          role: Database["public"]["Enums"]["project_role"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          role: Database["public"]["Enums"]["project_role"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          role?: Database["public"]["Enums"]["project_role"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_non_translation_goals: {
        Row: {
          achievement_indicator: string | null
          book_id: string | null
          created_at: string
          id: string
          measurement_method: string | null
          measurement_unit: string | null
          output_goal_name: string
          planned_date: string | null
          product_form: string | null
          project_id: string
          project_language_id: string | null
          project_outcome_id: string | null
          target_quantity: number | null
        }
        Insert: {
          achievement_indicator?: string | null
          book_id?: string | null
          created_at?: string
          id?: string
          measurement_method?: string | null
          measurement_unit?: string | null
          output_goal_name: string
          planned_date?: string | null
          product_form?: string | null
          project_id: string
          project_language_id?: string | null
          project_outcome_id?: string | null
          target_quantity?: number | null
        }
        Update: {
          achievement_indicator?: string | null
          book_id?: string | null
          created_at?: string
          id?: string
          measurement_method?: string | null
          measurement_unit?: string | null
          output_goal_name?: string
          planned_date?: string | null
          product_form?: string | null
          project_id?: string
          project_language_id?: string | null
          project_outcome_id?: string | null
          target_quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_non_translation_goals_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_non_translation_goals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_non_translation_goals_project_language_id_fkey"
            columns: ["project_language_id"]
            isOneToOne: false
            referencedRelation: "project_languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_non_translation_goals_project_outcome_id_fkey"
            columns: ["project_outcome_id"]
            isOneToOne: false
            referencedRelation: "project_outcomes"
            referencedColumns: ["id"]
          },
        ]
      }
      project_outcomes: {
        Row: {
          created_at: string
          id: string
          indicator_of_change: string | null
          measurement_method: string | null
          outcome_name: string
          project_id: string
          project_language_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          indicator_of_change?: string | null
          measurement_method?: string | null
          outcome_name: string
          project_id: string
          project_language_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          indicator_of_change?: string | null
          measurement_method?: string | null
          outcome_name?: string
          project_id?: string
          project_language_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_outcomes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_outcomes_project_language_id_fkey"
            columns: ["project_language_id"]
            isOneToOne: false
            referencedRelation: "project_languages"
            referencedColumns: ["id"]
          },
        ]
      }
      project_reports: {
        Row: {
          created_at: string
          id: string
          narrative_notes: string | null
          progress_snapshot_data: Json | null
          project_id: string
          project_language_id: string | null
          report_name: string
          report_period_end_date: string | null
          report_period_start_date: string | null
          report_status: string | null
          sec_01_report_writer: Json | null
          sec_02_outcomes_progress_comparison: Json | null
          sec_03_project_impact_on_local_church: string | null
          sec_04_project_impact_stories: string | null
          sec_05_additional_interesting_developments: string | null
          sec_06_project_related_lessons: string | null
          sec_07_project_lessons_related_other_org: string | null
          sec_08_project_outcomes_change_why: string | null
          sec_09_partners_involved_in_project: Json | null
          sec_10_local_national_changes_affected_project: string | null
          sec_11_project_challenges: string | null
          sec_12_finance_spends: string | null
          sec_13_photos: Json | null
          sec_14_other_publications: Json | null
          sec_15_any_documentation_report: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          narrative_notes?: string | null
          progress_snapshot_data?: Json | null
          project_id: string
          project_language_id?: string | null
          report_name: string
          report_period_end_date?: string | null
          report_period_start_date?: string | null
          report_status?: string | null
          sec_01_report_writer?: Json | null
          sec_02_outcomes_progress_comparison?: Json | null
          sec_03_project_impact_on_local_church?: string | null
          sec_04_project_impact_stories?: string | null
          sec_05_additional_interesting_developments?: string | null
          sec_06_project_related_lessons?: string | null
          sec_07_project_lessons_related_other_org?: string | null
          sec_08_project_outcomes_change_why?: string | null
          sec_09_partners_involved_in_project?: Json | null
          sec_10_local_national_changes_affected_project?: string | null
          sec_11_project_challenges?: string | null
          sec_12_finance_spends?: string | null
          sec_13_photos?: Json | null
          sec_14_other_publications?: Json | null
          sec_15_any_documentation_report?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          narrative_notes?: string | null
          progress_snapshot_data?: Json | null
          project_id?: string
          project_language_id?: string | null
          report_name?: string
          report_period_end_date?: string | null
          report_period_start_date?: string | null
          report_status?: string | null
          sec_01_report_writer?: Json | null
          sec_02_outcomes_progress_comparison?: Json | null
          sec_03_project_impact_on_local_church?: string | null
          sec_04_project_impact_stories?: string | null
          sec_05_additional_interesting_developments?: string | null
          sec_06_project_related_lessons?: string | null
          sec_07_project_lessons_related_other_org?: string | null
          sec_08_project_outcomes_change_why?: string | null
          sec_09_partners_involved_in_project?: Json | null
          sec_10_local_national_changes_affected_project?: string | null
          sec_11_project_challenges?: string | null
          sec_12_finance_spends?: string | null
          sec_13_photos?: Json | null
          sec_14_other_publications?: Json | null
          sec_15_any_documentation_report?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "project_reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_reports_project_language_id_fkey"
            columns: ["project_language_id"]
            isOneToOne: false
            referencedRelation: "project_languages"
            referencedColumns: ["id"]
          },
        ]
      }
      project_translation_goals: {
        Row: {
          books_id: string | null
          created_at: string
          difficulty: number | null
          id: string
          notes: string | null
          passages_id: string | null
          planned_verses_count: number | null
          project_language_id: string
          stories_id: string | null
        }
        Insert: {
          books_id?: string | null
          created_at?: string
          difficulty?: number | null
          id?: string
          notes?: string | null
          passages_id?: string | null
          planned_verses_count?: number | null
          project_language_id: string
          stories_id?: string | null
        }
        Update: {
          books_id?: string | null
          created_at?: string
          difficulty?: number | null
          id?: string
          notes?: string | null
          passages_id?: string | null
          planned_verses_count?: number | null
          project_language_id?: string
          stories_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_translation_goals_books_id_fkey"
            columns: ["books_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_translation_goals_passages_id_fkey"
            columns: ["passages_id"]
            isOneToOne: false
            referencedRelation: "passages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_translation_goals_project_language_id_fkey"
            columns: ["project_language_id"]
            isOneToOne: false
            referencedRelation: "project_languages"
            referencedColumns: ["id"]
          },
        ]
      }
      project_translation_progress: {
        Row: {
          created_at: string
          id: string
          input_type: Database["public"]["Enums"]["step_input_type"] | null
          notes: string | null
          planned_end_date: string | null
          planned_start_date: string | null
          progress_data: Json | null
          status: Database["public"]["Enums"]["completion_status"] | null
          step_category: Database["public"]["Enums"]["step_category"] | null
          step_name: string
          translation_goal_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          input_type?: Database["public"]["Enums"]["step_input_type"] | null
          notes?: string | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          progress_data?: Json | null
          status?: Database["public"]["Enums"]["completion_status"] | null
          step_category?: Database["public"]["Enums"]["step_category"] | null
          step_name: string
          translation_goal_id: string
        }
        Update: {
          created_at?: string
          id?: string
          input_type?: Database["public"]["Enums"]["step_input_type"] | null
          notes?: string | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          progress_data?: Json | null
          status?: Database["public"]["Enums"]["completion_status"] | null
          step_category?: Database["public"]["Enums"]["step_category"] | null
          step_name?: string
          translation_goal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_translation_progress_translation_goal_id_fkey"
            columns: ["translation_goal_id"]
            isOneToOne: false
            referencedRelation: "project_translation_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      project_yearly_capacity: {
        Row: {
          created_at: string
          fiscal_year: number
          id: string
          num_translators: number
          project_language_id: string
          team_verses_per_day: number
          work_days_per_year: number
        }
        Insert: {
          created_at?: string
          fiscal_year: number
          id?: string
          num_translators?: number
          project_language_id: string
          team_verses_per_day?: number
          work_days_per_year?: number
        }
        Update: {
          created_at?: string
          fiscal_year?: number
          id?: string
          num_translators?: number
          project_language_id?: string
          team_verses_per_day?: number
          work_days_per_year?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_yearly_capacity_project_language_id_fkey"
            columns: ["project_language_id"]
            isOneToOne: false
            referencedRelation: "project_languages"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          id: string
          organization_id: string | null
          project_description: string | null
          project_end_date: string | null
          project_name: string
          project_start_date: string | null
          project_status:
            | Database["public"]["Enums"]["completion_status"]
            | null
          project_type: Database["public"]["Enums"]["project_type"] | null
          sensitivity: Database["public"]["Enums"]["project_sensitivity"] | null
          short_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id?: string | null
          project_description?: string | null
          project_end_date?: string | null
          project_name: string
          project_start_date?: string | null
          project_status?:
            | Database["public"]["Enums"]["completion_status"]
            | null
          project_type?: Database["public"]["Enums"]["project_type"] | null
          sensitivity?:
            | Database["public"]["Enums"]["project_sensitivity"]
            | null
          short_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string | null
          project_description?: string | null
          project_end_date?: string | null
          project_name?: string
          project_start_date?: string | null
          project_status?:
            | Database["public"]["Enums"]["completion_status"]
            | null
          project_type?: Database["public"]["Enums"]["project_type"] | null
          sensitivity?:
            | Database["public"]["Enums"]["project_sensitivity"]
            | null
          short_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      steps: {
        Row: {
          default_order: number | null
          id: string
          input_type: string[] | null
          last_updated_at: string | null
          last_updated_by: string | null
          step_category: string[] | null
          step_description: string | null
          step_name: string
          weight_percentage: number | null
        }
        Insert: {
          default_order?: number | null
          id?: string
          input_type?: string[] | null
          last_updated_at?: string | null
          last_updated_by?: string | null
          step_category?: string[] | null
          step_description?: string | null
          step_name: string
          weight_percentage?: number | null
        }
        Update: {
          default_order?: number | null
          id?: string
          input_type?: string[] | null
          last_updated_at?: string | null
          last_updated_by?: string | null
          step_category?: string[] | null
          step_description?: string | null
          step_name?: string
          weight_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "steps_last_updated_by_fkey"
            columns: ["last_updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          book_reference: string | null
          created_at: string
          dasar_perikop: string | null
          global_order: number
          id: string
          judul_cerita: string | null
          last_updated_at: string | null
          last_updated_by: string | null
          scripture_ref_id: string
          story_category: string | null
          story_title: string | null
          verse_mapping: Json | null
        }
        Insert: {
          book_reference?: string | null
          created_at?: string
          dasar_perikop?: string | null
          global_order: number
          id?: string
          judul_cerita?: string | null
          last_updated_at?: string | null
          last_updated_by?: string | null
          scripture_ref_id: string
          story_category?: string | null
          story_title?: string | null
          verse_mapping?: Json | null
        }
        Update: {
          book_reference?: string | null
          created_at?: string
          dasar_perikop?: string | null
          global_order?: number
          id?: string
          judul_cerita?: string | null
          last_updated_at?: string | null
          last_updated_by?: string | null
          scripture_ref_id?: string
          story_category?: string | null
          story_title?: string | null
          verse_mapping?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_last_updated_by_fkey"
            columns: ["last_updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          hidden_menus: string[] | null
          id: string
          last_updated_at: string | null
          last_updated_by: string | null
          permissions: Json | null
          user_id: string
        }
        Insert: {
          hidden_menus?: string[] | null
          id?: string
          last_updated_at?: string | null
          last_updated_by?: string | null
          permissions?: Json | null
          user_id: string
        }
        Update: {
          hidden_menus?: string[] | null
          id?: string
          last_updated_at?: string | null
          last_updated_by?: string | null
          permissions?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_last_updated_by_fkey"
            columns: ["last_updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean | null
          last_sign_in_at: string | null
          last_updated_at: string | null
          last_updated_by: string | null
          phone: string | null
          provider_type: string | null
          providers: Json | null
          role: string
          user_name: string | null
          user_url_photo_profile: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean | null
          last_sign_in_at?: string | null
          last_updated_at?: string | null
          last_updated_by?: string | null
          phone?: string | null
          provider_type?: string | null
          providers?: Json | null
          role?: string
          user_name?: string | null
          user_url_photo_profile?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean | null
          last_sign_in_at?: string | null
          last_updated_at?: string | null
          last_updated_by?: string | null
          phone?: string | null
          provider_type?: string | null
          providers?: Json | null
          role?: string
          user_name?: string | null
          user_url_photo_profile?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_last_updated_by_fkey"
            columns: ["last_updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_column_types: {
        Args: { table_name_param: string }
        Returns: {
          column_name: string
          udt_name: string
        }[]
      }
      get_user_role: { Args: never; Returns: string }
    }
    Enums: {
      completion_status: "not_started" | "on_going" | "completed"
      measurement_type: "outcome" | "goal" | "activity"
      project_role:
        | "project_manager"
        | "field_coordinator"
        | "cluster_leader"
        | "language_facilitator"
      project_sensitivity:
        | "Level 1 - Low"
        | "Level 2 - Medium"
        | "Level 3 - High"
      project_type:
        | "story"
        | "passage"
        | "book"
        | "Oral Bible Stories"
        | "Oral Bible Translation"
      step_category: "administration" | "finance" | "translation"
      step_input_type:
        | "date_picker"
        | "google_drive_link"
        | "boolean"
        | "text"
        | "user_name"
        | "user_email"
        | "language"
        | "uid"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      completion_status: ["not_started", "on_going", "completed"],
      measurement_type: ["outcome", "goal", "activity"],
      project_role: [
        "project_manager",
        "field_coordinator",
        "cluster_leader",
        "language_facilitator",
      ],
      project_sensitivity: [
        "Level 1 - Low",
        "Level 2 - Medium",
        "Level 3 - High",
      ],
      project_type: [
        "story",
        "passage",
        "book",
        "Oral Bible Stories",
        "Oral Bible Translation",
      ],
      step_category: ["administration", "finance", "translation"],
      step_input_type: [
        "date_picker",
        "google_drive_link",
        "boolean",
        "text",
        "user_name",
        "user_email",
        "language",
        "uid",
      ],
    },
  },
} as const
