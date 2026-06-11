// src/app/(dashboard)/database/layout.tsx

import type { Metadata } from 'next'
import { PageTabs } from '@/components/ui/Tabs'

export const metadata: Metadata = {
  title: 'Users'
}

const usersTabs = [
  { name: 'Daftar User', path: '/users/list' },
  { name: 'Hak Akses', path: '/users/permissions' }
]

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageTabs tabs={usersTabs} />
      <div className='p-6'>{children}</div>
    </>
  )
}
