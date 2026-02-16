// src/app/(dashboard)/lookup/page.tsx

// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import LookupWrapper from '@/views/lookup'

// Dynamic Imports untuk 5 Tabel (Fitur Code Splitting bawaan Next.js)
const BooksTab = dynamic(() => import('@views/lookup/books'))
const PassagesTab = dynamic(() => import('@views/lookup/passages'))
const StoriesTab = dynamic(() => import('@views/lookup/stories'))
const StepsTab = dynamic(() => import('@views/lookup/steps'))
const LanguagesTab = dynamic(() => import('@views/lookup/languages'))

// Daftar konten tab yang akan dikirim ke wrapper
const tabContentList = (): { [key: string]: ReactElement } => ({
  books: <BooksTab />,
  passages: <PassagesTab />,
  stories: <StoriesTab />,
  languages: <LanguagesTab />,
  steps: <StepsTab />,
})

const LookupPage = () => {
  return <LookupWrapper tabContentList={tabContentList()} />
}

export default LookupPage
