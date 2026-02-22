// src/app/(dashboard)/database/layout.tsx

import { PageTabs } from "@/components/ui/Tabs"

const databaseTabs = [
  { name: 'Books', path: '/database/books' },
  { name: 'Stories', path: '/database/stories' },
  { name: 'Passages', path: '/database/passages' },
  { name: 'Languages', path: '/database/languages' },
  { name: 'Steps', path: '/database/steps' },
]

export default function DatabaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageTabs tabs={databaseTabs} />
      
      {/* KITA PINDAHKAN p-6 KE SINI. 
          Jadi Tab tetap penuh di atas, tapi konten tabelnya rapi berjarak. 
      */}
      <div className="p-6">
        {children}
      </div>
    </>
  )
}
