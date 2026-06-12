import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/app/(dashboard)/dummy/Buttons'
import { Input } from '@/app/(dashboard)/dummy/Forms'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table'
import { Download, Upload, Maximize2, Minimize2, Plus } from 'lucide-react'
import { useProjectDetailContext } from '../../layout'
import { 
  useOutcomes,
  useAddOutcome,
  useUpdateOutcome,
  useDeleteOutcome,
  useNonTranslationGoals,
  useAddNonTranslationGoal,
  useUpdateNonTranslationGoal,
  useDeleteNonTranslationGoal,
  useActivities,
  useAddActivity,
  useUpdateActivity,
  useDeleteActivity,
} from '@/hooks/queries/database/useProjectPlan'
import toast from 'react-hot-toast'

interface TabHierarchyProps {
  selectedPlanId: string | null
}

export default function TabHierarchy({ selectedPlanId }: TabHierarchyProps) {
  const { project } = useProjectDetailContext()
  const projectId = project?.id || ''

  const { data: outcomeList = [], isLoading: outLoading } = useOutcomes(projectId)
  const { data: nonTranslationList = [] } = useNonTranslationGoals(projectId)
  const { data: activityList = [] } = useActivities(projectId)

  const addOutcome = useAddOutcome()
  const updateOutcome = useUpdateOutcome()
  const deleteOutcome = useDeleteOutcome(projectId)

  const addNonTranslation = useAddNonTranslationGoal()
  const updateNonTranslation = useUpdateNonTranslationGoal()
  const deleteNonTranslation = useDeleteNonTranslationGoal(projectId)

  const addActivity = useAddActivity()
  const updateActivity = useUpdateActivity()
  const deleteActivity = useDeleteActivity(projectId)

  // State for adding Outcome
  const [isAddingOutcome, setIsAddingOutcome] = useState(false)
  const [newOutcomeName, setNewOutcomeName] = useState('')
  const [newOutcomeIndicator, setNewOutcomeIndicator] = useState('')
  const [newOutcomeMethod, setNewOutcomeMethod] = useState('')

  // State for adding Output Goal
  const [isAddingOutput, setIsAddingOutput] = useState(false)
  const [newOutputOutcomeId, setNewOutputOutcomeId] = useState('')
  const [newOutputName, setNewOutputName] = useState('')
  const [newOutputForm, setNewOutputForm] = useState('Video')
  const [newOutputIndicator, setNewOutputIndicator] = useState('')
  const [newOutputMethod, setNewOutputMethod] = useState('')

  // State for adding Activity
  const [isAddingActivity, setIsAddingActivity] = useState(false)
  const [newActivityOutputId, setNewActivityOutputId] = useState('')
  const [newActivityName, setNewActivityName] = useState('')
  
  if (!selectedPlanId) return null

  const filteredOutcomes = outcomeList.filter(o => o.project_plan_id === selectedPlanId)

  // --- Handlers ---
  const handleSaveOutcome = async () => {
    if (!newOutcomeName.trim()) {
      toast.error('Judul Outcome tidak boleh kosong')
      return
    }
    await addOutcome.mutateAsync({
      project_id: projectId,
      project_plan_id: selectedPlanId,
      year: null, 
      outcome_name: newOutcomeName,
      indicator_of_change: newOutcomeIndicator || null,
      measurement_method: newOutcomeMethod || null
    })
    setNewOutcomeName('')
    setNewOutcomeIndicator('')
    setNewOutcomeMethod('')
    setIsAddingOutcome(false)
  }

  const handleSaveOutput = async () => {
    if (!newOutputOutcomeId || !newOutputName.trim()) {
      toast.error('Related Outcome dan Judul Output harus diisi')
      return
    }
    await addNonTranslation.mutateAsync({
      project_id: projectId,
      project_outcome_id: newOutputOutcomeId,
      output_goal_name: newOutputName,
      product_form: newOutputForm,
      target_quantity: 1,
      achievement_indicator: newOutputIndicator || null,
      measurement_method: newOutputMethod || null
    })
    setNewOutputOutcomeId('')
    setNewOutputName('')
    setNewOutputIndicator('')
    setNewOutputMethod('')
    setIsAddingOutput(false)
  }

  const handleSaveActivity = async () => {
    if (!newActivityOutputId || !newActivityName.trim()) {
      toast.error('Related Output Goal dan Judul Activity harus diisi')
      return
    }
    await addActivity.mutateAsync({
      project_id: projectId,
      output_goal_id: newActivityOutputId,
      activity_name: newActivityName,
      status: 'not_started'
    })
    setNewActivityOutputId('')
    setNewActivityName('')
    setIsAddingActivity(false)
  }

  return (
    <div className='space-y-12 animate-in fade-in duration-300 pb-12'>
      
      {/* ======================= OUTCOMES TABLE ======================= */}
      <div className='space-y-4'>
        <div>
          <h2 className='text-2xl font-semibold text-foreground tracking-tight'>Outcomes</h2>
          <p className='text-sm text-muted-foreground mt-1'>
            What Outcomes (long-term desired changes) do you want to see in the community? Think about how things used to be, how they are now, and how they can be in the future.
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <Button variant='outline' size='sm' className='flex items-center gap-2'>
            <Download size={14} /> Export
          </Button>
          <Button variant='outline' size='sm' className='flex items-center gap-2'>
            <Minimize2 size={14} /> Collapse Rows
          </Button>
        </div>

        <Card className='overflow-hidden border border-[hsl(var(--border))]'>
          <Table>
            <TableHeader>
              <TableRow className='bg-[hsl(var(--muted))]/30'>
                <TableHead className='font-bold text-xs font-semibold uppercase w-[30%]'>Outcome (Desired Change)</TableHead>
                <TableHead className='font-bold text-xs font-semibold uppercase w-[30%]'>Indicator of Change (How will you know change is happening?)</TableHead>
                <TableHead className='font-bold text-xs font-semibold uppercase w-[30%]'>How will you measure the desired change?</TableHead>
                <TableHead className='font-bold text-xs font-semibold uppercase w-[10%] text-right'>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOutcomes.map(outcome => (
                <TableRow key={outcome.id}>
                  <TableCell className='align-top font-medium text-sm leading-relaxed'>
                    {outcome.outcome_name}
                  </TableCell>
                  <TableCell className='align-top text-sm text-muted-foreground leading-relaxed'>
                    {outcome.indicator_of_change || '-'}
                  </TableCell>
                  <TableCell className='align-top text-sm text-muted-foreground leading-relaxed'>
                    {outcome.measurement_method || '-'}
                  </TableCell>
                  <TableCell className='align-top text-right'>
                    <button 
                      onClick={() => {
                        if(confirm('Hapus Outcome ini beserta isinya?')) deleteOutcome.mutate(outcome.id)
                      }} 
                      className='text-xs font-bold text-danger hover:underline'
                    >
                      Hapus
                    </button>
                  </TableCell>
                </TableRow>
              ))}

              {isAddingOutcome ? (
                <TableRow className='bg-[hsl(var(--primary))]/5'>
                  <TableCell className='align-top'>
                    <textarea 
                      className='w-full min-h-[60px] p-2 text-sm bg-background border rounded' 
                      placeholder='Masukkan Outcome...'
                      value={newOutcomeName}
                      onChange={e => setNewOutcomeName(e.target.value)}
                    />
                  </TableCell>
                  <TableCell className='align-top'>
                    <textarea 
                      className='w-full min-h-[60px] p-2 text-sm bg-background border rounded' 
                      placeholder='Masukkan Indikator...'
                      value={newOutcomeIndicator}
                      onChange={e => setNewOutcomeIndicator(e.target.value)}
                    />
                  </TableCell>
                  <TableCell className='align-top'>
                    <textarea 
                      className='w-full min-h-[60px] p-2 text-sm bg-background border rounded' 
                      placeholder='Masukkan Metode Pengukuran...'
                      value={newOutcomeMethod}
                      onChange={e => setNewOutcomeMethod(e.target.value)}
                    />
                  </TableCell>
                  <TableCell className='align-top text-right space-y-2'>
                    <button onClick={handleSaveOutcome} className='block w-full text-xs font-bold text-primary hover:underline'>Simpan</button>
                    <button onClick={() => setIsAddingOutcome(false)} className='block w-full text-xs font-bold text-muted-foreground hover:underline'>Batal</button>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="p-0">
                    <button 
                      onClick={() => setIsAddingOutcome(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-muted-foreground hover:text-primary hover:bg-[hsl(var(--primary))]/5 transition-colors border-t border-dashed border-[hsl(var(--border))]"
                    >
                      <Plus size={14} /> Tambah Outcome Baru
                    </button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* ======================= OUTPUT GOALS TABLE ======================= */}
      <div className='space-y-4'>
        <div>
          <h2 className='text-2xl font-semibold text-foreground tracking-tight'>Output Goals</h2>
          <p className='text-sm text-muted-foreground mt-1'>
            Above, you have identified the Outcome's (Desired Changes). What project Output Goals will bring about the above Desired Changes?
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <Button variant='outline' size='sm' className='flex items-center gap-2'>
            <Upload size={14} /> Import from CSV
          </Button>
          <Button variant='outline' size='sm' className='flex items-center gap-2'>
            <Download size={14} /> Export
          </Button>
          <Button variant='outline' size='sm' className='flex items-center gap-2'>
            <Maximize2 size={14} /> Expand all Rows
          </Button>
        </div>

        <Card className='overflow-hidden border border-[hsl(var(--border))]'>
          <Table>
            <TableHeader>
              <TableRow className='bg-[hsl(var(--muted))]/30'>
                <TableHead className='font-bold text-[11px] uppercase w-[20%]'>Related Outcome</TableHead>
                <TableHead className='font-bold text-[11px] uppercase w-[15%]'>Project Output Goal</TableHead>
                <TableHead className='font-bold text-[11px] uppercase w-[20%]'>Product Medium/form</TableHead>
                <TableHead className='font-bold text-[11px] uppercase w-[20%]'>How will we know we have achieved this?</TableHead>
                <TableHead className='font-bold text-[11px] uppercase w-[20%]'>How will you measure the achievement?</TableHead>
                <TableHead className='font-bold text-[11px] uppercase text-right w-[5%]'>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOutcomes.flatMap(outcome => {
                const outputs = nonTranslationList.filter(nt => nt.project_outcome_id === outcome.id)
                return outputs.map(output => (
                  <TableRow key={output.id}>
                    <TableCell className='align-top text-xs text-muted-foreground leading-relaxed'>
                      {outcome.outcome_name}
                    </TableCell>
                    <TableCell className='align-top font-medium text-xs leading-relaxed'>
                      {output.output_goal_name}
                    </TableCell>
                    <TableCell className='align-top text-xs text-muted-foreground leading-relaxed'>
                      {output.product_form || '-'}
                    </TableCell>
                    <TableCell className='align-top text-xs text-muted-foreground leading-relaxed'>
                      {output.achievement_indicator || '-'}
                    </TableCell>
                    <TableCell className='align-top text-xs text-muted-foreground leading-relaxed'>
                      {output.measurement_method || '-'}
                    </TableCell>
                    <TableCell className='align-top text-right'>
                      <button 
                        onClick={() => {
                          if(confirm('Hapus Output Goal ini?')) deleteNonTranslation.mutate(output.id)
                        }} 
                        className='text-[10px] font-bold text-danger hover:underline'
                      >
                        Hapus
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              })}

              {isAddingOutput ? (
                <TableRow className='bg-[hsl(var(--primary))]/5'>
                  <TableCell className='align-top'>
                    <select 
                      className='w-full p-2 text-xs bg-background border rounded focus:outline-primary'
                      value={newOutputOutcomeId}
                      onChange={e => setNewOutputOutcomeId(e.target.value)}
                    >
                      <option value=''>-- Pilih Outcome --</option>
                      {filteredOutcomes.map(o => (
                        <option key={o.id} value={o.id}>{o.outcome_name.substring(0, 50)}...</option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell className='align-top'>
                    <textarea 
                      className='w-full min-h-[60px] p-2 text-xs bg-background border rounded' 
                      placeholder='Output Goal...'
                      value={newOutputName}
                      onChange={e => setNewOutputName(e.target.value)}
                    />
                  </TableCell>
                  <TableCell className='align-top'>
                    <select 
                      className='w-full p-2 text-xs bg-background border rounded'
                      value={newOutputForm}
                      onChange={e => setNewOutputForm(e.target.value)}
                    >
                      <option value='Video'>Video</option>
                      <option value='Audio'>Audio</option>
                      <option value='Print'>Print (Cetak)</option>
                      <option value='Digital'>Digital (Softcopy)</option>
                    </select>
                  </TableCell>
                  <TableCell className='align-top'>
                    <textarea 
                      className='w-full min-h-[60px] p-2 text-xs bg-background border rounded' 
                      placeholder='Indikator...'
                      value={newOutputIndicator}
                      onChange={e => setNewOutputIndicator(e.target.value)}
                    />
                  </TableCell>
                  <TableCell className='align-top'>
                    <textarea 
                      className='w-full min-h-[60px] p-2 text-xs bg-background border rounded' 
                      placeholder='Metode...'
                      value={newOutputMethod}
                      onChange={e => setNewOutputMethod(e.target.value)}
                    />
                  </TableCell>
                  <TableCell className='align-top text-right space-y-2'>
                    <button onClick={handleSaveOutput} className='block w-full text-[10px] font-bold text-primary hover:underline'>Simpan</button>
                    <button onClick={() => setIsAddingOutput(false)} className='block w-full text-[10px] font-bold text-muted-foreground hover:underline'>Batal</button>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <button 
                      onClick={() => setIsAddingOutput(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-muted-foreground hover:text-primary hover:bg-[hsl(var(--primary))]/5 transition-colors border-t border-dashed border-[hsl(var(--border))]"
                    >
                      <Plus size={14} /> Tambah Output Goal Baru
                    </button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* ======================= ACTIVITIES TABLE ======================= */}
      <div className='space-y-4'>
        <div>
          <h2 className='text-2xl font-semibold text-foreground tracking-tight'>Activities</h2>
          <p className='text-sm text-muted-foreground mt-1'>
            What activities will lead to the achievement of the above listed Output Goals?
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

        <Card className='overflow-hidden border border-[hsl(var(--border))]'>
          <Table>
            <TableHeader>
              <TableRow className='bg-[hsl(var(--muted))]/30'>
                <TableHead className='font-bold text-xs uppercase w-[30%]'>Related Output Goal</TableHead>
                <TableHead className='font-bold text-xs uppercase w-[40%]'>Activity</TableHead>
                <TableHead className='font-bold text-xs uppercase w-[20%]'>Status</TableHead>
                <TableHead className='font-bold text-xs uppercase text-right w-[10%]'>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOutcomes.flatMap(outcome => {
                const outputs = nonTranslationList.filter(nt => nt.project_outcome_id === outcome.id)
                return outputs.flatMap(output => {
                  const activities = activityList.filter(act => act.output_goal_id === output.id)
                  return activities.map(act => (
                    <TableRow key={act.id}>
                      <TableCell className='align-top text-xs text-muted-foreground leading-relaxed'>
                        {output.output_goal_name}
                      </TableCell>
                      <TableCell className='align-top font-medium text-xs leading-relaxed'>
                        {act.activity_name}
                      </TableCell>
                      <TableCell className='align-top'>
                        <select
                          className={`px-2 py-1 rounded text-[10px] font-bold border focus:outline-none cursor-pointer ${
                            act.status === 'completed'
                              ? 'bg-[hsl(var(--success-soft))] text-[hsl(var(--success))] border-[hsl(var(--success))]/30'
                              : act.status === 'on_going'
                                ? 'bg-[hsl(var(--info-soft))] text-[hsl(var(--info))] border-[hsl(var(--info))]/30'
                                : 'bg-[hsl(var(--muted))] text-muted-foreground border-[hsl(var(--border))]/30'
                          }`}
                          value={act.status || 'not_started'}
                          onChange={e => updateActivity.mutate({ id: act.id, payload: { status: e.target.value as any }})}
                        >
                          <option value='not_started'>Belum Mulai</option>
                          <option value='on_going'>Berjalan</option>
                          <option value='completed'>Selesai</option>
                        </select>
                      </TableCell>
                      <TableCell className='align-top text-right'>
                        <button 
                          onClick={() => {
                            if(confirm('Hapus Activity ini?')) deleteActivity.mutate(act.id)
                          }} 
                          className='text-[10px] font-bold text-danger hover:underline'
                        >
                          Hapus
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                })
              })}

              {isAddingActivity ? (
                <TableRow className='bg-[hsl(var(--primary))]/5'>
                  <TableCell className='align-top'>
                    <select 
                      className='w-full p-2 text-xs bg-background border rounded focus:outline-primary'
                      value={newActivityOutputId}
                      onChange={e => setNewActivityOutputId(e.target.value)}
                    >
                      <option value=''>-- Pilih Output Goal --</option>
                      {filteredOutcomes.flatMap(o => {
                        return nonTranslationList
                          .filter(nt => nt.project_outcome_id === o.id)
                          .map(out => (
                            <option key={out.id} value={out.id}>{out.output_goal_name.substring(0, 50)}...</option>
                          ))
                      })}
                    </select>
                  </TableCell>
                  <TableCell className='align-top' colSpan={2}>
                    <textarea 
                      className='w-full min-h-[40px] p-2 text-xs bg-background border rounded' 
                      placeholder='Masukkan Activity...'
                      value={newActivityName}
                      onChange={e => setNewActivityName(e.target.value)}
                    />
                  </TableCell>
                  <TableCell className='align-top text-right space-y-2'>
                    <button onClick={handleSaveActivity} className='block w-full text-[10px] font-bold text-primary hover:underline'>Simpan</button>
                    <button onClick={() => setIsAddingActivity(false)} className='block w-full text-[10px] font-bold text-muted-foreground hover:underline'>Batal</button>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="p-0">
                    <button 
                      onClick={() => setIsAddingActivity(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-muted-foreground hover:text-primary hover:bg-[hsl(var(--primary))]/5 transition-colors border-t border-dashed border-[hsl(var(--border))]"
                    >
                      <Plus size={14} /> Tambah Activity Baru
                    </button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

    </div>
  )
}
