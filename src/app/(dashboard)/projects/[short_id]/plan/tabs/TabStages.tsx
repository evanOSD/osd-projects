import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/app/(dashboard)/dummy/Buttons'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table'
import { Download, Maximize2, Minimize2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useProjectDetailContext } from '../../layout'
import { 
  usePlanningStages, 
  useAddPlanningStage, 
  useUpdatePlanningStage, 
  useDeletePlanningStage,
  useTranslationGoals
} from '@/hooks/queries/database/useProjectPlan'

type LocalStage = { id?: string; step_id: string; percentage: number; isDeleted?: boolean }

export default function TabStages() {
  const { projectLanguage, books, steps } = useProjectDetailContext()
  const projectLanguageId = projectLanguage?.id || ''

  const { data: translationList = [] } = useTranslationGoals(projectLanguageId)
  
  const [stagesSelectedGoalId, setStagesSelectedGoalId] = useState<string>('')
  const [localStages, setLocalStages] = useState<LocalStage[]>([])

  const { data: stagesData, isLoading: stagesLoading } = usePlanningStages(stagesSelectedGoalId)
  const stagesList = stagesData || []
  
  const addStage = useAddPlanningStage(stagesSelectedGoalId)
  const updateStage = useUpdatePlanningStage(stagesSelectedGoalId)
  const deleteStage = useDeletePlanningStage(stagesSelectedGoalId)

  useEffect(() => {
    if (stagesData) {
      setLocalStages(
        stagesData.map(s => ({
          id: s.id,
          step_id: s.step_id,
          percentage: Number(s.percentage) || 0
        }))
      )
    } else {
      setLocalStages([])
    }
  }, [stagesData, stagesSelectedGoalId])

  const isStagesChanged = JSON.stringify(localStages) !== JSON.stringify(stagesList.map(s => ({
    id: s.id,
    step_id: s.step_id,
    percentage: Number(s.percentage) || 0
  })))

  const handleCancelStages = () => {
    if (stagesList) {
      setLocalStages(
        stagesList.map(s => ({
          id: s.id,
          step_id: s.step_id,
          percentage: Number(s.percentage) || 0
        }))
      )
    }
  }

  const handleSaveStages = async () => {
    if (!stagesSelectedGoalId) return

    for (const stage of localStages) {
      if (stage.isDeleted && stage.id) {
        await deleteStage.mutateAsync(stage.id)
      } else if (!stage.id && !stage.isDeleted) {
        await addStage.mutateAsync({
          translation_goal_id: stagesSelectedGoalId,
          step_id: stage.step_id,
          percentage: stage.percentage
        })
      } else if (stage.id && !stage.isDeleted) {
        const original = stagesList.find(s => s.id === stage.id)
        if (original && Number(original.percentage) !== stage.percentage) {
          await updateStage.mutateAsync({
            id: stage.id,
            payload: { percentage: stage.percentage }
          })
        }
      }
    }
    toast.success('Tahapan Perencanaan berhasil disimpan!')
  }

  const totalPercentage = localStages.filter(s => !s.isDeleted).reduce((acc, item) => acc + item.percentage, 0)

  return (
    <div className='space-y-6 animate-in fade-in duration-300 pb-12'>
      <div>
        <h2 className='text-2xl font-semibold text-foreground tracking-tight'>Planning Stages</h2>
        <p className='text-sm text-muted-foreground mt-1'>
          Configure the stages you would like to track and what proportion of the overall initiative each stage makes up.
        </p>
      </div>

      <div className='flex items-center gap-3'>
        <Button variant='outline' size='sm' className='flex items-center gap-2'>
          <Download size={14} /> Export
        </Button>
        <Button variant='outline' size='sm' className='flex items-center gap-2'>
          <Maximize2 size={14} /> Expand all Rows
        </Button>
      </div>

      <div className='max-w-xs'>
        <select
          className='w-full bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-primary transition-colors'
          value={stagesSelectedGoalId}
          onChange={e => setStagesSelectedGoalId(e.target.value)}
        >
          <option value=''>-- Pilih Kitab (Translation Goal) --</option>
          {translationList.map((t: any) => {
            const book = books.find((b: any) => b.id === t.books_id)
            return (
              <option key={t.id} value={t.id}>
                {book?.kitab || 'Unknown Book'}
              </option>
            )
          })}
        </select>
      </div>

      {stagesSelectedGoalId && (
        <Card className='overflow-hidden border border-[hsl(var(--border))]'>
          <Table>
            <TableHeader>
              <TableRow className='bg-[hsl(var(--muted))]/30'>
                <TableHead className='font-bold text-xs uppercase w-[30%]'>Stage Category</TableHead>
                <TableHead className='font-bold text-xs uppercase w-[40%]'>Name</TableHead>
                <TableHead className='font-bold text-xs uppercase w-[20%]'>Percentage</TableHead>
                <TableHead className='font-bold text-xs uppercase text-right w-[10%]'>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stagesLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center p-6 text-muted-foreground animate-pulse">Memuat tahapan...</TableCell>
                </TableRow>
              ) : localStages.filter(s => !s.isDeleted).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center p-6 text-muted-foreground">Belum ada tahapan yang dipilih.</TableCell>
                </TableRow>
              ) : (
                localStages.filter(s => !s.isDeleted).map((stage, index) => {
                  const step = steps.find((s: any) => s.id === stage.step_id)
                  const originalIndex = localStages.findIndex(s => s === stage)

                  return (
                    <TableRow key={index} className='hover:bg-[hsl(var(--muted))]/10 transition-colors'>
                      <TableCell className='align-middle font-medium text-xs'>
                        {step?.step_name || 'Unknown'}
                      </TableCell>
                      <TableCell className='align-middle text-xs text-muted-foreground'>
                        {step?.step_name || 'Unknown'}
                      </TableCell>
                      <TableCell className='align-middle text-xs'>
                        <div className="flex items-center gap-1 w-24">
                          <input 
                            type="number"
                            min="0" max="100"
                            className="w-full p-1 border rounded bg-transparent focus:outline-primary text-right"
                            value={stage.percentage}
                            onChange={e => {
                              const val = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0))
                              setLocalStages(prev => prev.map((p, i) => i === originalIndex ? { ...p, percentage: val } : p))
                            }}
                          />
                          <span className="text-muted-foreground font-bold">%</span>
                        </div>
                      </TableCell>
                      <TableCell className='align-middle text-right'>
                        <button 
                          onClick={() => {
                            setLocalStages(prev => prev.map((p, i) => i === originalIndex ? { ...p, isDeleted: true } : p))
                          }} 
                          className='text-[10px] font-bold text-danger hover:underline'
                        >
                          Hapus
                        </button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
              
              <TableRow>
                <TableCell colSpan={4} className="p-0">
                  <div className="flex items-center">
                    <select
                      className='w-full bg-transparent p-3 text-xs font-bold text-muted-foreground focus:outline-none hover:bg-[hsl(var(--primary))]/5 hover:text-primary transition-colors border-t border-dashed border-[hsl(var(--border))] appearance-none text-center cursor-pointer'
                      onChange={e => {
                        const stepId = e.target.value
                        if (stepId && !localStages.some(s => s.step_id === stepId && !s.isDeleted)) {
                          const step = steps.find((s: any) => s.id === stepId)
                          setLocalStages(prev => [...prev, { step_id: stepId, percentage: step?.weight_percentage || 0 }])
                        }
                        e.target.value = ''
                      }}
                    >
                      <option value=''>+ Tambah Tahapan Baru</option>
                      {steps.filter((st: any) => !localStages.some(ls => ls.step_id === st.id && !ls.isDeleted)).map((st: any) => (
                        <option key={st.id} value={st.id}>{st.step_name}</option>
                      ))}
                    </select>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
            <tfoot className="bg-[hsl(var(--muted))]/10 border-t border-[hsl(var(--border))]">
              <TableRow>
                <TableCell colSpan={2} className="text-right font-bold text-xs uppercase">
                  Total:
                </TableCell>
                <TableCell colSpan={2} className={`font-bold text-xs ${totalPercentage === 100 ? 'text-primary' : totalPercentage > 100 ? 'text-danger' : 'text-foreground'}`}>
                  {totalPercentage}%
                </TableCell>
              </TableRow>
            </tfoot>
          </Table>

          {isStagesChanged && (
            <div className='flex justify-end gap-3 p-4 bg-[hsl(var(--surface))] border-t border-[hsl(var(--border))]'>
              <Button variant='outline' size='sm' onClick={handleCancelStages}>
                Batal
              </Button>
              <Button variant='primary' size='sm' onClick={handleSaveStages}>
                Simpan Perubahan
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
