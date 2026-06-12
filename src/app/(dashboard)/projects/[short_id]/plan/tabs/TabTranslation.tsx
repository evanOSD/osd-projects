import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/app/(dashboard)/dummy/Buttons'
import { Input } from '@/app/(dashboard)/dummy/Forms'
import { Badge } from '@/app/(dashboard)/dummy/Badges'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table'
import { Download, Maximize2, Minimize2, Plus, ChevronDown, ChevronRight, Trash2 } from 'lucide-react'
import { useProjectDetailContext } from '../../layout'
import { 
  useTranslationGoals,
  useAddTranslationGoal,
  useUpdateTranslationGoal,
  useDeleteTranslationGoal,
  useUpdateTranslationProgress
} from '@/hooks/queries/database/useProjectPlan'
import toast from 'react-hot-toast'
import TranslationGoalSelectionModal, { SelectedItems } from './components/TranslationGoalSelectionModal'

interface TabTranslationProps {
  selectedPlanId: string | null
}

export default function TabTranslation({ selectedPlanId }: TabTranslationProps) {
  const { projectLanguage, books, steps } = useProjectDetailContext()
  const projectLanguageId = projectLanguage?.id || ''

  const { data: translationList = [], isLoading: transLoading } = useTranslationGoals(projectLanguageId)
  
  const addTranslation = useAddTranslationGoal()
  const updateTranslation = useUpdateTranslationGoal()
  const deleteTranslation = useDeleteTranslationGoal(projectLanguageId)
  const updateProgress = useUpdateTranslationProgress(projectLanguageId)

  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!selectedPlanId) return null

  const filteredGoals = translationList.filter(t => t.project_plan_id === selectedPlanId)

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const expandAll = () => {
    const newExpanded: Record<string, boolean> = {}
    filteredGoals.forEach(g => newExpanded[g.id] = true)
    setExpandedRows(newExpanded)
  }

  const collapseAll = () => {
    setExpandedRows({})
  }

  const handleSaveSelections = async (selections: SelectedItems) => {
    if (!selectedPlanId) return
    if (!projectLanguageId) {
      toast.error('Gagal: Anda belum mengatur Bahasa untuk Proyek ini. Silakan atur di bagian pengaturan proyek terlebih dahulu.', { id: 'no-project-language' })
      return
    }

    try {
      const promises = []

      // 1. Save Books
      for (const book of selections.books) {
        promises.push(addTranslation.mutateAsync({
          project_language_id: projectLanguageId,
          project_plan_id: selectedPlanId,
          books_id: book.id,
          planned_verses_count: book.total_verses || 0,
          difficulty: 3,
          notes: null
        }))
      }

      // 2. Save Passages
      for (const passage of selections.passages) {
        const parentBook = books.find(b => b.kitab === passage.kitab || b.book_name === passage.book || b.book_code === passage.book)
        promises.push(addTranslation.mutateAsync({
          project_language_id: projectLanguageId,
          project_plan_id: selectedPlanId,
          books_id: parentBook?.id || null,
          passages_id: passage.id,
          planned_verses_count: passage.total_verses || 0,
          difficulty: 3,
          notes: null
        }))
      }

      // 3. Save Stories
      for (const story of selections.stories) {
        const parentBook = books.find(b => b.kitab === story.book_reference || b.book_name === story.book_reference || b.book_code === story.book_reference)
        let versesCount = 0
        if (story.verse_mapping && typeof story.verse_mapping === 'object') {
          versesCount = Object.values(story.verse_mapping).reduce((acc: number, curr: any) => acc + (Array.isArray(curr) ? curr.length : 0), 0)
        }
        promises.push(addTranslation.mutateAsync({
          project_language_id: projectLanguageId,
          project_plan_id: selectedPlanId,
          books_id: parentBook?.id || null,
          stories_id: story.id,
          planned_verses_count: versesCount,
          difficulty: 3,
          notes: null
        }))
      }

      await Promise.all(promises)
      toast.success('Berhasil menambahkan target terjemahan', { id: 'save-selections-success' })
      setIsModalOpen(false)
    } catch (e) {
      toast.error('Gagal menambahkan beberapa target', { id: 'save-selections-error' })
    }
  }

  return (
    <div className='space-y-6 animate-in fade-in duration-300 pb-12'>
      <div>
        <h2 className='text-2xl font-semibold text-foreground tracking-tight'>Book Selection</h2>
      </div>

      <div className='flex items-center gap-3'>
        <Button variant='primary' size='sm' onClick={() => setIsModalOpen(true)} className='flex items-center gap-2'>
          <Plus size={14} /> Tambah Kitab Baru
        </Button>
        <Button variant='outline' size='sm' className='flex items-center gap-2'>
          <Download size={14} /> Export
        </Button>
        <Button variant='outline' size='sm' onClick={expandAll} className='flex items-center gap-2'>
          <Maximize2 size={14} /> Expand all Rows
        </Button>
        <Button variant='outline' size='sm' onClick={collapseAll} className='flex items-center gap-2'>
          <Minimize2 size={14} /> Collapse Rows
        </Button>
      </div>

      <Card className='overflow-hidden border border-[hsl(var(--border))]'>
        <Table>
          <TableHeader>
            <TableRow className='bg-[hsl(var(--muted))]/30'>
              <TableHead className='font-bold text-[11px] uppercase w-[5%]'></TableHead>
              <TableHead className='font-bold text-[11px] uppercase w-[15%]'>Book</TableHead>
              <TableHead className='font-bold text-[11px] uppercase w-[10%]'>Chapters</TableHead>
              <TableHead className='font-bold text-[11px] uppercase w-[15%]'>Level of Difficulty</TableHead>
              <TableHead className='font-bold text-[11px] uppercase w-[15%]'>Verses in Book</TableHead>
              <TableHead className='font-bold text-[11px] uppercase w-[15%]'>Verses in Project</TableHead>
              <TableHead className='font-bold text-[11px] uppercase w-[20%]'>Notes</TableHead>
              <TableHead className='font-bold text-[11px] uppercase w-[5%] text-right'>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center p-6 text-muted-foreground animate-pulse">Memuat rencana kitab...</TableCell>
              </TableRow>
            ) : filteredGoals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center p-6 text-muted-foreground">Belum ada kitab yang direncanakan.</TableCell>
              </TableRow>
            ) : (
              filteredGoals.map(goal => (
                <React.Fragment key={goal.id}>
                  <TableRow className='hover:bg-[hsl(var(--muted))]/10 transition-colors'>
                    <TableCell className='align-middle'>
                      <button onClick={() => toggleRow(goal.id)} className='p-1 hover:bg-[hsl(var(--muted))]/50 rounded'>
                        {expandedRows[goal.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                    </TableCell>
                    <TableCell className='align-middle font-medium text-xs'>
                      {goal.passages?.judul_perikop || goal.passages?.passage_title || goal.passages?.passage_reference ? (
                        <span>{goal.books?.kitab || 'Kitab'} <span className="text-muted-foreground italic block">{goal.passages.judul_perikop || goal.passages.passage_title || goal.passages.passage_reference}</span></span>
                      ) : goal.stories?.judul_cerita || goal.stories?.story_title ? (
                        <span>{goal.books?.kitab || 'Kitab'} <span className="text-muted-foreground italic block">{goal.stories.judul_cerita || goal.stories.story_title}</span></span>
                      ) : (
                        goal.books?.kitab || 'Kitab'
                      )}
                    </TableCell>
                    <TableCell className='align-middle text-xs'>
                      {goal.passages ? '-' : goal.stories ? '-' : goal.books?.chapter || '-'}
                    </TableCell>
                    <TableCell className='align-middle text-xs'>
                      <input 
                        type="number"
                        min="1" max="5"
                        className="w-16 p-1 border rounded bg-transparent focus:outline-primary text-center"
                        defaultValue={goal.difficulty || 3}
                        onBlur={e => {
                          const val = parseInt(e.target.value)
                          if (!isNaN(val) && val !== goal.difficulty) {
                            updateTranslation.mutate({ id: goal.id, payload: { difficulty: val } })
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className='align-middle text-xs'>
                      {goal.passages?.total_verses?.toLocaleString() || goal.books?.total_verses?.toLocaleString() || '-'}
                    </TableCell>
                    <TableCell className='align-middle text-xs'>
                      <input 
                        type="number"
                        min="0"
                        className="w-20 p-1 border rounded bg-transparent focus:outline-primary"
                        defaultValue={goal.planned_verses_count || 0}
                        onBlur={e => {
                          const val = parseInt(e.target.value)
                          if (!isNaN(val) && val !== goal.planned_verses_count) {
                            updateTranslation.mutate({ id: goal.id, payload: { planned_verses_count: val } })
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className='align-middle text-xs'>
                      <input 
                        type="text"
                        className="w-full p-1 border border-transparent hover:border-[hsl(var(--border))] focus:border-[hsl(var(--primary))] rounded bg-transparent focus:outline-none"
                        defaultValue={goal.notes || ''}
                        placeholder="Klik untuk tambah catatan..."
                        onBlur={e => {
                          if (e.target.value !== goal.notes) {
                            updateTranslation.mutate({ id: goal.id, payload: { notes: e.target.value } })
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className='align-middle text-right'>
                      <button 
                        onClick={() => {
                          if(confirm('Hapus kitab ini dari rencana?')) deleteTranslation.mutate(goal.id)
                        }} 
                        className='text-[10px] font-bold text-danger hover:underline'
                      >
                        Hapus
                      </button>
                    </TableCell>
                  </TableRow>
                  
                  {/* EXPANDED ROW FOR PROGRESS */}
                  {expandedRows[goal.id] && (
                    <TableRow className="bg-[hsl(var(--subtle))]/20">
                      <TableCell colSpan={8} className="p-0 border-b">
                        <div className="p-6 border-l-4 border-l-primary/50 m-2 rounded-lg bg-[hsl(var(--card))] shadow-sm">
                          <h5 className='text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-4'>
                            Tahapan Proses Penerjemahan ({goal.books?.kitab})
                          </h5>
                          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3'>
                            {steps.map((step: any) => {
                              const prog = goal.project_translation_progress?.find((p: any) => p.step_name === step.step_name)
                              const status = prog?.status || 'not_started'

                              return (
                                <div key={step.id} className='flex flex-col p-2.5 border border-[hsl(var(--border))]/70 rounded bg-[hsl(var(--surface))]'>
                                  <div className='flex justify-between items-start mb-2'>
                                    <span className='text-[10px] font-bold text-foreground leading-tight line-clamp-2'>
                                      {step.step_name}
                                    </span>
                                  </div>
                                  <select
                                    className={`mt-auto text-[10px] p-1 font-bold rounded border focus:outline-none cursor-pointer ${
                                      status === 'completed'
                                        ? 'bg-[hsl(var(--success-soft))] text-[hsl(var(--success))] border-[hsl(var(--success))]/30'
                                        : status === 'on_going'
                                          ? 'bg-[hsl(var(--info-soft))] text-[hsl(var(--info))] border-[hsl(var(--info))]/30'
                                          : 'bg-[hsl(var(--muted))] text-muted-foreground border-[hsl(var(--border))]/30'
                                    }`}
                                    value={status}
                                    onChange={e => {
                                      if (prog) {
                                        updateProgress.mutate({ id: prog.id, payload: { status: e.target.value as any } })
                                      }
                                    }}
                                  >
                                    <option value="not_started">Belum Mulai</option>
                                    <option value="on_going">On Going</option>
                                    <option value="completed">Selesai</option>
                                  </select>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <TranslationGoalSelectionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSelections}
        books={books}
      />
    </div>
  )
}
