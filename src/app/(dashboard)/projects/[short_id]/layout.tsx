'use client'

import React, { createContext, useContext } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { useProjectContextByShortId } from '@/hooks/queries/database/useProjectPlan'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/app/(dashboard)/dummy/Badges'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Info, BookOpen, Layers, Image, MessageSquare, Activity } from 'lucide-react'

interface ProjectDetailContextType {
  project: any
  language: any
  projectLanguage: any
  books: any[]
  steps: any[]
  short_id: string
}

const ProjectDetailContext = createContext<ProjectDetailContextType | undefined>(undefined)

export function useProjectDetailContext() {
  const ctx = useContext(ProjectDetailContext)
  if (!ctx) {
    throw new Error('useProjectDetailContext must be used within a ProjectDetailLayout')
  }
  return ctx
}

export default function ProjectDetailLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const shortId = params.short_id as string

  const { data: context, isLoading, isError, error } = useProjectContextByShortId(shortId)

  if (isLoading) {
    return (
      <div className='p-12 text-center text-muted-foreground animate-pulse'>
        Menghubungkan ke database dan memuat detail proyek...
      </div>
    )
  }

  if (isError || !context?.project) {
    return (
      <div className='p-12 text-center text-danger'>
        Gagal memuat detail proyek: {error?.message || 'Proyek tidak ditemukan.'}
      </div>
    )
  }

  const { project, language, projectLanguage, books, steps } = context

  // Tabs definitions
  const tabs = [
    { id: 'info', name: 'Informasi', icon: Info, path: `/projects/${shortId}/info` },
    { id: 'plan', name: 'Plan (Rencana)', icon: BookOpen, path: `/projects/${shortId}/plan` },
    { id: 'progress', name: 'Progress (Kuartal)', icon: Layers, path: `/projects/${shortId}/progress` },
    { id: 'media', name: 'Media', icon: Image, path: `/projects/${shortId}/media` },
    { id: 'prayerRequests', name: 'Prayer Requests', icon: MessageSquare, path: `/projects/${shortId}/prayerRequests` },
    { id: 'activity', name: 'Activity Log', icon: Activity, path: `/projects/${shortId}/activity` },
  ]

  return (
    <ProjectDetailContext.Provider value={{ project, language, projectLanguage, books, steps, short_id: shortId }}>
      <div className='p-6 space-y-6'>
        {/* Tab Navigation */}
        <div className='flex flex-wrap gap-2 border-b border-[hsl(var(--border))] pb-2'>
          {tabs.map(tab => {
            const isActive = pathname === tab.path
            return (
              <Link
                key={tab.id}
                href={tab.path}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold transition-all cursor-pointer',
                  isActive
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-md'
                    : 'text-muted-foreground hover:bg-[hsl(var(--muted))]/50 hover:text-foreground'
                )}
              >
                <tab.icon size={16} />
                {tab.name}
              </Link>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className='pt-2'>
          {children}
        </div>
      </div>
    </ProjectDetailContext.Provider>
  )
}
