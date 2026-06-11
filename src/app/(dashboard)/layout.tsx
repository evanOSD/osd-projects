import { cookies } from 'next/headers'
import VerticalNavbar from '@/components/layout/VerticalNavbar'
import Topbar from '@/components/layout/Topbar'
import { AuthProvider } from '@/providers/AuthProvider'
import { ProjectProvider } from '@/context/ProjectContext'
import RouteErrorListener from '@/components/ui/RouteErrorListener'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const sidebarCollapsed = cookieStore.get('sidebarCollapsed')?.value === 'true'

  return (
    <AuthProvider>
      <ProjectProvider>
        <div className='flex h-screen overflow-hidden bg-surface text-foreground'>
          <VerticalNavbar defaultCollapsed={sidebarCollapsed} />
          <div className='flex-1 flex flex-col min-w-0'>
            <Topbar />
            <main className='flex-1 overflow-auto relative'>{children}</main>
          </div>

          <RouteErrorListener />
        </div>
      </ProjectProvider>
    </AuthProvider>
  )
}
