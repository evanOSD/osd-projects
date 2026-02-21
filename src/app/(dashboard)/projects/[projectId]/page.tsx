// src/app/(dashboard)/projects/[projectId]/page.tsx
'use client'

import { useState, useEffect } from 'react'

import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

import toast from 'react-hot-toast'

// Supabase & Store
import { createClient } from '@core/utils/supabaseClient'
import { useProjectStore } from '@/store/useProjectStore'

// Hooks Master Data untuk disalurkan ke Modal
import { useLanguages } from '@/hooks/useLanguages'
import { useBooks } from '@/hooks/useBooks'
import { usePassages } from '@/hooks/usePassages'
import { useStories } from '@/hooks/useStories'
import { useSteps } from '@/hooks/useSteps'

// Modal Generator

// --- KOMPONEN TAB PANEL ---
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  
  return (
    <div role="tabpanel" hidden={value !== index} id={`project-tabpanel-${index}`} aria-labelledby={`project-tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 4 }}>{children}</Box>}
    </div>
  )
}

const ProjectDashboardPage = () => {
  const params = useParams()
  const router = useRouter()
  const projectId = params?.projectId as string

  const { setActiveProject } = useProjectStore()

  // States
  const [activeTab, setActiveTab] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [projectData, setProjectData] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch Master Data untuk Modal (berjalan di background)
  const { data: languages } = useLanguages()
  const { data: books } = useBooks()
  const { data: passages } = usePassages()
  const { data: stories } = useStories()
  const { data: steps } = useSteps('translation')

  // Fetch Project Data
  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase.from('projects').select('*').eq('id', projectId).single()
      
      if (data) {
        setProjectData(data)
        setActiveProject(data.id, data.project_name) 
      }

      setIsLoading(false)
    }
    
    if (projectId) fetchProject()
  }, [projectId, setActiveProject])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value })
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('projects')
      .update({
        project_name: projectData.project_name,
        project_description: projectData.project_description,
        project_start_date: projectData.project_start_date,
        project_end_date: projectData.project_end_date,
        project_status: projectData.project_status,
        field_coordinator: projectData.field_coordinator,
        cluster_leader: projectData.cluster_leader
      })
      .eq('id', projectId)

    setIsSaving(false)

    if (error) {
      toast.error('Gagal menyimpan pengaturan.')
    } else {
      toast.success('Pengaturan proyek berhasil diperbarui!')
      setActiveProject(projectData.id, projectData.project_name)
    }
  }

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center min-h-[60vh]">
        <CircularProgress />
      </Card>
    )
  }

  if (!projectData) return <Typography color="error">Project tidak ditemukan.</Typography>

  return (
    <>
      <Card>
        {/* HEADER: KIRI (Back + Judul) & KANAN (Tabs) */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end', 
          borderBottom: '1px solid var(--mui-palette-divider)',
          px: 4,
          pt: 2,
          flexWrap: 'wrap' // Agar tidak hancur di layar kecil
        }}>
          
          {/* BAGIAN KIRI: Navigasi & Nama Proyek */}
          <div className="flex items-center gap-2 pb-3">
            <div className="flex items-center gap-2 cursor-pointer text-primary hover:underline" onClick={() => router.push('/projects')}>
              <i className="ri-arrow-left-line" />
              <Typography color="primary" variant="body2" fontWeight="bold">Back to Projects</Typography>
            </div>
            <Typography variant="body2" fontWeight="bold" color="textSecondary" sx={{ mx: 1 }}>
              /
            </Typography>
            <Typography color="primary" variant="body1" fontWeight="bold">
              {projectData.project_name}
            </Typography>
          </div>

          {/* BAGIAN KANAN: TABS MENU */}
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="scrollable" // Bisa digeser jika layarnya sempit
            scrollButtons="auto"
            sx={{ minHeight: 40 }}
          >
            <Tab label="Settings" sx={{ textTransform: 'none', fontWeight: 500 }} />
            <Tab label="Plan" sx={{ textTransform: 'none', fontWeight: 500 }} />
            <Tab label="Progress" sx={{ textTransform: 'none', fontWeight: 500 }} />
            <Tab label="Media" sx={{ textTransform: 'none', fontWeight: 500 }} />
            <Tab label="Prayers" sx={{ textTransform: 'none', fontWeight: 500 }} />
            <Tab label="Impact Stories" sx={{ textTransform: 'none', fontWeight: 500 }} />
            <Tab label="Project Log" sx={{ textTransform: 'none', fontWeight: 500 }} />
          </Tabs>
        </Box>

        <CardContent>
          {/* ==========================================
              TAB 0: SETTINGS 
          ========================================== */}
          <CustomTabPanel value={activeTab} index={0}>
            <Typography variant="h6" fontWeight="bold" color="primary" mb={4}>
              <i className="ri-settings-4-line mr-2" /> General Settings
            </Typography>
            
            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <Box className="flex flex-col gap-4">
                  <TextField fullWidth label="Project Name *" name="project_name" value={projectData.project_name || ''} onChange={handleInputChange} />
                  <TextField fullWidth multiline rows={6} label="Description of Project" name="project_description" value={projectData.project_description || ''} onChange={handleInputChange} />
                  <TextField select fullWidth label="Project Status" name="project_status" value={projectData.project_status || 'not_started'} onChange={handleInputChange}>
                    <MenuItem value="not_started">Not Started</MenuItem>
                    <MenuItem value="on_going">On Going</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </TextField>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box className="flex flex-col gap-4">
                  <TextField fullWidth label="Field Coordinator" name="field_coordinator" value={projectData.field_coordinator || ''} onChange={handleInputChange} />
                  <TextField fullWidth label="Cluster Leader" name="cluster_leader" value={projectData.cluster_leader || ''} onChange={handleInputChange} />
                  
                  <Grid container spacing={4}>
                    <Grid item xs={6}>
                      <TextField fullWidth type="date" label="Start Date" name="project_start_date" value={projectData.project_start_date || ''} onChange={handleInputChange} InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField fullWidth type="date" label="End Date" name="project_end_date" value={projectData.project_end_date || ''} onChange={handleInputChange} InputLabelProps={{ shrink: true }} />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <div className="flex justify-end gap-3">
                  <Button variant="outlined" color="secondary" onClick={() => router.push('/projects')}>Cancel</Button>
                  <Button variant="contained" color="primary" onClick={handleSaveSettings} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </Grid>
            </Grid>
          </CustomTabPanel>

          {/* ==========================================
              TAB 1: PLAN (Panjang ke bawah ala Hummingbird)
          ========================================== */}
          <CustomTabPanel value={activeTab} index={1}>
            <div className="flex flex-col gap-8">
              
              {/* 1. Outcomes */}
              <Box>
                <div className="flex justify-between items-center mb-3">
                  <Typography variant="h6" fontWeight="bold">Outcomes</Typography>
                  <Button variant="outlined" size="small" startIcon={<i className="ri-add-line" />}>Add Outcome</Button>
                </div>
                <Card variant="outlined" sx={{ p: 4, bgcolor: 'background.default', color: 'text.secondary', textAlign: 'center' }}>
                  Belum ada data Outcomes.
                </Card>
              </Box>

              {/* 2. Non-Translation Goals */}
              <Box>
                <div className="flex justify-between items-center mb-3">
                  <Typography variant="h6" fontWeight="bold">Output Goals (Non-Translation)</Typography>
                  <Button variant="outlined" size="small" startIcon={<i className="ri-add-line" />}>Add Goal</Button>
                </div>
                <Card variant="outlined" sx={{ p: 4, bgcolor: 'background.default', color: 'text.secondary', textAlign: 'center' }}>
                  Belum ada data Non-Translation Goals.
                </Card>
              </Box>

              {/* 3. Translation Goals */}
              <Box>
                <div className="flex justify-between items-center mb-3">
                  <Typography variant="h6" fontWeight="bold">Translation Goals</Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="small" 
                    startIcon={<i className="ri-add-circle-line" />}
                    onClick={() => setIsModalOpen(true)} // Membuka modal generator kita!
                  >
                    Add Translation Goal
                  </Button>
                </div>
                <Card variant="outlined" sx={{ p: 4, bgcolor: 'background.default', color: 'text.secondary', textAlign: 'center' }}>
                  Belum ada target terjemahan. Klik &quot;Add Translation Goal&quot; untuk mulai merakit.
                </Card>
              </Box>

              {/* 4. Activities */}
              <Box>
                <div className="flex justify-between items-center mb-3">
                  <Typography variant="h6" fontWeight="bold">Activities</Typography>
                  <Button variant="outlined" size="small" startIcon={<i className="ri-add-line" />}>Add Activity</Button>
                </div>
                <Card variant="outlined" sx={{ p: 4, bgcolor: 'background.default', color: 'text.secondary', textAlign: 'center' }}>
                  Belum ada data Activities.
                </Card>
              </Box>

              {/* 5. Steps (Planning Stages) */}
              <Box>
                <div className="flex justify-between items-center mb-3">
                  <Typography variant="h6" fontWeight="bold">Planning Stages (Steps)</Typography>
                  <Button variant="outlined" size="small" startIcon={<i className="ri-settings-3-line" />}>Configure Steps</Button>
                </div>
                <Card variant="outlined" sx={{ p: 4, bgcolor: 'background.default', color: 'text.secondary', textAlign: 'center' }}>
                  Daftar tahapan standar proyek akan muncul di sini.
                </Card>
              </Box>

            </div>
          </CustomTabPanel>

          {/* ==========================================
              TAB 2-6: PLACEHOLDERS
          ========================================== */}
          <CustomTabPanel value={activeTab} index={2}><Typography>Progress tracker akan ada di sini.</Typography></CustomTabPanel>
          <CustomTabPanel value={activeTab} index={3}><Typography>Input Media / Google Drive Links akan ada di sini.</Typography></CustomTabPanel>
          <CustomTabPanel value={activeTab} index={4}><Typography>Catatan Pokok Doa (Prayers) akan ada di sini.</Typography></CustomTabPanel>
          <CustomTabPanel value={activeTab} index={5}><Typography>Form submit Impact Stories akan ada di sini.</Typography></CustomTabPanel>
          <CustomTabPanel value={activeTab} index={6}><Typography>Project Log (Riwayat Perubahan) akan ada di sini.</Typography></CustomTabPanel>

        </CardContent>
      </Card>

      
    </>
  )
}

export default ProjectDashboardPage
