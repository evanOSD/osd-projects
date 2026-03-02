// src/app/(dashboard)/database/layout.tsx

import type { Metadata } from "next"
import { PageTabs } from "@/components/ui/Tabs"

export const metadata: Metadata = {
  title: "Database",
}

const databaseTabs = [
  { name: 'Books', path: '/database/books' },
  { name: 'Passages', path: '/database/passages' },
  { name: 'Stories', path: '/database/stories' },
  { name: 'Languages', path: '/database/languages' },
  { name: 'Steps', path: '/database/steps' },
]

export default function DatabaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageTabs tabs={databaseTabs} />
      <div className="p-6">
        {children}
      </div>
    </>
  )
}
