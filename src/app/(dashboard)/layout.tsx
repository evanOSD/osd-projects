// src/app/(dashboard)/layout.tsx

import { cookies } from "next/headers"
import VerticalNavbar from "@/components/layout/VerticalNavbar"
import Topbar from "@/components/layout/Topbar"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const sidebarCollapsed = cookieStore.get("sidebarCollapsed")?.value === "true"

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-foreground">
      <VerticalNavbar defaultCollapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        {/* PERUBAHAN KRUSIAL: p-6 dihapus dari sini. 
            <main> sekarang murni menjadi wadah scroll yang menyentuh ujung layar.
        */}
        <main className="flex-1 overflow-auto relative">
          {children}
        </main>
      </div>
    </div>
  )
}
