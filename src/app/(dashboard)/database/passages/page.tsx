// src/app/(dashboard)/database/passages/page.tsx

'use client'

import { StandardTable } from '@/components/ui/StandardTable'
import { PASSAGE_TABLE_CONFIG } from './config/constants'
import { usePassagesPageLogic } from './hooks/usePassagesPageLogic'

export default function PassagesPage() {
  const logicData = usePassagesPageLogic()

  return <StandardTable title={PASSAGE_TABLE_CONFIG.title} logicData={logicData} />
}
