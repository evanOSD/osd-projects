// src/components/layout/shared/ProjectSwitcher.tsx

'use client'

import { useParams, useRouter } from 'next/navigation' // Menggunakan navigasi Next.js

import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

import { useProjects } from '@/hooks/useProjects'

const ProjectSwitcher = () => {
  const router = useRouter()
  const params = useParams()

  // Menangkap ID Proyek dari URL (misal: /123-abc/plan_progress)
  const activeProjectId = params?.projectId as string | undefined

  // Menarik daftar proyek dari database
  const { data: projects, isLoading, isError } = useProjects()

  if (isLoading) return <CircularProgress size={24} color='primary' />
  if (isError)
    return (
      <Typography variant='caption' color='error'>
        Error loading projects
      </Typography>
    )

  return (
    <FormControl size='small' sx={{ minWidth: 220 }}>
      <Select
        value={activeProjectId || ''}
        displayEmpty
        onChange={e => {
          const selectedId = e.target.value
          
          if (selectedId) {
            router.push(`/projects/${selectedId}`)
          }
        }}
        sx={{
          borderRadius: 2,
          backgroundColor: 'background.paper',
          '& .MuiSelect-select': { py: 1, display: 'flex', alignItems: 'center', gap: 1 }
        }}
      >
        <MenuItem value='' disabled>
          <em>
            <i className='ri-folder-open-line mr-2' /> Select a Project...
          </em>
        </MenuItem>

        {projects?.map((project: any) => (
          <MenuItem key={project.id} value={project.id}>
            {project.project_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default ProjectSwitcher
