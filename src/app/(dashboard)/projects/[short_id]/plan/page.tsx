'use client'

import React, { useState } from 'react'
import { useProjectDetailContext } from '../layout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/app/(dashboard)/dummy/Buttons'
import { Input } from '@/app/(dashboard)/dummy/Forms'
import { Badge } from '@/app/(dashboard)/dummy/Badges'
import {
  useYearlyCapacity,
  useAddYearlyCapacity,
  useUpdateYearlyCapacity,
  useDeleteYearlyCapacity,
  useOutcomes,
  useAddOutcome,
  useUpdateOutcome,
  useDeleteOutcome,
  useTranslationGoals,
  useAddTranslationGoal,
  useUpdateTranslationGoal,
  useDeleteTranslationGoal,
  useUpdateTranslationProgress,
  useNonTranslationGoals,
  useAddNonTranslationGoal,
  useUpdateNonTranslationGoal,
  useDeleteNonTranslationGoal
} from '@/hooks/queries/database/useProjectPlan'
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp, Users, Award, BookOpen, Layers } from 'lucide-react'

export default function ProjectPlanPage() {
  const { project, language, projectLanguage, books, steps, short_id } = useProjectDetailContext()
  const [activeTab, setActiveTab] = useState<'capacity' | 'outcomes' | 'translation' | 'nontranslation'>('capacity')

  const projectId = project?.id || ''
  const projectLanguageId = projectLanguage?.id || ''

  // Load data using React Query
  const { data: capacityList = [], isLoading: capLoading } = useYearlyCapacity(projectLanguageId)
  const { data: outcomeList = [], isLoading: outLoading } = useOutcomes(projectId)
  const { data: translationList = [], isLoading: transLoading } = useTranslationGoals(projectLanguageId)
  const { data: nonTranslationList = [], isLoading: nonTransLoading } = useNonTranslationGoals(projectId)

  // Mutations
  const addCapacity = useAddYearlyCapacity()
  const updateCapacity = useUpdateYearlyCapacity()
  const deleteCapacity = useDeleteYearlyCapacity(projectLanguageId)

  const addOutcome = useAddOutcome()
  const updateOutcome = useUpdateOutcome()
  const deleteOutcome = useDeleteOutcome(projectId)

  const addTranslation = useAddTranslationGoal()
  const updateTranslation = useUpdateTranslationGoal()
  const deleteTranslation = useDeleteTranslationGoal(projectLanguageId)
  const updateProgress = useUpdateTranslationProgress(projectLanguageId)

  const addNonTranslation = useAddNonTranslationGoal()
  const updateNonTranslation = useUpdateNonTranslationGoal()
  const deleteNonTranslation = useDeleteNonTranslationGoal(projectId)

  // States for Editing/Adding Capacity
  const [editingCapacityId, setEditingCapacityId] = useState<string | null>(null)
  const [capFiscalYear, setCapFiscalYear] = useState(new Date().getFullYear())
  const [capTranslators, setCapTranslators] = useState(3)
  const [capVerses, setCapVerses] = useState(15)
  const [capWorkDays, setCapWorkDays] = useState(240)

  // States for Editing/Adding Outcome
  const [editingOutcomeId, setEditingOutcomeId] = useState<string | null>(null)
  const [outName, setOutName] = useState('')
  const [outIndicator, setOutIndicator] = useState('')
  const [outMethod, setOutMethod] = useState('')

  // States for Editing/Adding Translation Goal
  const [selectedBookId, setSelectedBookId] = useState('')
  const [transDifficulty, setTransDifficulty] = useState(3)
  const [transVerses, setTransVerses] = useState(0)
  const [transNotes, setTransNotes] = useState('')
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null)

  // States for Editing/Adding Non-Translation Goal
  const [nonTransName, setNonTransName] = useState('')
  const [nonTransOutcomeId, setNonTransOutcomeId] = useState('')
  const [nonTransBookId, setNonTransBookId] = useState('')
  const [nonTransForm, setNonTransForm] = useState('Video')
  const [nonTransTarget, setNonTransTarget] = useState(1)
  const [nonTransDate, setNonTransDate] = useState('')
  const [nonTransIndicator, setNonTransIndicator] = useState('')
  const [nonTransMethod, setNonTransMethod] = useState('')

  // Helper: Calculate progress percentage of a book based on step weights
  const calculateProgress = (goal: any) => {
    let totalWeight = 0
    let earnedWeight = 0

    steps.forEach(step => {
      totalWeight += step.weight_percentage || 0
      const prog = goal.project_translation_progress?.find((p: any) => p.step_name === step.step_name)
      if (prog) {
        if (prog.status === 'completed') {
          earnedWeight += step.weight_percentage || 0
        } else if (prog.status === 'on_going') {
          earnedWeight += (step.weight_percentage || 0) * 0.5
        }
      }
    })

    if (totalWeight === 0) return 0
    return Math.round((earnedWeight / totalWeight) * 100)
  }

  // --- Capacity Handlers ---
  const handleSaveCapacity = () => {
    if (editingCapacityId) {
      updateCapacity.mutate({
        id: editingCapacityId,
        payload: {
          fiscal_year: capFiscalYear,
          num_translators: capTranslators,
          team_verses_per_day: capVerses,
          work_days_per_year: capWorkDays
        }
      })
      setEditingCapacityId(null)
    } else {
      if (capacityList.some(c => c.fiscal_year === capFiscalYear)) {
        alert('Tahun fiskal ini sudah terdaftar!')
        return
      }
      addCapacity.mutate({
        project_language_id: projectLanguageId,
        fiscal_year: capFiscalYear,
        num_translators: capTranslators,
        team_verses_per_day: capVerses,
        work_days_per_year: capWorkDays
      })
    }
  }

  // --- Outcome Handlers ---
  const handleSaveOutcome = () => {
    if (!outName.trim()) return
    if (editingOutcomeId) {
      updateOutcome.mutate({
        id: editingOutcomeId,
        payload: {
          outcome_name: outName,
          indicator_of_change: outIndicator,
          measurement_method: outMethod
        }
      })
      setEditingOutcomeId(null)
    } else {
      addOutcome.mutate({
        project_id: projectId,
        project_language_id: projectLanguageId,
        outcome_name: outName,
        indicator_of_change: outIndicator,
        measurement_method: outMethod
      })
    }
    setOutName('')
    setOutIndicator('')
    setOutMethod('')
  }

  // --- Translation Goal Handlers ---
  const handleAddTranslationGoal = () => {
    if (!selectedBookId) return
    const book = books.find(b => b.id === selectedBookId)
    if (translationList.some(t => t.books_id === selectedBookId)) {
      alert('Kitab ini sudah direncanakan!')
      return
    }
    addTranslation.mutate({
      project_language_id: projectLanguageId,
      books_id: selectedBookId,
      difficulty: transDifficulty,
      planned_verses_count: transVerses || book?.total_verses || 0,
      notes: transNotes
    })
    setSelectedBookId('')
    setTransVerses(0)
    setTransNotes('')
  }

  // --- Non-Translation Goal Handlers ---
  const handleAddNonTranslationGoal = () => {
    if (!nonTransName.trim()) return
    addNonTranslation.mutate({
      project_id: projectId,
      project_language_id: projectLanguageId,
      output_goal_name: nonTransName,
      project_outcome_id: nonTransOutcomeId || null,
      book_id: nonTransBookId || null,
      product_form: nonTransForm,
      target_quantity: nonTransTarget,
      planned_date: nonTransDate || null,
      achievement_indicator: nonTransIndicator,
      measurement_method: nonTransMethod
    })
    setNonTransName('')
    setNonTransOutcomeId('')
    setNonTransBookId('')
    setNonTransForm('Video')
    setNonTransTarget(1)
    setNonTransDate('')
    setNonTransIndicator('')
    setNonTransMethod('')
  }

  const subTabs = [
    { id: 'capacity', name: 'Kapasitas Tim', icon: Users },
    { id: 'outcomes', name: 'Outcomes (Dampak)', icon: Award },
    { id: 'translation', name: 'Rencana Kitab', icon: BookOpen },
    { id: 'nontranslation', name: 'Target Outputs', icon: Layers }
  ]

  return (
    <div className='space-y-6'>
      {/* Sub Tab Buttons */}
      <div className='flex flex-wrap gap-2 border-b border-[hsl(var(--border))]/50 pb-2'>
        {subTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] font-bold border border-[hsl(var(--primary))]/30'
                : 'text-muted-foreground hover:bg-[hsl(var(--muted))]/50 hover:text-foreground'
            }`}
          >
            <tab.icon size={14} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* TAB 1: TEAM CAPACITY */}
      {activeTab === 'capacity' && (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300'>
          <div className='space-y-4'>
            <Card className='p-6 space-y-5'>
              <h3 className='text-lg font-bold text-foreground'>
                {editingCapacityId ? 'Edit Kapasitas Tim' : 'Tambah Kapasitas Tahunan'}
              </h3>
              <div className='space-y-4'>
                <Input
                  id='cap-fy'
                  label='Tahun Fiskal'
                  type='number'
                  value={capFiscalYear}
                  onChange={e => setCapFiscalYear(parseInt(e.target.value))}
                />
                <Input
                  id='cap-translators'
                  label='Jumlah Penerjemah'
                  type='number'
                  value={capTranslators}
                  onChange={e => setCapTranslators(parseInt(e.target.value))}
                />
                <Input
                  id='cap-verses'
                  label='Target Ayat per Hari'
                  type='number'
                  value={capVerses}
                  onChange={e => setCapVerses(parseInt(e.target.value))}
                />
                <Input
                  id='cap-days'
                  label='Hari Kerja per Tahun'
                  type='number'
                  value={capWorkDays}
                  onChange={e => setCapWorkDays(parseInt(e.target.value))}
                />
                <div className='bg-[hsl(var(--subtle))] rounded-lg p-3 border border-[hsl(var(--border))] text-xs text-muted-foreground space-y-1'>
                  <span className='font-bold text-foreground block mb-1'>Perkiraan Output Tahunan:</span>
                  {(capTranslators * capVerses * capWorkDays).toLocaleString()} ayat / tahun
                </div>
              </div>
              <div className='flex gap-2 pt-2'>
                <Button variant='primary' onClick={handleSaveCapacity} className='w-full'>
                  {editingCapacityId ? 'Perbarui' : 'Simpan'}
                </Button>
                {editingCapacityId && (
                  <Button variant='outline' onClick={() => setEditingCapacityId(null)}>
                    Batal
                  </Button>
                )}
              </div>
            </Card>
          </div>

          <div className='lg:col-span-2 space-y-4'>
            <Card className='p-6 overflow-x-auto'>
              <h3 className='text-lg font-bold text-foreground mb-4'>Kapasitas Tim per Tahun Fiskal</h3>
              {capLoading ? (
                <div className='text-center p-6 text-muted-foreground'>Memuat kapasitas tim...</div>
              ) : capacityList.length === 0 ? (
                <div className='text-center py-12 text-muted-foreground border border-dashed rounded-lg border-[hsl(var(--border))]'>
                  Belum ada data kapasitas tahun fiskal. Silakan tambahkan data di samping.
                </div>
              ) : (
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-[hsl(var(--border))] text-muted-foreground font-bold'>
                      <th className='pb-3'>Tahun Fiskal</th>
                      <th className='pb-3'>Penerjemah</th>
                      <th className='pb-3'>Ayat / Hari</th>
                      <th className='pb-3'>Hari Kerja / Thn</th>
                      <th className='pb-3'>Total Kapasitas</th>
                      <th className='pb-3 text-right'>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {capacityList.map(cap => (
                      <tr key={cap.id} className='border-b border-[hsl(var(--border))]/50 hover:bg-[hsl(var(--subtle))] transition-colors'>
                        <td className='py-3 font-semibold text-foreground'>FY {cap.fiscal_year}</td>
                        <td className='py-3'>{cap.num_translators} orang</td>
                        <td className='py-3'>{cap.team_verses_per_day} ayat</td>
                        <td className='py-3'>{cap.work_days_per_year} hari</td>
                        <td className='py-3 font-bold text-primary'>
                          {(cap.num_translators * cap.team_verses_per_day * cap.work_days_per_year).toLocaleString()} ayat / thn
                        </td>
                        <td className='py-3 text-right space-x-2'>
                          <button
                            onClick={() => {
                              setEditingCapacityId(cap.id)
                              setCapFiscalYear(cap.fiscal_year)
                              setCapTranslators(cap.num_translators)
                              setCapVerses(cap.team_verses_per_day)
                              setCapWorkDays(cap.work_days_per_year)
                            }}
                            className='p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--muted))] transition-all'
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Hapus kapasitas tahun fiskal ini?')) {
                                deleteCapacity.mutate(cap.id)
                              }
                            }}
                            className='p-1.5 rounded text-danger hover:bg-danger-soft transition-all'
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: OUTCOMES */}
      {activeTab === 'outcomes' && (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300'>
          <div className='space-y-4'>
            <Card className='p-6 space-y-4'>
              <h3 className='text-lg font-bold text-foreground'>
                {editingOutcomeId ? 'Edit Outcome' : 'Tambah Outcome Baru'}
              </h3>
              <div className='space-y-4'>
                <Input
                  id='out-name'
                  label='Judul Outcome (Dampak)'
                  placeholder='Misal: Gereja menggunakan bahasa Ndom'
                  value={outName}
                  onChange={e => setOutName(e.target.value)}
                />
                <Input
                  id='out-indicator'
                  label='Indikator Perubahan (Indicator of Change)'
                  placeholder='Misal: Pastor memimpin ibadah dalam bahasa Ndom'
                  value={outIndicator}
                  onChange={e => setOutIndicator(e.target.value)}
                />
                <Input
                  id='out-method'
                  label='Cara Mengukur (Measurement Method)'
                  placeholder='Misal: Pengamatan bulanan & wawancara jemaat'
                  value={outMethod}
                  onChange={e => setOutMethod(e.target.value)}
                />
              </div>
              <div className='flex gap-2 pt-2'>
                <Button variant='primary' onClick={handleSaveOutcome} className='w-full'>
                  {editingOutcomeId ? 'Perbarui' : 'Simpan'}
                </Button>
                {editingOutcomeId && (
                  <Button variant='outline' onClick={() => setEditingOutcomeId(null)}>
                    Batal
                  </Button>
                )}
              </div>
            </Card>
          </div>

          <div className='lg:col-span-2 space-y-4'>
            <Card className='p-6 overflow-x-auto'>
              <h3 className='text-lg font-bold text-foreground mb-4'>Outcome & Indikator Dampak Proyek</h3>
              {outLoading ? (
                <div className='text-center p-6 text-muted-foreground'>Memuat outcomes...</div>
              ) : outcomeList.length === 0 ? (
                <div className='text-center py-12 text-muted-foreground border border-dashed rounded-lg border-[hsl(var(--border))]'>
                  Belum ada data Outcome proyek. Silakan tambahkan dampak rencana di samping.
                </div>
              ) : (
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-[hsl(var(--border))] text-muted-foreground font-bold'>
                      <th className='pb-3 w-1/3'>Outcome</th>
                      <th className='pb-3 w-1/3'>Indikator Perubahan</th>
                      <th className='pb-3 w-1/4'>Cara Mengukur</th>
                      <th className='pb-3 text-right'>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outcomeList.map(out => (
                      <tr key={out.id} className='border-b border-[hsl(var(--border))]/50 hover:bg-[hsl(var(--subtle))] transition-colors'>
                        <td className='py-3 font-semibold text-foreground vertical-top'>{out.outcome_name}</td>
                        <td className='py-3 text-muted-foreground text-xs vertical-top'>{out.indicator_of_change || '-'}</td>
                        <td className='py-3 text-muted-foreground text-xs vertical-top'>{out.measurement_method || '-'}</td>
                        <td className='py-3 text-right space-x-2 vertical-top'>
                          <button
                            onClick={() => {
                              setEditingOutcomeId(out.id)
                              setOutName(out.outcome_name)
                              setOutIndicator(out.indicator_of_change || '')
                              setOutMethod(out.measurement_method || '')
                            }}
                            className='p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--muted))] transition-all'
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Hapus outcome ini? Beberapa output goals mungkin kehilangan relasi.')) {
                                deleteOutcome.mutate(out.id)
                              }
                            }}
                            className='p-1.5 rounded text-danger hover:bg-danger-soft transition-all'
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* TAB 3: TRANSLATION PLAN (KITAB) */}
      {activeTab === 'translation' && (
        <div className='space-y-6 animate-in fade-in duration-300'>
          <Card className='p-6'>
            <h3 className='text-lg font-bold text-foreground mb-4'>Tambah Perencanaan Kitab (Translation Goal)</h3>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4 items-end'>
              <div>
                <label className='block text-xs font-bold text-muted-foreground uppercase mb-1.5'>Pilih Kitab</label>
                <select
                  className='w-full bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[hsl(var(--primary))] text-foreground'
                  value={selectedBookId}
                  onChange={e => {
                    const bookId = e.target.value
                    setSelectedBookId(bookId)
                    const book = books.find(b => b.id === bookId)
                    if (book) setTransVerses(book.total_verses || 0)
                  }}
                >
                  <option value=''>-- Pilih Kitab --</option>
                  {books.map(book => (
                    <option key={book.id} value={book.id}>
                      {book.kitab} (Pasal {book.chapter})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Input
                  id='trans-diff'
                  label='Tingkat Kesulitan (1 - 5)'
                  type='number'
                  value={transDifficulty}
                  onChange={e => setTransDifficulty(parseInt(e.target.value))}
                  min={1}
                  max={5}
                />
              </div>
              <div>
                <Input
                  id='trans-verses'
                  label='Jumlah Ayat Proyek'
                  type='number'
                  value={transVerses}
                  onChange={e => setTransVerses(parseInt(e.target.value))}
                />
              </div>
              <div>
                <Button variant='primary' onClick={handleAddTranslationGoal} className='w-full h-[38px]'>
                  Tambahkan Kitab
                </Button>
              </div>
            </div>
          </Card>

          <Card className='p-6 space-y-4'>
            <h3 className='text-lg font-bold text-foreground'>Kemajuan Penerjemahan Kitab</h3>
            {transLoading ? (
              <div className='text-center p-6 text-muted-foreground'>Memuat rencana terjemahan...</div>
            ) : translationList.length === 0 ? (
              <div className='text-center py-12 text-muted-foreground border border-dashed rounded-lg border-[hsl(var(--border))]'>
                Belum ada kitab yang direncanakan. Silakan gunakan form di atas untuk menjadwalkan kitab.
              </div>
            ) : (
              <div className='space-y-4'>
                {translationList.map(goal => {
                  const progPct = calculateProgress(goal)
                  const isExpanded = expandedGoalId === goal.id

                  return (
                    <div
                      key={goal.id}
                      className='border border-[hsl(var(--border))] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md'
                    >
                      <div
                        onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
                        className='p-4 bg-[hsl(var(--subtle))]/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-[hsl(var(--subtle))] transition-colors'
                      >
                        <div className='flex items-center gap-3 min-w-0'>
                          <div className='w-10 h-10 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] rounded-full flex items-center justify-center font-bold shrink-0'>
                            {goal.books?.kitab?.[0] || 'K'}
                          </div>
                          <div>
                            <h4 className='font-bold text-foreground'>
                              {goal.books?.kitab || 'Kitab'} (Pasal {goal.books?.chapter || '-'})
                            </h4>
                            <p className='text-xs text-muted-foreground mt-0.5'>
                              Target: <strong>{goal.planned_verses_count} ayat</strong> · Kesulitan:{' '}
                              <strong>{goal.difficulty}/5</strong>
                            </p>
                          </div>
                        </div>

                        <div className='flex items-center gap-3 w-full md:w-64 shrink-0'>
                          <div className='flex-1 h-2 bg-[hsl(var(--muted))]/60 rounded-full overflow-hidden'>
                            <div
                              className='h-full bg-linear-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-hover))] transition-all duration-500 ease-out'
                              style={{ width: `${progPct}%` }}
                            />
                          </div>
                          <span className='text-xs font-bold text-foreground w-10 text-right'>{progPct}%</span>
                        </div>

                        <div className='flex items-center gap-3 shrink-0 ml-auto md:ml-0'>
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              if (confirm('Hapus kitab ini dari rencana?')) {
                                deleteTranslation.mutate(goal.id)
                              }
                            }}
                            className='p-1.5 rounded text-danger hover:bg-danger-soft transition-all'
                            title='Hapus Kitab'
                          >
                            <Trash2 size={14} />
                          </button>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className='p-5 border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-300'>
                          <div className='md:col-span-2 space-y-4'>
                            <h5 className='text-xs font-extrabold uppercase tracking-wider text-muted-foreground'>
                              Tahapan Proses Penerjemahan
                            </h5>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5'>
                              {steps.map(step => {
                                const prog = goal.project_translation_progress?.find(
                                  (p: any) => p.step_name === step.step_name
                                )
                                const status = prog?.status || 'not_started'

                                return (
                                  <div
                                    key={step.id}
                                    className='flex flex-col p-3 border border-[hsl(var(--border))]/70 rounded-lg space-y-2'
                                  >
                                    <div className='flex justify-between items-start'>
                                      <span className='text-xs font-bold text-foreground leading-tight'>
                                        {step.step_name}
                                      </span>
                                      <Badge
                                        variant={
                                          status === 'completed'
                                            ? 'success'
                                            : status === 'on_going'
                                              ? 'info'
                                              : 'muted'
                                        }
                                      >
                                        {status === 'completed'
                                          ? 'Selesai'
                                          : status === 'on_going'
                                            ? 'On Going'
                                            : 'Belum Mulai'}
                                      </Badge>
                                    </div>

                                    <div className='flex gap-1.5 pt-1.5 border-t border-[hsl(var(--border))]/50'>
                                      {(['not_started', 'on_going', 'completed'] as const).map(st => (
                                        <button
                                          key={st}
                                          onClick={() => {
                                            if (prog) {
                                              updateProgress.mutate({
                                                id: prog.id,
                                                payload: { status: st }
                                              })
                                            }
                                          }}
                                          className={`flex-1 text-[10px] py-1 px-1.5 font-bold rounded text-center transition-all cursor-pointer ${
                                            status === st
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
                                      ))}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          <div className='space-y-3'>
                            <h5 className='text-xs font-extrabold uppercase tracking-wider text-muted-foreground'>
                              Catatan Kitab
                            </h5>
                            <textarea
                              className='w-full h-32 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] text-sm rounded-lg p-3 focus:outline-none focus:border-[hsl(var(--primary))] text-foreground resize-none'
                              placeholder='Tambahkan catatan khusus untuk kitab ini...'
                              defaultValue={goal.notes || ''}
                              onBlur={e => {
                                if (e.target.value !== goal.notes) {
                                  updateTranslation.mutate({
                                    id: goal.id,
                                    payload: { notes: e.target.value }
                                  })
                                }
                              }}
                            />
                            <p className='text-[10px] text-muted-foreground italic'>
                              * Catatan akan tersimpan otomatis saat Anda mengetik di luar area kotak teks (onBlur).
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 4: NON-TRANSLATION TARGETS (OUTPUTS) */}
      {activeTab === 'nontranslation' && (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300'>
          <div className='space-y-4'>
            <Card className='p-6 space-y-4'>
              <h3 className='text-lg font-bold text-foreground'>Tambah Target Output Baru</h3>
              <div className='space-y-4'>
                <Input
                  id='non-name'
                  label='Nama Target / Output'
                  placeholder='Misal: Video Cerita Alkitab (Lukas 1)'
                  value={nonTransName}
                  onChange={e => setNonTransName(e.target.value)}
                />
                <div>
                  <label className='block text-xs font-bold text-muted-foreground uppercase mb-1.5'>Outcome Induk</label>
                  <select
                    className='w-full bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[hsl(var(--primary))] text-foreground'
                    value={nonTransOutcomeId}
                    onChange={e => setNonTransOutcomeId(e.target.value)}
                  >
                    <option value=''>-- Pilih Outcome --</option>
                    {outcomeList.map(out => (
                      <option key={out.id} value={out.id}>
                        {out.outcome_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-xs font-bold text-muted-foreground uppercase mb-1.5'>Terkait Kitab (Opsional)</label>
                  <select
                    className='w-full bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[hsl(var(--primary))] text-foreground'
                    value={nonTransBookId}
                    onChange={e => setNonTransBookId(e.target.value)}
                  >
                    <option value=''>-- Pilih Kitab --</option>
                    {books.map(book => (
                      <option key={book.id} value={book.id}>
                        {book.kitab} (Pasal {book.chapter})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-xs font-bold text-muted-foreground uppercase mb-1.5'>Format Produk</label>
                  <select
                    className='w-full bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[hsl(var(--primary))] text-foreground'
                    value={nonTransForm}
                    onChange={e => setNonTransForm(e.target.value)}
                  >
                    <option value='Video'>Video</option>
                    <option value='Audio'>Audio</option>
                    <option value='Print'>Print (Cetak)</option>
                    <option value='Digital'>Digital (Softcopy)</option>
                  </select>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <Input
                    id='non-target'
                    label='Kuantitas Target'
                    type='number'
                    value={nonTransTarget}
                    onChange={e => setNonTransTarget(parseInt(e.target.value))}
                  />
                  <Input
                    id='non-date'
                    label='Rencana Selesai'
                    type='date'
                    value={nonTransDate}
                    onChange={e => setNonTransDate(e.target.value)}
                  />
                </div>
                <Input
                  id='non-indicator'
                  label='Indikator Keberhasilan'
                  placeholder='Misal: Disetujui oleh konsultan penerjemahan'
                  value={nonTransIndicator}
                  onChange={e => setNonTransIndicator(e.target.value)}
                />
                <Input
                  id='non-method'
                  label='Cara Mengukur'
                  placeholder='Misal: Laporan distribusi & penayangan'
                  value={nonTransMethod}
                  onChange={e => setNonTransMethod(e.target.value)}
                />
              </div>
              <div className='pt-2'>
                <Button variant='primary' onClick={handleAddNonTranslationGoal} className='w-full'>
                  Simpan Target Output
                </Button>
              </div>
            </Card>
          </div>

          <div className='lg:col-span-2 space-y-4'>
            <Card className='p-6 overflow-x-auto'>
              <h3 className='text-lg font-bold text-foreground mb-4'>Daftar Target Output & Deliverables</h3>
              {nonTransLoading ? (
                <div className='text-center p-6 text-muted-foreground'>Memuat target outputs...</div>
              ) : nonTranslationList.length === 0 ? (
                <div className='text-center py-12 text-muted-foreground border border-dashed rounded-lg border-[hsl(var(--border))]'>
                  Belum ada target non-terjemahan (outputs) yang dibuat. Silakan tambahkan target di samping.
                </div>
              ) : (
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-[hsl(var(--border))] text-muted-foreground font-bold'>
                      <th className='pb-3'>Target Output</th>
                      <th className='pb-3'>Outcome Induk</th>
                      <th className='pb-3'>Format</th>
                      <th className='pb-3'>Kuantitas</th>
                      <th className='pb-3'>Rencana Selesai</th>
                      <th className='pb-3 text-right'>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nonTranslationList.map(item => (
                      <tr key={item.id} className='border-b border-[hsl(var(--border))]/50 hover:bg-[hsl(var(--subtle))] transition-colors'>
                        <td className='py-3 font-semibold text-foreground vertical-top'>
                          {item.output_goal_name}
                          {item.books && (
                            <span className='block text-[10px] text-primary mt-0.5 font-bold'>
                              Terkait: {item.books.kitab}
                            </span>
                          )}
                        </td>
                        <td className='py-3 text-xs text-muted-foreground vertical-top'>
                          {item.project_outcomes?.outcome_name || '-'}
                        </td>
                        <td className='py-3 vertical-top'>
                          <Badge variant='info'>{item.product_form || 'Video'}</Badge>
                        </td>
                        <td className='py-3 font-bold text-foreground vertical-top'>{item.target_quantity} unit</td>
                        <td className='py-3 text-xs vertical-top'>
                          {item.planned_date ? new Date(item.planned_date).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : '-'}
                        </td>
                        <td className='py-3 text-right vertical-top'>
                          <button
                            onClick={() => {
                              if (confirm('Hapus target output ini?')) {
                                deleteNonTranslation.mutate(item.id)
                              }
                            }}
                            className='p-1.5 rounded text-danger hover:bg-danger-soft transition-all'
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
