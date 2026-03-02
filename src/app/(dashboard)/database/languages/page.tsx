// src/app/(dashboard)/database/languages/page.tsx

'use client'

import { StandardTable } from '@/components/ui/StandardTable'
import { LANGUAGE_TABLE_CONFIG } from './config/constants'
import { useLanguagesPageLogic } from './hooks/useLanguagesPageLogic'

export default function LanguagesPage() {
  const logicData = useLanguagesPageLogic()

  return <StandardTable title={LANGUAGE_TABLE_CONFIG.title} logicData={logicData} />
}
