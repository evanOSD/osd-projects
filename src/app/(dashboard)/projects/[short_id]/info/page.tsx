'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useProjectByShortId, useUpdateProject, useUpdateProjectLanguages, useAllOrganizationsList, useUpdateProjectMembers } from '@/hooks/queries/database/useProjects'
import { useAllLanguagesList } from '@/hooks/queries/database/useLanguages'
import { useAllUsersList } from '@/hooks/queries/users/useUsers'
import { Card } from '@/components/ui/Card'
import { DatePicker } from '@/app/(dashboard)/dummy/DatePicker'
import { Modal } from '@/app/(dashboard)/dummy/Modal'
import { MultiSelect } from '@/app/(dashboard)/dummy/MultiSelect'
import { Select } from '@/app/(dashboard)/dummy/Select'
import { Button } from '@/app/(dashboard)/dummy/Buttons'
import { Users, Shield, Home, Compass, Briefcase, Award, BookOpen, Trash2, Plus } from 'lucide-react'

export default function ProjectInfoPage() {
  const params = useParams()
  const shortId = params.short_id as string
  const { data: project, isLoading, isError } = useProjectByShortId(shortId)
  const updateProject = useUpdateProject()
  const updateProjectLanguages = useUpdateProjectLanguages(shortId)
  const updateProjectMembers = useUpdateProjectMembers(shortId)
  const { data: allLanguages = [] } = useAllLanguagesList()
  const { data: allUsers = [] } = useAllUsersList()
  const { data: allOrganizations = [] } = useAllOrganizationsList()

  const [isLangModalOpen, setIsLangModalOpen] = React.useState(false)
  const [tempLanguages, setTempLanguages] = React.useState<Array<{ language_id: string; language_pseudonym: string | null }>>([])
  const [selectedNewLangIds, setSelectedNewLangIds] = React.useState<string[]>([])

  const languagesMap = React.useMemo(() => {
    const map = new Map<string, typeof allLanguages[number]>()
    allLanguages.forEach(lang => {
      map.set(lang.id, lang)
    })
    return map
  }, [allLanguages])

  const existingIds = React.useMemo(() => {
    return new Set(tempLanguages.map(tl => tl.language_id))
  }, [tempLanguages])

  const selectOptions = React.useMemo(() => {
    return allLanguages
      .filter(lang => !existingIds.has(lang.id))
      .map(lang => ({
        label: lang.name_with_code || lang.name_in_ethnologue || '-',
        value: lang.id
      }))
  }, [allLanguages, existingIds])

  const userOptions = React.useMemo(() => {
    return allUsers.map((u: any) => ({
      label: u.user_name || '-',
      value: u.id
    }))
  }, [allUsers])

  const organizationOptions = React.useMemo(() => {
    return allOrganizations.map((o: any) => ({
      label: o.org_acronym || o.org_name || '-',
      value: o.id
    }))
  }, [allOrganizations])

  const handleOpenModal = () => {
    if (!project) return
    setTempLanguages(
      project.project_languages?.map(pl => ({
        language_id: pl.language_id,
        language_pseudonym: pl.language_pseudonym
      })) || []
    )
    setSelectedNewLangIds([])
    setIsLangModalOpen(true)
  }

  const handleSaveLanguages = () => {
    if (!project) return
    updateProjectLanguages.mutate(
      {
        projectId: project.id,
        selections: tempLanguages
      },
      {
        onSuccess: () => {
          setIsLangModalOpen(false)
        }
      }
    )
  }

  if (isLoading) {
    return (
      <div className='p-6 text-center text-muted-foreground animate-pulse'>
        Memuat rincian informasi proyek...
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className='p-6 text-center text-danger'>
        Gagal memuat rincian informasi proyek.
      </div>
    )
  }
  const capitalize = (str: string | null | undefined) => {
    if (!str) return '-'
    return str
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  const languageNames = Array.from(
    new Set(
      project.project_languages
        ?.map((pl: any) => pl.languages?.name_in_ethnologue)
        .filter(Boolean)
    )
  ).map(lang => capitalize(lang as string)).join(', ') || 'Belum Diatur'

  const teamSize = project.project_languages?.reduce((sum: number, lang: any) => {
    return sum + (lang.project_yearly_capacity?.reduce((lSum: number, cap: any) => lSum + (cap.num_translators || 0), 0) || 0)
  }, 0) || 0

  const translationGoalsCount = project.project_languages?.reduce(
    (acc: number, pl: any) => acc + (pl.project_translation_goals?.length || 0),
    0
  ) || 0

  const outcomesCount = project.project_outcomes?.length || 0

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300'>
      {/* Kolom Kiri: Rincian Proyek */}
      <Card className='p-6 space-y-6'>
        <div>
          <h3 className='text-lg font-bold text-foreground mb-4 border-b border-[hsl(var(--border))] pb-2'>Rincian Proyek</h3>
          <p className='text-sm text-muted-foreground leading-relaxed'>
            {project.project_description || 'Tidak ada deskripsi untuk proyek ini.'}
          </p>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <DatePicker
            id='project-start-date'
            label='Tanggal Mulai'
            value={project.project_start_date ? new Date(project.project_start_date) : undefined}
            onChange={(date) => {
              const formatted = date ? date.toLocaleDateString('sv-SE') : null
              updateProject.mutate({
                id: project.id,
                payload: { project_start_date: formatted }
              })
            }}
            isClearable
          />
          <DatePicker
            id='project-end-date'
            label='Tanggal Selesai'
            value={project.project_end_date ? new Date(project.project_end_date) : undefined}
            onChange={(date) => {
              const formatted = date ? date.toLocaleDateString('sv-SE') : null
              updateProject.mutate({
                id: project.id,
                payload: { project_end_date: formatted }
              })
            }}
            isClearable
          />
        </div>

        <div className='space-y-4 pt-4 border-t border-[hsl(var(--border))]/50'>
          <div className='w-full'>
            <label className='block mb-1.5 text-sm font-medium text-foreground'>
              Bahasa ({project.project_languages?.length || 0} bahasa)
            </label>
            <Button
              type='button'
              variant='ghost'
              onClick={handleOpenModal}
              className='flex items-center justify-between w-full pl-3 pr-2 py-2.5 bg-[hsl(var(--surface))] border border-[hsl(var(--input))] rounded-(--radius) text-sm font-semibold transition-all duration-200 cursor-pointer text-left text-foreground hover:bg-[hsl(var(--muted))]/30 hover:border-[hsl(var(--border))] shadow-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/0.2 h-11'
            >
              <span className='block truncate mr-auto'>{languageNames}</span>
              <Compass className='w-4 h-4 text-muted-foreground shrink-0 ml-2' />
            </Button>
          </div>

          <div className='flex items-start gap-3'>
            <Users className='text-primary shrink-0 mt-0.5' size={18} />
            <div>
              <span className='block text-xs text-muted-foreground font-bold'>Ukuran Tim (Team Size)</span>
              <span className='text-sm font-semibold text-foreground'>{teamSize} Orang</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Kolom Kanan: Pengelola & Metadata */}
      <Card className='p-6 space-y-6'>
        <h3 className='text-lg font-bold text-foreground mb-4 border-b border-[hsl(var(--border))] pb-2'>Metadata & Tim</h3>

        <div className='space-y-4'>
          <MultiSelect
            id="project-managers"
            label="Project Manager(s)"
            options={userOptions}
            value={project.project_members?.filter((pm: any) => pm.role === 'project_manager').map((pm: any) => pm.user_id).filter(Boolean) || []}
            onChange={(val) => {
              updateProjectMembers.mutate({
                projectId: project.id,
                role: 'project_manager',
                userIds: val as string[]
              })
            }}
            placeholder="Pilih Project Manager..."
            isClearable
          />

          <Select
            id="project-organization"
            label="Managed By"
            options={organizationOptions}
            value={project.organization_id || ''}
            onChange={(val) => {
              updateProject.mutate({
                id: project.id,
                payload: { organization_id: val ? String(val) : null }
              })
            }}
            placeholder="Pilih Organisasi..."
            isClearable
          />

          <div className='grid grid-cols-2 gap-4'>
            <Select
              id="project-sensitivity"
              label="Sensitivity"
              options={[
                { label: 'Level 1 - Low', value: 'Level 1 - Low' },
                { label: 'Level 2 - Medium', value: 'Level 2 - Medium' },
                { label: 'Level 3 - High', value: 'Level 3 - High' }
              ]}
              value={project.sensitivity || ''}
              onChange={(val) => {
                updateProject.mutate({
                  id: project.id,
                  payload: { sensitivity: val ? String(val) : null }
                })
              }}
              placeholder="Pilih Sensitivity..."
              isClearable
            />

            <Select
              id="project-type"
              label="Project Type"
              options={[
                { label: 'Oral Bible Stories', value: 'Oral Bible Stories' },
                { label: 'Oral Bible Translation', value: 'Oral Bible Translation' },
                { label: 'Story', value: 'story' },
                { label: 'Passage', value: 'passage' },
                { label: 'Book', value: 'book' }
              ]}
              value={project.project_type || ''}
              onChange={(val) => {
                updateProject.mutate({
                  id: project.id,
                  payload: { project_type: val ? String(val) : null }
                })
              }}
              placeholder="Pilih Project Type..."
              isClearable
            />
          </div>

          <div className='space-y-4 pt-4 border-t border-[hsl(var(--border))]/50'>
            <MultiSelect
              id="field-coordinators"
              label="Field Coordinator(s)"
              options={userOptions}
              value={project.project_members?.filter((pm: any) => pm.role === 'field_coordinator').map((pm: any) => pm.user_id).filter(Boolean) || []}
              onChange={(val) => {
                updateProjectMembers.mutate({
                  projectId: project.id,
                  role: 'field_coordinator',
                  userIds: val as string[]
                })
              }}
              placeholder="Pilih Field Coordinator..."
              isClearable
            />

            <MultiSelect
              id="cluster-leaders"
              label="Cluster Leader(s)"
              options={userOptions}
              value={project.project_members?.filter((pm: any) => pm.role === 'cluster_leader').map((pm: any) => pm.user_id).filter(Boolean) || []}
              onChange={(val) => {
                updateProjectMembers.mutate({
                  projectId: project.id,
                  role: 'cluster_leader',
                  userIds: val as string[]
                })
              }}
              placeholder="Pilih Cluster Leader..."
              isClearable
            />
          </div>

          <div className='grid grid-cols-2 gap-4 pt-4 border-t border-[hsl(var(--border))]/50'>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <BookOpen className='w-4 h-4 text-primary shrink-0' />
              <span>{translationGoalsCount} Kitab Target</span>
            </div>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <Award className='w-4 h-4 text-success shrink-0' />
              <span>{outcomesCount} Outcomes</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Modal Pemilihan Bahasa */}
      <Modal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        title="Pilih Bahasa Proyek"
        className="max-w-3xl"
        footer={
          <>
            <Button
              type='button'
              variant='ghost'
              onClick={() => setIsLangModalOpen(false)}
              className='px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-[hsl(var(--muted))] hover:bg-[hsl(var(--border))] rounded-(--radius) transition-colors cursor-pointer'
            >
              Cancel
            </Button>
            <Button
              type='button'
              variant='primary'
              onClick={handleSaveLanguages}
              disabled={updateProjectLanguages.isPending}
              className='px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-(--radius) shadow-sm transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {updateProjectLanguages.isPending ? 'Menyimpan...' : 'Save'}
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-end gap-3 bg-[hsl(var(--muted))]/10 p-4 rounded-(--radius) border border-[hsl(var(--border))]/50">
            <div className="flex-1 w-full">
              <MultiSelect
                id="modal-lang-select"
                label="Pilih Bahasa Baru"
                options={selectOptions}
                value={selectedNewLangIds}
                onChange={(val) => setSelectedNewLangIds(val as string[])}
                placeholder="Cari atau pilih bahasa..."
                isClearable
              />
            </div>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                const newItems = selectedNewLangIds.map(langId => ({
                  language_id: langId,
                  language_pseudonym: null
                }))
                setTempLanguages(prev => [...prev, ...newItems])
                setSelectedNewLangIds([])
              }}
              disabled={selectedNewLangIds.length === 0}
              className="w-full sm:w-auto h-11 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-(--radius) disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus size={16} />
              Tambah Bahasa
            </Button>
          </div>

          <div className="border border-[hsl(var(--border))] rounded-(--radius) overflow-hidden bg-[hsl(var(--surface))] shadow-sm">
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[hsl(var(--muted))]/30 border-b border-[hsl(var(--border))]">
                    <th className="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Nama Bahasa</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Code</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Pseudonym</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Population</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(var(--border))]/40">
                  {tempLanguages.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-sm">
                        Belum ada bahasa yang ditambahkan untuk proyek ini.
                      </td>
                    </tr>
                  ) : (
                    tempLanguages.map((tl, index) => {
                      const langInfo = languagesMap.get(tl.language_id)
                      const name = langInfo?.name_in_ethnologue || '-'
                      const code = langInfo?.iso_code || '-'
                      const pseudonymFallback = langInfo?.pseudonym || ''
                      const population = langInfo?.total_population_ethnologue !== null && langInfo?.total_population_ethnologue !== undefined
                        ? langInfo.total_population_ethnologue.toLocaleString('id-ID')
                        : '-'

                      return (
                        <tr key={tl.language_id} className="hover:bg-[hsl(var(--muted))]/10 transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground">{name}</td>
                          <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{code}</td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              placeholder={pseudonymFallback || 'Ketik Pseudonym...'}
                              value={tl.language_pseudonym || ''}
                              onChange={(e) => {
                                const val = e.target.value
                                setTempLanguages(prev => prev.map((item, idx) => 
                                  idx === index ? { ...item, language_pseudonym: val || null } : item
                                ))
                              }}
                              className="w-full px-3 py-1.5 text-sm bg-[hsl(var(--surface))] border border-[hsl(var(--input))] rounded-(--radius) text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/20 focus:border-[hsl(var(--ring))] transition-all"
                            />
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{population}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setTempLanguages(prev => prev.filter((_, idx) => idx !== index))
                              }}
                              className="p-1.5 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-full transition-all cursor-pointer inline-flex items-center justify-center"
                              title="Hapus Bahasa"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
