// src/context/ErrorContext.tsx

'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import ErrorModal from '@/components/ui/ErrorModal'

interface ErrorContextType {
  showError: (message: string) => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const showError = (message: string) => {
    setErrorMessage(message)
    setIsOpen(true)
  }

  const closeError = () => {
    setIsOpen(false)
    setErrorMessage('')
  }

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      {/* Modal ini akan standby di seluruh aplikasi */}
      <ErrorModal isOpen={isOpen} message={errorMessage} onClose={closeError} />
    </ErrorContext.Provider>
  )
}

// Hook custom agar mudah dipanggil di komponen lain
export const useError = () => {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error('useError harus digunakan di dalam ErrorProvider')
  }
  return context
}
