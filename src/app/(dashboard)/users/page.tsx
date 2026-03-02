// src/app/(dashboard)/users/page.tsx

'use client'

import { StandardTable } from '@/components/ui/StandardTable'
import { USER_TABLE_CONFIG } from './config/constants'
import { useUsersPageLogic } from './hooks/useUsersPageLogic'

export default function UsersPage() {
  const logicData = useUsersPageLogic()

  return <StandardTable title={USER_TABLE_CONFIG.title} logicData={logicData} />
}
