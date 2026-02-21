// src/app/(dashboard)/projects/page.tsx
'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { useProjects } from '@/hooks/useProjects'

// import useProjectStore sudah Dihapus karena kita murni pakai URL sekarang
import CreateProjectModal from './CreateProjectModal'

const ProjectsPage = () => {
  const router = useRouter()
  const { data: projects, isLoading, isError, refetch } = useProjects()

  // const { setActiveProject } = useProjectStore() <-- Baris ini sudah Dihapus

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'on_going':
        return 'primary'
      case 'not_started':
        return 'default'
      default:
        return 'default'
    }
  }

  const formatStatus = (status: string) => {
    if (!status) return 'Unknown'

    return status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
  }

  // --- FUNGSI NAVIGASI ---
  const handleCardClick = (project: any) => {
    // Ubah rutenya menjadi ke root /projectId
    router.push(`/projects/${project.id}`)
  }

  // --- FUNGSI EDIT ---
  const handleEditClick = (e: React.MouseEvent, project: any) => {
    e.stopPropagation()
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  // --- FUNGSI CREATE BARU ---
  const handleCreateNew = () => {
    setSelectedProject(null)
    setIsModalOpen(true)
  }

  if (isLoading)
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <CircularProgress />
      </div>
    )
  if (isError)
    return (
      <Typography color='error' className='p-4 text-center'>
        Gagal memuat data proyek.
      </Typography>
    )

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} className='flex items-center justify-between'>
          <Typography variant='h4'>Daftar Proyek</Typography>
          <Button
            variant='contained'
            startIcon={<i className='ri-add-line' />}
            onClick={handleCreateNew}
            sx={{ textTransform: 'none' }}
          >
            Create new project
          </Button>
        </Grid>

        <Grid item xs={12}>
          {!projects || projects.length === 0 ? (
            <Card className='flex flex-col items-center justify-center p-10 text-center border-dashed border-2 shadow-none'>
              <i className='ri-folder-open-line text-6xl text-gray-300 mb-4' />
              <Typography variant='h6' color='textSecondary'>
                Belum ada proyek
              </Typography>
              <Button variant='outlined' onClick={handleCreateNew} sx={{ textTransform: 'none', mt: 2 }}>
                Create new project
              </Button>
            </Card>
          ) : (
            <Grid container spacing={4}>
              {projects.map((project: any) => (
                <Grid item xs={12} sm={6} md={4} key={project.id}>
                  <Card
                    className='hover:shadow-lg transition-shadow cursor-pointer relative'
                    onClick={() => handleCardClick(project)}
                  >
                    <CardContent className='flex flex-col gap-3'>
                      <div className='flex justify-between items-start pr-8'>
                        <Typography variant='h6' className='font-bold line-clamp-1' title={project.project_name}>
                          {project.project_name}
                        </Typography>

                        <Tooltip title='Edit Project Info'>
                          <IconButton
                            size='small'
                            onClick={e => handleEditClick(e, project)}
                            sx={{ position: 'absolute', top: 12, right: 12 }}
                          >
                            <i className='ri-settings-4-line text-textSecondary' />
                          </IconButton>
                        </Tooltip>
                      </div>

                      <div className='flex items-center gap-2'>
                        <Chip
                          label={formatStatus(project.project_status)}
                          color={getStatusColor(project.project_status) as any}
                          size='small'
                        />
                      </div>

                      <Typography variant='body2' color='textSecondary' sx={{ mt: 1 }}>
                        <strong>FC:</strong> {project.field_coordinator || 'Belum di-assign'}
                      </Typography>

                      <div className='flex items-center justify-between mt-2 pt-2 border-t border-dashed'>
                        <Typography variant='caption' color='textSecondary'>
                          {project.project_start_date
                            ? new Date(project.project_start_date).toLocaleDateString('id-ID')
                            : 'Draft'}
                          {' - '}
                          {project.project_end_date
                            ? new Date(project.project_end_date).toLocaleDateString('id-ID')
                            : '?'}
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => refetch()}
        projectData={selectedProject}
      />
    </>
  )
}

export default ProjectsPage
