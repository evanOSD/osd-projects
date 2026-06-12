// src/app/(dashboard)/project-reports/page.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { useProject } from '@/context/ProjectContext'
import { PageTabs } from '@/components/ui/Tabs'
import { Card } from '@/components/ui/Card'
import { Button } from '@/app/(dashboard)/dummy/Buttons'
import { Input } from '@/app/(dashboard)/dummy/Forms'
import { Select } from '@/app/(dashboard)/dummy/Select'
import { Alert } from '@/app/(dashboard)/dummy/Alerts'
import { Badge } from '@/app/(dashboard)/dummy/Badges'
import {
  useProjectContext,
  useProjectReports,
  useAddProjectReport,
  useUpdateProjectReport,
  useDeleteProjectReport,
  useOutcomes,
  useActivities,
  useAddActivity,
  useUpdateActivity,
  useDeleteActivity
} from '@/hooks/queries/database/useProjectPlan'
import { Plus, Trash2, Edit2, FileText, Check, Save, ArrowLeft, Activity, Calendar, FileQuestion } from 'lucide-react'

export default function ProjectReportsPage() {
  const { selectedProject } = useProject()

  // Load project context
  const { data: context, isLoading: contextLoading } = useProjectContext(selectedProject)

  const projectId = context?.project?.id || ''
  const projectLanguageId = context?.projectLanguage?.id || ''

  // Load reports, outcomes, and activities
  const { data: reportsList = [], isLoading: reportsLoading } = useProjectReports(projectId)
  const { data: outcomeList = [] } = useOutcomes(projectId)
  const { data: activitiesList = [], isLoading: activitiesLoading } = useActivities(projectId)

  // Mutations
  const addReport = useAddProjectReport()
  const updateReport = useUpdateProjectReport()
  const deleteReport = useDeleteProjectReport(projectId)

  const addActivity = useAddActivity()
  const updateActivity = useUpdateActivity()
  const deleteActivity = useDeleteActivity(projectId)

  // App states
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [isCreatingReport, setIsCreatingReport] = useState(false)
  const [activeSubTab, setActiveSubTab] = useState<'details' | 'outcomes' | 'activities'>('details')

  // Form states for New Report
  const [newReportName, setNewReportName] = useState('')
  const [newReportStart, setNewReportStart] = useState('')
  const [newReportEnd, setNewReportEnd] = useState('')

  // Report detail editing states
  const [repName, setRepName] = useState('')
  const [repStart, setRepStart] = useState('')
  const [repEnd, setRepEnd] = useState('')
  const [repNotes, setRepNotes] = useState('')
  const [repWriter, setRepWriter] = useState({ name: '', position: '', email: '' })
  const [outcomeComparison, setOutcomeComparison] = useState<Record<string, { status: string; notes: string }>>({})

  // Form states for New Activity
  const [actName, setActName] = useState('')
  const [actGoalType, setActGoalType] = useState('Workshop')
  const [actTeamDays, setActTeamDays] = useState(10)
  const [actStart, setActStart] = useState('')
  const [actEnd, setActEnd] = useState('')

  // Load selected report details into form states
  const selectedReport = reportsList.find(r => r.id === selectedReportId)

  useEffect(() => {
    if (selectedReport) {
      setRepName(selectedReport.report_name)
      setRepStart(selectedReport.report_period_start_date || '')
      setRepEnd(selectedReport.report_period_end_date || '')
      setRepNotes(selectedReport.narrative_notes || '')

      const writerObj = (selectedReport.sec_01_report_writer as any) || { name: '', position: '', email: '' }
      setRepWriter({
        name: writerObj.name || '',
        position: writerObj.position || '',
        email: writerObj.email || ''
      })

      // Load outcome comparison (stored as JSONB)
      const savedComparison = (selectedReport.sec_02_outcomes_progress_comparison as any[]) || []
      const comparisonMap: Record<string, { status: string; notes: string }> = {}
      savedComparison.forEach((item: any) => {
        if (item.outcome_id) {
          comparisonMap[item.outcome_id] = {
            status: item.status || 'on_track',
            notes: item.notes || ''
          }
        }
      })
      setOutcomeComparison(comparisonMap)
    }
  }, [selectedReportId, selectedReport])

  if (contextLoading) {
    return (
      <div className='p-6 text-center text-muted-foreground animate-pulse'>
        Menghubungkan ke database dan menginisialisasi skema laporan...
      </div>
    )
  }

  // --- Handlers for Report Creation & Saving ---
  const handleCreateReport = () => {
    if (!newReportName.trim()) return
    addReport.mutate({
      project_id: projectId,
      project_language_id: projectLanguageId,
      report_name: newReportName,
      report_period_start_date: newReportStart || null,
      report_period_end_date: newReportEnd || null,
      report_status: 'draft'
    }, {
      onSuccess: (data) => {
        setSelectedReportId(data.id)
        setIsCreatingReport(false)
        setNewReportName('')
        setNewReportStart('')
        setNewReportEnd('')
      }
    })
  }

  const handleSaveReportDetails = () => {
    if (!selectedReportId) return

    // Transform outcome comparison mapping back into a JSONB array
    const comparisonArray = outcomeList.map(out => {
      const state = outcomeComparison[out.id] || { status: 'on_track', notes: '' }
      return {
        outcome_id: out.id,
        outcome_name: out.outcome_name,
        status: state.status,
        notes: state.notes
      }
    })

    updateReport.mutate({
      id: selectedReportId,
      payload: {
        report_name: repName,
        report_period_start_date: repStart || null,
        report_period_end_date: repEnd || null,
        narrative_notes: repNotes,
        sec_01_report_writer: repWriter as any,
        sec_02_outcomes_progress_comparison: comparisonArray as any
      }
    })
  }

  // --- Handlers for Project Activities ---
  const handleAddActivity = () => {
    if (!actName.trim()) return
    addActivity.mutate({
      project_id: projectId,
      project_language_id: projectLanguageId,
      activity_name: actName,
      goal_type: actGoalType,
      planned_team_days: actTeamDays,
      planned_start_date: actStart || null,
      planned_end_date: actEnd || null,
      status: 'not_started'
    })
    setActName('')
    setActStart('')
    setActEnd('')
  }

  const handleUpdateActivityStatus = (activityId: string, status: 'not_started' | 'on_going' | 'completed') => {
    updateActivity.mutate({
      id: activityId,
      payload: { status }
    })
  }

  const handleUpdateActivityNotes = (activityId: string, progressNotes: string) => {
    updateActivity.mutate({
      id: activityId,
      payload: { progress_notes: progressNotes }
    })
  }

  return (
    <>
      <PageTabs tabs={[{ name: 'Laporan Proyek (Reports)', path: '/project-reports' }]} />

      <div className='p-6 space-y-6 max-w-7xl mx-auto'>
        {/* Breadcrumb / Top Bar */}
        <div className='flex items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-extrabold text-foreground tracking-tight'>Manajemen Laporan Kuartalan</h1>
            <p className='text-sm text-muted-foreground mt-0.5'>{selectedProject}</p>
          </div>
          {selectedReportId && (
            <Button variant='outline' icon={ArrowLeft} onClick={() => setSelectedReportId(null)}>
              Kembali ke Daftar Laporan
            </Button>
          )}
        </div>

        {/* VIEW 1: REPORT EDITOR */}
        {selectedReportId ? (
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in duration-300'>
            {/* Editor Sidebar Tabs */}
            <div className='lg:col-span-1 space-y-2'>
              <Card className='p-4 space-y-2'>
                <h3 className='text-xs font-extrabold text-muted-foreground uppercase px-2 mb-3'>Bagian Laporan</h3>
                {[
                  { id: 'details', name: 'Detail Laporan', icon: FileText },
                  { id: 'outcomes', name: 'Perbandingan Outcome', icon: FileQuestion },
                  { id: 'activities', name: 'Progress Aktivitas', icon: Activity }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id as any)}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm font-semibold text-left transition-all cursor-pointer ${
                      activeSubTab === tab.id
                        ? 'bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] font-bold'
                        : 'text-muted-foreground hover:bg-[hsl(var(--muted))]/50 hover:text-foreground'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.name}
                  </button>
                ))}
              </Card>

              {/* Save Button Card */}
              <Card className='p-4'>
                <Button variant='primary' icon={Save} onClick={handleSaveReportDetails} className='w-full'>
                  Simpan Laporan
                </Button>
              </Card>
            </div>

            {/* Editor Content Area */}
            <div className='lg:col-span-3 space-y-6'>
              {/* SUBTAB A: DETAILS */}
              {activeSubTab === 'details' && (
                <Card className='p-6 space-y-6 animate-in fade-in duration-300'>
                  <h3 className='text-lg font-bold text-foreground border-b border-[hsl(var(--border))] pb-2'>
                    Detail & Penulis Laporan
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Input
                      id='rep-title'
                      label='Judul / Nama Laporan'
                      value={repName}
                      onChange={e => setRepName(e.target.value)}
                    />
                    <div className='grid grid-cols-2 gap-4'>
                      <Input
                        id='rep-start'
                        label='Periode Mulai'
                        type='date'
                        value={repStart}
                        onChange={e => setRepStart(e.target.value)}
                      />
                      <Input
                        id='rep-end'
                        label='Periode Selesai'
                        type='date'
                        value={repEnd}
                        onChange={e => setRepEnd(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className='space-y-4 pt-4 border-t border-[hsl(var(--border))]/60'>
                    <h4 className='text-sm font-bold text-foreground'>Informasi Penulis Laporan (Section 1)</h4>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <Input
                        id='writer-name'
                        label='Nama Pelapor'
                        placeholder='Nama Lengkap'
                        value={repWriter.name}
                        onChange={e => setRepWriter(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <Input
                        id='writer-pos'
                        label='Posisi / Jabatan'
                        placeholder='Misal: Field Coordinator'
                        value={repWriter.position}
                        onChange={e => setRepWriter(prev => ({ ...prev, position: e.target.value }))}
                      />
                      <Input
                        id='writer-email'
                        label='Email Pelapor'
                        placeholder='nama@email.com'
                        value={repWriter.email}
                        onChange={e => setRepWriter(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className='space-y-2 pt-4 border-t border-[hsl(var(--border))]/60'>
                    <label className='block text-xs font-bold text-muted-foreground uppercase'>
                      Catatan Narasi Tambahan
                    </label>
                    <textarea
                      className='w-full h-32 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] text-sm rounded-lg p-3 focus:outline-none focus:border-[hsl(var(--primary))] text-foreground resize-none'
                      placeholder='Masukkan catatan narasi atau ringkasan kuartal ini...'
                      value={repNotes}
                      onChange={e => setRepNotes(e.target.value)}
                    />
                  </div>
                </Card>
              )}

              {/* SUBTAB B: OUTCOME COMPARISON */}
              {activeSubTab === 'outcomes' && (
                <Card className='p-6 space-y-6 animate-in fade-in duration-300'>
                  <div className='space-y-1.5 border-b border-[hsl(var(--border))] pb-2'>
                    <h3 className='text-lg font-bold text-foreground'>
                      Perbandingan Outcome (Pertanyaan Laporan No. 2)
                    </h3>
                    <p className='text-xs text-muted-foreground'>
                      Silakan tentukan status perbandingan pencapaian Outcome proyek pada kuartal berjalan.
                    </p>
                  </div>

                  {outcomeList.length === 0 ? (
                    <Alert type='warning' title='Outcome Kosong'>
                      Belum ada outcome yang direncanakan untuk proyek ini. Silakan tambahkan outcome di halaman{' '}
                      <strong>Rencana & Progress</strong> terlebih dahulu.
                    </Alert>
                  ) : (
                    <div className='space-y-6'>
                      {outcomeList.map(out => {
                        const state = outcomeComparison[out.id] || { status: 'on_track', notes: '' }

                        return (
                          <div
                            key={out.id}
                            className='p-4 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--subtle))]/20 space-y-4'
                          >
                            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
                              <h4 className='font-bold text-foreground text-sm'>{out.outcome_name}</h4>

                              {/* Status select */}
                              <select
                                className='bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-md px-2 py-1 text-xs font-semibold text-foreground focus:outline-none focus:border-[hsl(var(--primary))]'
                                value={state.status}
                                onChange={e => {
                                  setOutcomeComparison(prev => ({
                                    ...prev,
                                    [out.id]: { ...state, status: e.target.value }
                                  }))
                                }}
                              >
                                <option value='on_track'>On Track</option>
                                <option value='ahead'>Ahead (Melampaui)</option>
                                <option value='behind'>Behind (Terlambat)</option>
                              </select>
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-muted-foreground'>
                              <div>
                                <strong>Indikator:</strong> {out.indicator_of_change || '-'}
                              </div>
                              <div>
                                <strong>Metode Ukur:</strong> {out.measurement_method || '-'}
                              </div>
                            </div>

                            <div className='space-y-1.5'>
                              <label className='block text-[10px] font-bold text-muted-foreground uppercase'>
                                Catatan Progress Outcome
                              </label>
                              <input
                                type='text'
                                className='w-full bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-[hsl(var(--primary))]'
                                placeholder='Tulis catatan evaluasi outcome pada kuartal ini...'
                                value={state.notes}
                                onChange={e => {
                                  setOutcomeComparison(prev => ({
                                    ...prev,
                                    [out.id]: { ...state, notes: e.target.value }
                                  }))
                                }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </Card>
              )}

              {/* SUBTAB C: ACTIVITIES PROGRESS */}
              {activeSubTab === 'activities' && (
                <div className='space-y-6 animate-in fade-in duration-300'>
                  {/* Create Activity Form */}
                  <Card className='p-6 space-y-4'>
                    <h3 className='text-lg font-bold text-foreground'>Tambah Aktivitas Proyek Baru</h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-end'>
                      <div className='md:col-span-2'>
                        <Input
                          id='act-name'
                          label='Nama Aktivitas'
                          placeholder='Misal: Workshop Penerjemahan Cerita Alkitab 1-9'
                          value={actName}
                          onChange={e => setActName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className='block text-xs font-bold text-muted-foreground uppercase mb-1.5'>
                          Tipe Aktivitas
                        </label>
                        <select
                          className='w-full bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[hsl(var(--primary))] text-foreground'
                          value={actGoalType}
                          onChange={e => setActGoalType(e.target.value)}
                        >
                          <option value='Workshop'>Workshop / Training</option>
                          <option value='Video Production'>Video Post-Production</option>
                          <option value='Audio Processing'>Audio Processing</option>
                          <option value='Distribution'>Distribution (Penyebaran)</option>
                          <option value='Other'>Lainnya (Other)</option>
                        </select>
                      </div>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-end'>
                      <Input
                        id='act-days'
                        label='Hari Kerja Tim (Planned Team Days)'
                        type='number'
                        value={actTeamDays}
                        onChange={e => setActTeamDays(parseInt(e.target.value))}
                      />
                      <Input
                        id='act-start'
                        label='Tanggal Mulai'
                        type='date'
                        value={actStart}
                        onChange={e => setActStart(e.target.value)}
                      />
                      <Input
                        id='act-end'
                        label='Tanggal Selesai'
                        type='date'
                        value={actEnd}
                        onChange={e => setActEnd(e.target.value)}
                      />
                    </div>
                    <div className='pt-2 flex justify-end'>
                      <Button variant='primary' icon={Plus} onClick={handleAddActivity}>
                        Tambahkan Aktivitas
                      </Button>
                    </div>
                  </Card>

                  {/* List of Activities with Editable Progress Status */}
                  <Card className='p-6 space-y-4'>
                    <h3 className='text-lg font-bold text-foreground'>Kelola Status Progress Aktivitas</h3>
                    {activitiesLoading ? (
                      <div className='text-center p-6 text-muted-foreground'>Memuat aktivitas...</div>
                    ) : activitiesList.length === 0 ? (
                      <div className='text-center py-12 text-muted-foreground border border-dashed rounded-lg border-[hsl(var(--border))]'>
                        Belum ada aktivitas untuk proyek ini. Silakan buat di atas.
                      </div>
                    ) : (
                      <div className='space-y-4'>
                        {activitiesList.map(act => (
                          <div
                            key={act.id}
                            className='p-4 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--card))] hover:shadow-md transition-shadow grid grid-cols-1 md:grid-cols-3 gap-4'
                          >
                            {/* Title & Type */}
                            <div className='md:col-span-2 space-y-1.5'>
                              <div className='flex items-center gap-2'>
                                <h4 className='font-bold text-foreground text-sm'>{act.activity_name}</h4>
                                <Badge variant='muted'>{act.goal_type || 'Aktivitas'}</Badge>
                              </div>
                              <div className='flex gap-4 text-xs text-muted-foreground'>
                                <span>
                                  Durasi: <strong>{act.planned_team_days} hari kerja</strong>
                                </span>
                                {act.planned_start_date && (
                                  <span>
                                    Periode: {new Date(act.planned_start_date).toLocaleDateString()} -{' '}
                                    {act.planned_end_date ? new Date(act.planned_end_date).toLocaleDateString() : 'Selesai'}
                                  </span>
                                )}
                              </div>
                              <div className='pt-1.5'>
                                <label className='block text-[10px] font-bold text-muted-foreground uppercase mb-1'>
                                  Catatan Kemajuan (Progress Notes)
                                </label>
                                <input
                                  type='text'
                                  className='w-full bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded px-2.5 py-1 text-xs text-foreground focus:outline-none focus:border-[hsl(var(--primary))]'
                                  placeholder='Masukkan catatan hambatan atau kemajuan aktivitas...'
                                  defaultValue={act.progress_notes || ''}
                                  onBlur={e => handleUpdateActivityNotes(act.id, e.target.value)}
                                />
                              </div>
                            </div>

                            {/* Status Control */}
                            <div className='flex flex-col justify-between items-end gap-2'>
                              <button
                                onClick={() => {
                                  if (confirm('Hapus aktivitas ini?')) {
                                    deleteActivity.mutate(act.id)
                                  }
                                }}
                                className='p-1 text-danger hover:bg-danger-soft rounded transition-all self-end'
                                title='Hapus Aktivitas'
                              >
                                <Trash2 size={14} />
                              </button>

                              {/* Progress Status Select Toggle Buttons */}
                              <div className='flex gap-1 w-full max-w-[240px]'>
                                {(['not_started', 'on_going', 'completed'] as const).map(st => {
                                  const isActive = act.status === st
                                  return (
                                    <button
                                      key={st}
                                      onClick={() => handleUpdateActivityStatus(act.id, st)}
                                      className={`flex-1 text-[10px] py-1 px-1.5 font-bold rounded text-center transition-all cursor-pointer ${
                                        isActive
                                          ? st === 'completed'
                                            ? 'bg-[hsl(var(--success-soft))] text-[hsl(var(--success))] border border-[hsl(var(--success))]/30'
                                            : st === 'on_going'
                                              ? 'bg-[hsl(var(--info-soft))] text-[hsl(var(--info))] border border-[hsl(var(--info))]/30'
                                              : 'bg-[hsl(var(--muted))] text-muted-foreground border border-[hsl(var(--border))]'
                                          : 'bg-transparent text-muted-foreground border border-transparent hover:bg-[hsl(var(--muted))]/40'
                                      }`}
                                    >
                                      {st === 'completed' ? 'Selesai' : st === 'on_going' ? 'Mulai' : 'Batal'}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* VIEW 2: REPORTS LIST & CREATOR */
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300'>
            {/* Create Report Column */}
            <div className='space-y-4'>
              <Card className='p-6 space-y-4'>
                <h3 className='text-lg font-bold text-foreground'>Buat Laporan Kuartalan Baru</h3>
                <div className='space-y-4'>
                  <Input
                    id='new-rep-name'
                    label='Nama Laporan'
                    placeholder='Misal: Laporan Kemajuan Q2 2026'
                    value={newReportName}
                    onChange={e => setNewReportName(e.target.value)}
                  />
                  <div className='grid grid-cols-2 gap-4'>
                    <Input
                      id='new-rep-start'
                      label='Tanggal Mulai'
                      type='date'
                      value={newReportStart}
                      onChange={e => setNewReportStart(e.target.value)}
                    />
                    <Input
                      id='new-rep-end'
                      label='Tanggal Selesai'
                      type='date'
                      value={newReportEnd}
                      onChange={e => setNewReportEnd(e.target.value)}
                    />
                  </div>
                </div>
                <div className='pt-2'>
                  <Button variant='primary' icon={Plus} onClick={handleCreateReport} className='w-full'>
                    Buat Laporan Baru
                  </Button>
                </div>
              </Card>
            </div>

            {/* Reports List Column */}
            <div className='lg:col-span-2 space-y-4'>
              <Card className='p-6'>
                <h3 className='text-lg font-bold text-foreground mb-4'>Daftar Laporan Kuartalan (Quarterly Reports)</h3>
                {reportsLoading ? (
                  <div className='text-center p-6 text-muted-foreground'>Memuat daftar laporan...</div>
                ) : reportsList.length === 0 ? (
                  <div className='text-center py-12 text-muted-foreground border border-dashed rounded-lg border-[hsl(var(--border))]'>
                    Belum ada laporan kuartalan yang dibuat. Silakan gunakan form di samping untuk membuat laporan.
                  </div>
                ) : (
                  <div className='grid grid-cols-1 gap-3.5'>
                    {reportsList.map(rep => (
                      <div
                        key={rep.id}
                        onClick={() => setSelectedReportId(rep.id)}
                        className='p-4 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--subtle))] transition-all cursor-pointer flex justify-between items-center group'
                      >
                        <div className='flex items-center gap-3.5 min-w-0'>
                          <div className='w-10 h-10 bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))] rounded-full flex items-center justify-center shrink-0'>
                            <FileText size={18} />
                          </div>
                          <div>
                            <h4 className='font-bold text-foreground group-hover:text-[hsl(var(--primary))] transition-colors'>
                              {rep.report_name}
                            </h4>
                            <p className='text-xs text-muted-foreground mt-0.5'>
                              Periode:{' '}
                              {rep.report_period_start_date ? new Date(rep.report_period_start_date).toLocaleDateString() : '-'}{' '}
                              sampai{' '}
                              {rep.report_period_end_date ? new Date(rep.report_period_end_date).toLocaleDateString() : '-'}
                            </p>
                          </div>
                        </div>

                        <div className='flex items-center gap-3 shrink-0'>
                          <Badge variant='success'>{rep.report_status || 'draft'}</Badge>
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              if (confirm('Hapus laporan ini beserta semua narasi di dalamnya?')) {
                                deleteReport.mutate(rep.id)
                              }
                            }}
                            className='p-1.5 rounded text-danger hover:bg-danger-soft transition-all opacity-0 group-hover:opacity-100'
                            title='Hapus Laporan'
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
