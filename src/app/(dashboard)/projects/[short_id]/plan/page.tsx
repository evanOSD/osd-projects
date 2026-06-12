'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Layers, Award, BookOpen, Percent } from 'lucide-react'
import { useProjectDetailContext } from '../layout'
import { useProjectPlans } from '@/hooks/queries/database/useProjectPlan'

// Import Tab Components
import TabPlans from './tabs/TabPlans'
import TabHierarchy from './tabs/TabHierarchy'
import TabTranslation from './tabs/TabTranslation'
import TabStages from './tabs/TabStages'

export default function ProjectPlanPage() {
  const { project } = useProjectDetailContext()
  const [activeTab, setActiveTab] = useState<'plans' | 'hierarchy' | 'translation' | 'stages'>('plans')

  const projectId = project?.id || ''

  // Load data using React Query hooks
  const { data: projectPlans = [], isLoading: plansLoading } = useProjectPlans(projectId)

  // Active Plan state
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  // Sync selected plan on initial load or load new plans
  useEffect(() => {
    if (!selectedPlanId && projectPlans.length > 0) {
      setSelectedPlanId(projectPlans[0].id)
    }
  }, [projectPlans, selectedPlanId])

  // Navigation Tabs definition
  const subTabs = [
    { id: 'plans', name: 'Team Information', icon: Layers },
    { id: 'hierarchy', name: 'Rencana Kerja & Kegiatan', icon: Award },
    { id: 'translation', name: 'Rencana Kitab', icon: BookOpen },
    { id: 'stages', name: 'Tahapan Perencanaan', icon: Percent }
  ] as const

  return (
    <div className='space-y-6 animate-in fade-in duration-300'>
      {/* Sub Tab Buttons */}
      <div className='flex flex-wrap gap-2 border-b border-[hsl(var(--border))]/50 pb-2'>
        {subTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-t-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] font-bold border-t-2 border-[hsl(var(--primary))]'
                : 'text-muted-foreground hover:bg-[hsl(var(--muted))]/50 hover:text-foreground'
            }`}
          >
            <tab.icon size={14} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* PLAN SELECTOR HEADER (Except for Plans Table) */}
      {activeTab !== 'plans' && activeTab !== 'stages' && (
        <Card className='p-4 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <Layers className='w-5 h-5 text-primary shrink-0' />
            <div>
              <label className='block text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>
                Tahun Fiskal Rencana Proyek
              </label>
              {plansLoading ? (
                <span className='text-sm text-muted-foreground animate-pulse'>Memuat rencana...</span>
              ) : projectPlans.length === 0 ? (
                <span className='text-sm font-semibold text-danger'>Belum ada rencana proyek</span>
              ) : (
                <select
                  className='bg-transparent text-sm font-bold text-foreground focus:outline-none border-b border-transparent focus:border-primary pr-4 py-0.5 cursor-pointer'
                  value={selectedPlanId || ''}
                  onChange={e => setSelectedPlanId(e.target.value || null)}
                >
                  {projectPlans.map(p => (
                    <option key={p.id} value={p.id}>
                      Tahun Fiskal (FY) {p.fiscal_year}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* TAB CONTENT */}
      {activeTab === 'plans' && <TabPlans />}
      {activeTab === 'hierarchy' && <TabHierarchy selectedPlanId={selectedPlanId} />}
      {activeTab === 'translation' && <TabTranslation selectedPlanId={selectedPlanId} />}
      {activeTab === 'stages' && <TabStages />}

    </div>
  )
}
