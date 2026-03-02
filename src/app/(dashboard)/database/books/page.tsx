// src/app/(dashboard)/database/books/page.tsx

'use client'

import { StandardTable } from '@/components/ui/StandardTable'
import { BOOK_TABLE_CONFIG } from './config/constants'
import { useBooksPageLogic } from './hooks/useBooksPageLogic'

export default function BooksPage() {
  const logicData = useBooksPageLogic()

  // Luar biasa bersih, bukan?
  return <StandardTable title={BOOK_TABLE_CONFIG.title} logicData={logicData} />
}
