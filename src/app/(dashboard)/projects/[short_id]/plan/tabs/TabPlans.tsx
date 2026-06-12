import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/app/(dashboard)/dummy/Buttons'
import { Input } from '@/app/(dashboard)/dummy/Forms'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table'
import { Download, Maximize2, Users, Calendar, TrendingUp, Save, X, Plus } from 'lucide-react'
import { useProjectDetailContext } from '../../layout'
import { 
  useProjectPlans,
  useAddProjectPlan,
  useUpdateProjectPlan 
} from '@/hooks/queries/database/useProjectPlan'
import toast from 'react-hot-toast'

export default function TabPlans() {
  const { project } = useProjectDetailContext()
  const projectId = project?.id || ''
  
  const { data: projectPlans = [], isLoading } = useProjectPlans(projectId)
  const addProjectPlan = useAddProjectPlan()
  const updateProjectPlan = useUpdateProjectPlan()

  // State for new plan
  const [isAdding, setIsAdding] = useState(false)
  const [newFy, setNewFy] = useState<number>(new Date().getFullYear())
  const [newTrans, setNewTrans] = useState<number | ''>('')
  const [newVerses, setNewVerses] = useState<number | ''>('')
  const [newDays, setNewDays] = useState<number | ''>('')

  // State for editing existing plan inline
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null)
  const [editTrans, setEditTrans] = useState<number | ''>('')
  const [editVerses, setEditVerses] = useState<number | ''>('')
  const [editDays, setEditDays] = useState<number | ''>('')

  const handleSaveNew = async () => {
    if (!newFy || newTrans === '' || newVerses === '' || newDays === '') {
      toast.error('Semua field harus diisi!')
      return
    }
    await addProjectPlan.mutateAsync({
      project_id: projectId,
      fiscal_year: newFy,
      number_of_translators: Number(newTrans),
      team_verses_per_day: Number(newVerses),
      work_days_per_year: Number(newDays)
    })
    setIsAdding(false)
    setNewFy(new Date().getFullYear())
    setNewTrans('')
    setNewVerses('')
    setNewDays('')
  }

  const startEdit = (plan: any) => {
    setEditingPlanId(plan.id)
    setEditTrans(plan.number_of_translators)
    setEditVerses(Number(plan.team_verses_per_day))
    setEditDays(plan.work_days_per_year)
  }

  const handleSaveEdit = async () => {
    if (!editingPlanId || editTrans === '' || editVerses === '' || editDays === '') {
      toast.error('Semua field harus diisi!')
      return
    }
    await updateProjectPlan.mutateAsync({
      id: editingPlanId,
      payload: {
        number_of_translators: Number(editTrans),
        team_verses_per_day: Number(editVerses),
        work_days_per_year: Number(editDays)
      }
    })
    setEditingPlanId(null)
  }

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Memuat data tim...</div>
  }

  return (
    <div className='space-y-6 animate-in fade-in duration-300'>
      <div className='mb-2'>
        <h2 className='text-lg font-bold text-foreground flex items-center gap-2'>
          <Users className='w-5 h-5 text-primary' />
          Team Information
        </h2>
        <p className='text-sm text-muted-foreground mt-1'>
          Input the number of translators and the estimated number of verses per day. For additional help or suggestions, click on the question mark.
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
              <TableHead className='font-bold text-xs uppercase tracking-wider w-[150px]'>Fiscal Year</TableHead>
              <TableHead className='font-bold text-xs uppercase tracking-wider'>Number of Translators</TableHead>
              <TableHead className='font-bold text-xs uppercase tracking-wider'>Team Verses Per Day</TableHead>
              <TableHead className='font-bold text-xs uppercase tracking-wider'>Work Days Per Year</TableHead>
              <TableHead className='font-bold text-xs uppercase tracking-wider text-right w-[120px]'>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectPlans.map(plan => (
              <TableRow key={plan.id}>
                <TableCell className='font-medium'>{plan.fiscal_year}</TableCell>
                {editingPlanId === plan.id ? (
                  <>
                    <TableCell>
                      <Input type="number" value={editTrans} onChange={e => setEditTrans(e.target.value === '' ? '' : Number(e.target.value))} className="h-8 max-w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" value={editVerses} onChange={e => setEditVerses(e.target.value === '' ? '' : Number(e.target.value))} className="h-8 max-w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" value={editDays} onChange={e => setEditDays(e.target.value === '' ? '' : Number(e.target.value))} className="h-8 max-w-[120px]" />
                    </TableCell>
                    <TableCell className='text-right space-x-2'>
                      <button onClick={handleSaveEdit} className='text-primary hover:underline font-bold text-xs'>Simpan</button>
                      <button onClick={() => setEditingPlanId(null)} className='text-muted-foreground hover:underline text-xs'>Batal</button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{plan.number_of_translators}</TableCell>
                    <TableCell>{Number(plan.team_verses_per_day)}</TableCell>
                    <TableCell>{plan.work_days_per_year}</TableCell>
                    <TableCell className='text-right'>
                      <button onClick={() => startEdit(plan)} className='text-primary hover:underline font-bold text-xs'>Edit</button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}

            {/* Add New Row Inline */}
            {isAdding ? (
              <TableRow className='bg-[hsl(var(--primary))]/5'>
                <TableCell>
                  <Input type="number" value={newFy} onChange={e => setNewFy(parseInt(e.target.value) || 0)} className="h-8 max-w-[120px]" />
                </TableCell>
                <TableCell>
                  <Input type="number" value={newTrans} onChange={e => setNewTrans(e.target.value === '' ? '' : Number(e.target.value))} className="h-8 max-w-[120px]" placeholder="Penerjemah" />
                </TableCell>
                <TableCell>
                  <Input type="number" value={newVerses} onChange={e => setNewVerses(e.target.value === '' ? '' : Number(e.target.value))} className="h-8 max-w-[120px]" placeholder="Ayat/Hari" />
                </TableCell>
                <TableCell>
                  <Input type="number" value={newDays} onChange={e => setNewDays(e.target.value === '' ? '' : Number(e.target.value))} className="h-8 max-w-[120px]" placeholder="Hari/Tahun" />
                </TableCell>
                <TableCell className='text-right space-x-2'>
                  <button onClick={handleSaveNew} className='text-primary hover:underline font-bold text-xs'>Simpan</button>
                  <button onClick={() => setIsAdding(false)} className='text-muted-foreground hover:underline text-xs'>Batal</button>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-muted-foreground hover:text-primary hover:bg-[hsl(var(--primary))]/5 transition-colors border-t border-dashed border-[hsl(var(--border))]"
                  >
                    <Plus size={14} />
                    Tambah Fiscal Year Baru
                  </button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
