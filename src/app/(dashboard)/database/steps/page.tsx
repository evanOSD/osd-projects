// src/app/(dashboard)/database/steps/page.tsx

'use client'

import { StandardTable } from '@/components/ui/StandardTable'
import { STEP_TABLE_CONFIG } from './config/constants'
import { useStepsPageLogic } from './hooks/useStepsPageLogic'

export default function StepsPage() {
  const logicData = useStepsPageLogic()

  return <StandardTable title={STEP_TABLE_CONFIG.title} logicData={logicData} />
}
