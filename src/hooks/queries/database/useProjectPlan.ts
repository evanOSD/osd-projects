// src/hooks/queries/database/useProjectPlan.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  projectPlanApi,
  YearlyCapacityInsert,
  YearlyCapacityUpdate,
  OutcomeInsert,
  OutcomeUpdate,
  NonTranslationGoalInsert,
  NonTranslationGoalUpdate,
  TranslationGoalInsert,
  TranslationGoalUpdate,
  TranslationProgressUpdate,
  ActivityInsert,
  ActivityUpdate,
  ProjectReportInsert,
  ProjectReportUpdate
} from '@/api/database/projectPlan'

// 1. PROJECT CONTEXT HOOK
export function useProjectContext(projectName: string) {
  return useQuery({
    queryKey: ['projectContext', projectName],
    queryFn: () => projectPlanApi.getOrCreateProjectContext(projectName),
    enabled: !!projectName,
    staleTime: 1000 * 60 * 10 // Cache for 10 minutes
  })
}

// 2. YEARLY CAPACITY HOOKS
export function useYearlyCapacity(projectLanguageId: string) {
  return useQuery({
    queryKey: ['yearlyCapacity', projectLanguageId],
    queryFn: () => projectPlanApi.getYearlyCapacity(projectLanguageId),
    enabled: !!projectLanguageId
  })
}

export function useAddYearlyCapacity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: YearlyCapacityInsert) => projectPlanApi.addYearlyCapacity(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['yearlyCapacity', data.project_language_id] })
      toast.success('Kapasitas tim tahun fiskal berhasil ditambahkan!')
    },
    onError: (error: any) => {
      toast.error(`Gagal menambahkan: ${error.message}`)
    }
  })
}

export function useUpdateYearlyCapacity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: YearlyCapacityUpdate }) =>
      projectPlanApi.updateYearlyCapacity(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['yearlyCapacity', data.project_language_id] })
      toast.success('Kapasitas tim berhasil diperbarui!', { id: 'capacity-update' })
    },
    onError: (error: any) => {
      toast.error(`Gagal menyimpan: ${error.message}`)
    }
  })
}

export function useDeleteYearlyCapacity(projectLanguageId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => projectPlanApi.deleteYearlyCapacity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['yearlyCapacity', projectLanguageId] })
      toast.success('Kapasitas tim tahun fiskal berhasil dihapus!')
    },
    onError: (error: any) => {
      toast.error(`Gagal menghapus: ${error.message}`)
    }
  })
}

// 3. OUTCOMES HOOKS
export function useOutcomes(projectId: string) {
  return useQuery({
    queryKey: ['outcomes', projectId],
    queryFn: () => projectPlanApi.getOutcomes(projectId),
    enabled: !!projectId
  })
}

export function useAddOutcome() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: OutcomeInsert) => projectPlanApi.addOutcome(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['outcomes', data.project_id] })
      toast.success('Dampak rencana (Outcome) berhasil ditambahkan!')
    },
    onError: (error: any) => {
      toast.error(`Gagal menambahkan: ${error.message}`)
    }
  })
}

export function useUpdateOutcome() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: OutcomeUpdate }) =>
      projectPlanApi.updateOutcome(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['outcomes', data.project_id] })
      toast.success('Outcome berhasil diperbarui!', { id: 'outcome-update' })
    },
    onError: (error: any) => {
      toast.error(`Gagal menyimpan: ${error.message}`)
    }
  })
}

export function useDeleteOutcome(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => projectPlanApi.deleteOutcome(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outcomes', projectId] })
      toast.success('Outcome berhasil dihapus!')
    },
    onError: (error: any) => {
      toast.error(`Gagal menghapus: ${error.message}`)
    }
  })
}

// 4. NON-TRANSLATION GOALS HOOKS
export function useNonTranslationGoals(projectId: string) {
  return useQuery({
    queryKey: ['nonTranslationGoals', projectId],
    queryFn: () => projectPlanApi.getNonTranslationGoals(projectId),
    enabled: !!projectId
  })
}

export function useAddNonTranslationGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: NonTranslationGoalInsert) => projectPlanApi.addNonTranslationGoal(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['nonTranslationGoals', data.project_id] })
      toast.success('Target non-terjemahan (Output) berhasil ditambahkan!')
    },
    onError: (error: any) => {
      toast.error(`Gagal menambahkan: ${error.message}`)
    }
  })
}

export function useUpdateNonTranslationGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: NonTranslationGoalUpdate }) =>
      projectPlanApi.updateNonTranslationGoal(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['nonTranslationGoals', data.project_id] })
      toast.success('Target non-terjemahan diperbarui!', { id: 'non-translation-update' })
    },
    onError: (error: any) => {
      toast.error(`Gagal menyimpan: ${error.message}`)
    }
  })
}

export function useDeleteNonTranslationGoal(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => projectPlanApi.deleteNonTranslationGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nonTranslationGoals', projectId] })
      toast.success('Target non-terjemahan berhasil dihapus!')
    },
    onError: (error: any) => {
      toast.error(`Gagal menghapus: ${error.message}`)
    }
  })
}

// 5. TRANSLATION GOALS HOOKS
export function useTranslationGoals(projectLanguageId: string) {
  return useQuery({
    queryKey: ['translationGoals', projectLanguageId],
    queryFn: () => projectPlanApi.getTranslationGoals(projectLanguageId),
    enabled: !!projectLanguageId
  })
}

export function useAddTranslationGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TranslationGoalInsert) => projectPlanApi.addTranslationGoal(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['translationGoals', data.project_language_id] })
      toast.success('Rencana penerjemahan kitab berhasil ditambahkan!')
    },
    onError: (error: any) => {
      toast.error(`Gagal menambahkan: ${error.message}`)
    }
  })
}

export function useUpdateTranslationGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TranslationGoalUpdate }) =>
      projectPlanApi.updateTranslationGoal(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['translationGoals', data.project_language_id] })
      toast.success('Perencanaan kitab diperbarui!', { id: 'translation-goal-update' })
    },
    onError: (error: any) => {
      toast.error(`Gagal menyimpan: ${error.message}`)
    }
  })
}

export function useDeleteTranslationGoal(projectLanguageId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => projectPlanApi.deleteTranslationGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translationGoals', projectLanguageId] })
      toast.success('Rencana kitab berhasil dihapus!')
    },
    onError: (error: any) => {
      toast.error(`Gagal menghapus: ${error.message}`)
    }
  })
}

// 6. TRANSLATION PROGRESS HOOKS
export function useUpdateTranslationProgress(projectLanguageId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TranslationProgressUpdate }) =>
      projectPlanApi.updateTranslationProgress(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translationGoals', projectLanguageId] })
    },
    onError: (error: any) => {
      toast.error(`Gagal mengupdate progress langkah: ${error.message}`)
    }
  })
}

// 7. ACTIVITIES HOOKS
export function useActivities(projectId: string) {
  return useQuery({
    queryKey: ['activities', projectId],
    queryFn: () => projectPlanApi.getActivities(projectId),
    enabled: !!projectId
  })
}

export function useAddActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ActivityInsert) => projectPlanApi.addActivity(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['activities', data.project_id] })
      toast.success('Aktivitas berhasil ditambahkan!')
    },
    onError: (error: any) => {
      toast.error(`Gagal menambahkan aktivitas: ${error.message}`)
    }
  })
}

export function useUpdateActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ActivityUpdate }) =>
      projectPlanApi.updateActivity(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['activities', data.project_id] })
      toast.success('Aktivitas diperbarui!', { id: 'activity-update' })
    },
    onError: (error: any) => {
      toast.error(`Gagal menyimpan aktivitas: ${error.message}`)
    }
  })
}

export function useDeleteActivity(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => projectPlanApi.deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', projectId] })
      toast.success('Aktivitas berhasil dihapus!')
    },
    onError: (error: any) => {
      toast.error(`Gagal menghapus aktivitas: ${error.message}`)
    }
  })
}

// 8. PROJECT REPORTS HOOKS
export function useProjectReports(projectId: string) {
  return useQuery({
    queryKey: ['projectReports', projectId],
    queryFn: () => projectPlanApi.getProjectReports(projectId),
    enabled: !!projectId
  })
}

export function useAddProjectReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProjectReportInsert) => projectPlanApi.addProjectReport(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projectReports', data.project_id] })
      toast.success('Laporan kuartalan berhasil dibuat!')
    },
    onError: (error: any) => {
      toast.error(`Gagal membuat laporan: ${error.message}`)
    }
  })
}

export function useUpdateProjectReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProjectReportUpdate }) =>
      projectPlanApi.updateProjectReport(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projectReports', data.project_id] })
      toast.success('Laporan berhasil disimpan!', { id: 'report-update' })
    },
    onError: (error: any) => {
      toast.error(`Gagal menyimpan laporan: ${error.message}`)
    }
  })
}

export function useDeleteProjectReport(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => projectPlanApi.deleteProjectReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectReports', projectId] })
      toast.success('Laporan berhasil dihapus!')
    },
    onError: (error: any) => {
      toast.error(`Gagal menghapus laporan: ${error.message}`)
    }
  })
}
