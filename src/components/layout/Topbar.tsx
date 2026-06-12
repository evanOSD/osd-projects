'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useProject } from '@/context/ProjectContext'
import { useProjectsList } from '@/hooks/queries/database/useProjects'
import { useRouter } from 'next/navigation'
import UserDropdown from '@/components/layout/topbarcomponents/UserDropdown'
import ThemeToggle from '@/components/layout/topbarcomponents/ThemeToggle'
import { Search, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Topbar() {
  const { user, logout } = useAuth()
  const { selectedProject, setSelectedProject } = useProject()
  const { data: projects = [] } = useProjectsList()
  const router = useRouter()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const userName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? 'Pengguna OSD'
  const userEmail = user?.email ?? 'Email tidak ditemukan'
  const userAvatar = user?.user_metadata?.avatar_url ?? null

  const selectProject = (projectName: string) => {
    setSelectedProject(projectName)
    setIsDropdownOpen(false)
    setSearchQuery('')
    const proj = projects.find(p => p.project_name === projectName)
    if (proj) {
      router.push(`/projects/${proj.short_id}/info`)
    } else {
      router.push('/projects')
    }
  }

  const filteredProjects = projects.filter(p =>
    p.project_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <header className='sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between bg-background px-6 text-foreground shadow-sm transition-colors'>
      <div className='flex items-center min-w-0 relative' ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className='flex items-center justify-between gap-2 bg-[hsl(var(--surface))] text-[hsl(var(--surface-foreground))] border border-[hsl(var(--border))] rounded px-3 py-1.5 text-xs font-semibold shadow-xs cursor-pointer hover:bg-[hsl(var(--muted))] transition-colors min-w-[220px] max-w-[320px]'
        >
          <span className='truncate'>{selectedProject}</span>
          <ChevronDown size={14} className='text-[hsl(var(--muted-foreground))] shrink-0 ml-1' />
        </button>

        {isDropdownOpen && (
          <div className='absolute left-0 top-full mt-1.5 bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded-md shadow-2xl z-50 p-2 text-[hsl(var(--popover-foreground))] w-[260px]'>
            <div className='relative flex items-center'>
              <Search size={12} className='absolute left-2.5 text-[hsl(var(--muted-foreground))]' />
              <input
                type='text'
                placeholder='Type to search'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded pl-8 pr-2.5 py-1 text-xs focus:outline-none focus:border-[hsl(var(--primary))] placeholder-[hsl(var(--muted-foreground))]'
              />
            </div>

            <div className='max-h-56 overflow-y-auto mt-2 custom-scrollbar pr-0.5 space-y-1'>
              {searchQuery === '' && (
                <div>
                  <div className='text-[hsl(var(--muted-foreground))] text-[9px] font-extrabold tracking-wider px-2 py-1 uppercase'>
                    Modules
                  </div>
                  <div
                    onClick={() => selectProject('Operation Snap Dragon - Indonesia')}
                    className={cn(
                      'rounded px-2 py-1.5 text-xs font-semibold cursor-pointer block transition-colors',
                      selectedProject === 'Operation Snap Dragon - Indonesia'
                        ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-bold'
                        : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--primary))]/10 hover:text-[hsl(var(--primary))]'
                    )}
                  >
                    My work
                  </div>
                </div>
              )}

              <div>
                <div className='text-[hsl(var(--muted-foreground))] text-[9px] font-extrabold tracking-wider px-2 py-1 uppercase mt-1'>
                  Projects
                </div>
                {filteredProjects.length === 0 ? (
                  <div className='text-[hsl(var(--muted-foreground))] text-xs px-2 py-1 italic'>No projects found</div>
                ) : (
                  filteredProjects.map(p => (
                    <div
                      key={p.id}
                      onClick={() => selectProject(p.project_name)}
                      className={cn(
                        'rounded px-2 py-1.5 text-xs font-semibold cursor-pointer block transition-colors truncate',
                        selectedProject === p.project_name
                          ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-bold'
                          : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--primary))]/10 hover:text-[hsl(var(--primary))]'
                      )}
                      title={p.project_name}
                    >
                      {p.project_name}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='flex items-center gap-x-4'>
        <ThemeToggle />

        <UserDropdown userName={userName} userEmail={userEmail} userAvatar={userAvatar} onLogout={logout} />
      </div>
    </header>
  )
}
