// src/app/(dashboard)/users/permissions/page.tsx

'use client'

import { StandardTable } from '@/components/ui/StandardTable'
import { PERMISSIONS_TABLE_CONFIG } from './config/constants'
import { usePermissionsPageLogic } from './hooks/usePermissionsPageLogic'

export default function PermissionsPage() {
  const logicData = usePermissionsPageLogic()

  return <StandardTable title={PERMISSIONS_TABLE_CONFIG.title} logicData={logicData} />
}
