// src/app/(dashboard)/projects/CreateProjectModal.tsx
'use client'

import { useState, useEffect } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import toast from 'react-hot-toast'

import { createClient } from '@core/utils/supabaseClient'
import { useLanguages } from '@/hooks/useLanguages'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  projectData?: any
}

const defaultForm = {
  project_name: '',
  project_description: '',
  project_start_date: '',
  project_end_date: '',
  field_coordinator: '',
  cluster_leader: '',
  project_status: 'not_started'
}

type ProjectLanguageRow = {
  language_id: string
  iso_code: string
  pseudonym: string
  facilitator: string
}

const CreateProjectModal = ({ isOpen, onClose, onSuccess, projectData }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState(defaultForm)

  const [projectLanguages, setProjectLanguages] = useState<ProjectLanguageRow[]>([])

  const { data: dbLanguages } = useLanguages()

  useEffect(() => {
    if (projectData && isOpen) {
      setFormData({
        project_name: projectData.project_name || '',
        project_description: projectData.project_description || '',
        project_start_date: projectData.project_start_date || '',
        project_end_date: projectData.project_end_date || '',
        field_coordinator: projectData.field_coordinator || '',
        cluster_leader: projectData.cluster_leader || '',
        project_status: projectData.project_status || 'not_started'
      })
      setProjectLanguages([])
    } else if (isOpen) {
      setFormData(defaultForm)
      setProjectLanguages([])
    }
  }, [projectData, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAddLanguageRow = () => {
    setProjectLanguages([...projectLanguages, { language_id: '', iso_code: '', pseudonym: '', facilitator: '' }])
  }

  const handleRemoveLanguageRow = (index: number) => {
    const newRows = [...projectLanguages]

    newRows.splice(index, 1)
    setProjectLanguages(newRows)
  }

  const handleLanguageRowChange = (index: number, field: keyof ProjectLanguageRow, value: string) => {
    const newRows = [...projectLanguages]

    if (field === 'language_id') {
      const langArray = (dbLanguages as any[]) || []
      const selectedLang = langArray.find((l: any) => l.id === value)

      newRows[index] = {
        ...newRows[index],
        language_id: value,
        iso_code: selectedLang?.iso_code || '',
        pseudonym: selectedLang?.pseudonym || ''
      }
    } else {
      newRows[index] = { ...newRows[index], [field]: value }
    }

    setProjectLanguages(newRows)
  }

  const handleSubmit = async () => {
    if (!formData.project_name) {
      toast.error('Nama proyek wajib diisi!')

      return
    }

    setIsSubmitting(true)
    const supabase = createClient()
    let currentProjectId = projectData?.id

    const dataToInsert = {
      project_name: formData.project_name,
      project_description: formData.project_description || null,
      project_start_date: formData.project_start_date || null,
      project_end_date: formData.project_end_date || null,
      field_coordinator: formData.field_coordinator || null,
      cluster_leader: formData.cluster_leader || null,
      project_status: formData.project_status
    }

    if (currentProjectId) {
      const { error: updateError } = await supabase
        .from('projects' as any)
        .update(dataToInsert)
        .eq('id', currentProjectId)

      if (updateError) {
        toast.error(updateError.message)
        setIsSubmitting(false)

        return
      }
    } else {
      const { data: newProject, error: insertError } = await supabase
        .from('projects' as any)
        .insert([dataToInsert])
        .select()
        .single()

      if (insertError) {
        toast.error(insertError.message)
        setIsSubmitting(false)

        return
      }

      currentProjectId = (newProject as any).id
    }

    if (projectLanguages.length > 0 && currentProjectId) {
      for (const row of projectLanguages) {
        if (!row.language_id) continue

        await supabase
          .from('languages' as any)
          .update({ pseudonym: row.pseudonym })
          .eq('id', row.language_id)

        await supabase.from('project_languages' as any).insert([
          {
            project_id: currentProjectId,
            language_id: row.language_id,
            facilitator: row.facilitator
          }
        ])
      }
    }

    setIsSubmitting(false)
    toast.success(projectData ? 'Proyek berhasil diperbarui!' : 'Proyek berhasil dibuat!')
    onSuccess()
    setFormData(defaultForm)
    setProjectLanguages([])
    onClose()
  }

  return (
    <Dialog
      open={isOpen}
      onClose={!isSubmitting ? onClose : undefined}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: '90vw',
          maxWidth: '90vw',
          height: '90vh',
          maxHeight: '90vh',
          borderRadius: 2,
          m: 0
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem', borderBottom: '1px solid #e0e0e0', mb: 2 }}>
        {projectData ? 'Edit Project' : 'Create New Project'}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={4} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Project Name'
              name='project_name'
              value={formData.project_name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label='Project Status'
              name='project_status'
              value={formData.project_status}
              onChange={handleChange}
            >
              <MenuItem value='not_started'>Not Started</MenuItem>
              <MenuItem value='on_going'>On Going</MenuItem>
              <MenuItem value='completed'>Completed</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Field Coordinator'
              name='field_coordinator'
              value={formData.field_coordinator}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label='Project Description'
              name='project_description'
              value={formData.project_description}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Box
              mt={2}
              p={3}
              sx={{
                bgcolor: 'var(--mui-palette-action-hover)',
                borderRadius: 1,
                border: '1px solid var(--mui-palette-divider)'
              }}
            >
              <Typography variant='subtitle1' fontWeight='bold' color='primary' mb={1}>
                Target Languages
              </Typography>
              <Typography variant='body2' color='warning.main' mb={3}>
                Jika Anda mengubah Pseudonym di sini, data tersebut juga akan diperbarui di pengaturan master bahasa.
              </Typography>

              <Grid container spacing={2} sx={{ mb: 1, display: projectLanguages.length > 0 ? 'flex' : 'none' }}>
                <Grid item xs={4}>
                  <Typography variant='caption' fontWeight='bold'>
                    Language (name_in_rev79)
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant='caption' fontWeight='bold'>
                    Code (ISO)
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant='caption' fontWeight='bold'>
                    Pseudonym
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant='caption' fontWeight='bold'>
                    Facilitator
                  </Typography>
                </Grid>
                <Grid item xs={1}></Grid>
              </Grid>

              {projectLanguages.map((row, index) => (
                <Grid container spacing={2} alignItems='center' key={index} sx={{ mb: 2 }}>
                  <Grid item xs={4}>
                    <TextField
                      select
                      fullWidth
                      size='small'
                      value={row.language_id}
                      onChange={e => handleLanguageRowChange(index, 'language_id', e.target.value)}
                    >
                      <MenuItem value='' disabled>
                        Pilih Bahasa...
                      </MenuItem>
                      {(dbLanguages as any[])?.map((l: any) => (
                        <MenuItem key={l.id} value={l.id}>
                          {l.name_in_rev79 || l.name_with_code}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={2}>
                    <TextField fullWidth size='small' value={row.iso_code} disabled placeholder='Code' />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      size='small'
                      value={row.pseudonym}
                      onChange={e => handleLanguageRowChange(index, 'pseudonym', e.target.value)}
                      placeholder='Pseudonym'
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      size='small'
                      value={row.facilitator}
                      onChange={e => handleLanguageRowChange(index, 'facilitator', e.target.value)}
                      placeholder='Nama'
                    />
                  </Grid>
                  <Grid item xs={1} className='flex justify-center'>
                    <IconButton size='small' color='error' onClick={() => handleRemoveLanguageRow(index)}>
                      <i className='ri-close-line' />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              <Button
                variant='outlined'
                size='small'
                startIcon={<i className='ri-add-line' />}
                onClick={handleAddLanguageRow}
              >
                Add Language
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
        <Button onClick={onClose} color='secondary' variant='outlined' disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color='primary' variant='contained' disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save project'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateProjectModal
