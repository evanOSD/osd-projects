'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Cookies from 'js-cookie'
import { useTheme } from 'next-themes'
import {
  House,
  Rocket,
  Gauge,
  Settings,
  Globe,
  Map,
  CheckSquare,
  TrendingUp,
  FileText,
  MessageSquare,
  Users,
  Handshake,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Menu,
  Wrench,
  Search,
  Send,
  Sun,
  Moon
} from 'lucide-react'
import { useProject } from '@/context/ProjectContext'
import Tooltip from '@/components/ui/Tooltip'
import { cn } from '@/lib/utils'

export default function VerticalNavbar({ defaultCollapsed = false }: { defaultCollapsed?: boolean }) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const pathname = usePathname()
  const { selectedProject } = useProject()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const [isLanguagePlanningOpen, setIsLanguagePlanningOpen] = useState(true)
  const [isProjectManagementOpen, setIsProjectManagementOpen] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    Cookies.set('sidebarCollapsed', String(newState), { expires: 365 })
  }

  const standardLinks = [
    { name: 'Home', path: '/home', icon: House },
    { name: 'Dashboard', path: '/dummy/stories', icon: Gauge, showWrench: true },
    { name: 'Org. Settings', path: '/placeholder?page=Org. Settings', icon: Settings }
  ]

  const languagePlanningLinks = [
    { name: 'Languages', path: '/database/languages', icon: Globe },
    { name: 'Scripture', path: '/database/books', icon: Map }
  ]

  const projectManagementLinks =
    selectedProject === 'Operation Snap Dragon - Indonesia'
      ? [
          { name: 'Projects', path: '/placeholder?page=Projects', icon: CheckSquare },
          { name: 'Goals & Analytics', path: '/placeholder?page=Goals %26 Analytics', icon: TrendingUp },
          { name: 'Key Documents', path: '/placeholder?page=Key Documents', icon: FileText },
          { name: 'Project Reports', path: '/placeholder?page=Project Reports', icon: MessageSquare },
          { name: 'Workforce', path: '/users', icon: Users },
          { name: 'Partners', path: '/placeholder?page=Partners', icon: Handshake },
          { name: 'Portfolios', path: '/placeholder?page=Portfolios', icon: Briefcase }
        ]
      : [
          { name: 'Plan & Progress', path: '/placeholder?page=Plan %26 Progress', icon: CheckSquare },
          { name: 'Team Reports', path: '/placeholder?page=Team Reports', icon: Send },
          { name: 'Project Reports', path: '/placeholder?page=Project Reports', icon: MessageSquare },
          { name: 'Workforce', path: '/placeholder?page=Workforce', icon: Users },
          { name: 'Partners', path: '/placeholder?page=Partners', icon: Handshake },
          { name: 'Key Documents', path: '/placeholder?page=Key Documents', icon: FileText }
        ]

  return (
    <aside
      className={cn(
        'relative hidden flex-col bg-[hsl(var(--surface))] text-[hsl(var(--surface-foreground))] md:flex transition-all duration-300 ease-in-out border-r border-[hsl(var(--border))] shrink-0 h-screen select-none',
        isCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Brand Header */}
      <div className='h-14 shrink-0 flex items-center justify-between px-4 border-b border-[hsl(var(--border))]'>
        {!isCollapsed ? (
          <div className='flex items-center gap-2 select-none min-w-0'>
            <img src='/images/logos/osd-logo-192.svg' alt='OSD Logo' className='h-8 w-auto shrink-0' />
            <span className='text-[10px] text-[hsl(var(--muted-foreground))] font-semibold truncate'>v0.1.0</span>
          </div>
        ) : (
          <button
            onClick={toggleSidebar}
            className='p-1.5 rounded-md text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors cursor-pointer mx-auto'
            aria-label='Toggle Sidebar'
          >
            <Menu size={18} />
          </button>
        )}
        {!isCollapsed && (
          <button
            onClick={toggleSidebar}
            className='p-1.5 rounded-md text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors cursor-pointer'
            aria-label='Toggle Sidebar'
          >
            <Menu size={18} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className='flex-1 overflow-y-auto px-3 py-4 custom-scrollbar space-y-2'>
        <div className='space-y-0.5'>
          {standardLinks.map(item => {
            const isActive = pathname === item.path
            return isCollapsed ? (
              <Tooltip content={item.name} key={item.name}>
                <Link
                  href={item.path}
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-md transition-colors cursor-pointer my-1 mx-auto',
                    isActive
                      ? 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]'
                      : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50'
                  )}
                >
                  <item.icon size={18} />
                </Link>
              </Tooltip>
            ) : (
              <Link
                key={item.name}
                href={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-semibold transition-colors cursor-pointer my-0.5',
                  isActive
                    ? 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] border-l-2 border-[hsl(var(--primary))] font-bold'
                    : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50'
                )}
              >
                <item.icon size={16} className='shrink-0' />
                <span className='truncate'>{item.name}</span>
                {item.showWrench && (
                  <div
                    onClick={e => {
                      e.preventDefault()
                      e.stopPropagation()
                      alert('Dashboard Settings clicked!')
                    }}
                    className='ml-auto p-0.5 rounded bg-[hsl(var(--muted-hover))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors'
                  >
                    <Wrench size={11} />
                  </div>
                )}
              </Link>
            )
          })}
        </div>

        <div>
          {isCollapsed ? (
            <div className='w-8 h-px bg-[hsl(var(--border))] mx-auto my-4' />
          ) : (
            <button
              onClick={() => setIsLanguagePlanningOpen(!isLanguagePlanningOpen)}
              className='flex items-center justify-between w-full text-left text-[10px] font-extrabold uppercase tracking-wider text-[#10b981] px-3 py-2 mt-4 hover:text-[#059669] cursor-pointer'
            >
              <span>Database</span>
              {isLanguagePlanningOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </button>
          )}

          {isLanguagePlanningOpen && (
            <div className='space-y-0.5'>
              {languagePlanningLinks.map(item => {
                const isActive = pathname === item.path
                return isCollapsed ? (
                  <Tooltip content={item.name} key={item.name}>
                    <Link
                      href={item.path}
                      className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-md transition-colors cursor-pointer my-1 mx-auto',
                        isActive
                          ? 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]'
                          : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50'
                      )}
                    >
                      <item.icon size={18} />
                    </Link>
                  </Tooltip>
                ) : (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-semibold transition-colors cursor-pointer my-0.5 pl-6',
                      isActive
                        ? 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] border-l-2 border-[hsl(var(--primary))] font-bold'
                        : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50'
                    )}
                  >
                    <item.icon size={16} className='shrink-0' />
                    <span className='truncate'>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        <div>
          {isCollapsed ? (
            <div className='w-8 h-px bg-[hsl(var(--border))] mx-auto my-4' />
          ) : (
            <button
              onClick={() => setIsProjectManagementOpen(!isProjectManagementOpen)}
              className='flex items-center justify-between w-full text-left text-[10px] font-extrabold uppercase tracking-wider text-[#10b981] px-3 py-2 mt-4 hover:text-[#059669] cursor-pointer'
            >
              <span>Project Management</span>
              {isProjectManagementOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </button>
          )}

          {isProjectManagementOpen && (
            <div className='space-y-0.5'>
              {projectManagementLinks.map(item => {
                const isActive = pathname === item.path
                return isCollapsed ? (
                  <Tooltip content={item.name} key={item.name}>
                    <Link
                      href={item.path}
                      className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-md transition-colors cursor-pointer my-1 mx-auto',
                        isActive
                          ? 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]'
                          : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50'
                      )}
                    >
                      <item.icon size={18} />
                    </Link>
                  </Tooltip>
                ) : (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-semibold transition-colors cursor-pointer my-0.5 pl-6',
                      isActive
                        ? 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] border-l-2 border-[hsl(var(--primary))] font-bold'
                        : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50'
                    )}
                  >
                    <item.icon size={16} className='shrink-0' />
                    <span className='truncate'>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
