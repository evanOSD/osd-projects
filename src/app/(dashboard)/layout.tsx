// src/app/(dashboard)/layout.tsx
import { cookies } from "next/headers"
import VerticalNavbar from "@/components/layout/VerticalNavbar"
import Topbar from "@/components/layout/Topbar"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // BACA COOKIE DARI SERVER: Mencegah sidebar "jeglek"
  const cookieStore = await cookies()
  const sidebarCollapsed = cookieStore.get("sidebarCollapsed")?.value === "true"

  return (
    <div className="flex h-screen overflow-hidden">
      <VerticalNavbar defaultCollapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
