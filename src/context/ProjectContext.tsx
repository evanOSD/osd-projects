'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface ProjectContextType {
  selectedProject: string
  setSelectedProject: (project: string) => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [selectedProject, setSelectedProject] = useState('Operation Snap Dragon - Indonesia')

  // Load from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('osd_selected_project')
    if (saved) {
      setSelectedProject(saved)
    }
  }, [])

  const handleSetProject = (project: string) => {
    setSelectedProject(project)
    localStorage.setItem('osd_selected_project', project)
  }

  return (
    <ProjectContext.Provider value={{ selectedProject, setSelectedProject: handleSetProject }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}
