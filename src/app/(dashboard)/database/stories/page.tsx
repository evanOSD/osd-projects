// src/app/(dashboard)/database/stories/page.tsx

'use client'

import { StandardTable } from '@/components/ui/StandardTable'
import { STORY_TABLE_CONFIG } from './config/constants'
import { useStoriesPageLogic } from './hooks/useStoriesPageLogic'

export default function StoriesPage() {
  const logicData = useStoriesPageLogic()

  return <StandardTable title={STORY_TABLE_CONFIG.title} logicData={logicData} />
}
