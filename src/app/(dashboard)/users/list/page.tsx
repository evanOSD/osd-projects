// src/app/(dashboard)/users/page.tsx

'use client'

import { StandardTable } from '@/components/ui/StandardTable'
import { useUsersPageLogic } from './hooks/useUsersPageLogic'
import { USER_TABLE_CONFIG } from './config/constants'

export default function UsersPage() {
  const logicData = useUsersPageLogic()

  return <StandardTable title={USER_TABLE_CONFIG.title} logicData={logicData} />
}
