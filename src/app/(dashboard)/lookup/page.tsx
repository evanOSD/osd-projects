// src/app/(dashboard)/lookup/page.tsx

import { useMemo } from 'react'

import dynamic from 'next/dynamic'

import LookupWrapper from '@/views/lookup'

// 1. Dynamic imports HARUS di luar komponen
const BooksTab = dynamic(() => import('@views/lookup/books'))
const PassagesTab = dynamic(() => import('@views/lookup/passages'))
const StoriesTab = dynamic(() => import('@views/lookup/stories'))
const LanguagesTab = dynamic(() => import('@views/lookup/languages'))
const StepsTab = dynamic(() => import('@views/lookup/steps'))

const LookupPage = () => {
  // 2. Gunakan useMemo supaya OBJEK ini tidak dibuat ulang tiap detik
  const tabContent = useMemo(() => ({
    books: <BooksTab />,
    passages: <PassagesTab />,
    stories: <StoriesTab />,
    languages: <LanguagesTab />,
    steps: <StepsTab />,
  }), []) // Array kosong artinya cuma dibuat sekali pas mount

  return <LookupWrapper tabContentList={tabContent} />
}

export default LookupPage
