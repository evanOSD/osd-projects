// src/components/layout/topbarcomponents/UserDropdown.tsx

'use client'

import { useState, useRef } from 'react'
import { User } from 'lucide-react'
import { PopoverCalculator } from '@/components/ui/tablecomponents/PopoverCalculator'
import UserProfile from './UserProfile'
import UserSettings from './UserSettings'
import LogoutButton from './LogoutButton'

interface UserDropdownProps {
  userName?: string
  userEmail?: string
  userAvatar?: string | null
  onLogout?: () => void
}

export default function UserDropdown({
  userName = 'Pengguna OSD',
  userEmail = 'Email tidak ditemukan',
  userAvatar = null,
  onLogout
}: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className='flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border bg-surface transition-all hover:ring-2 hover:ring-primary focus:outline-none'
      >
        {userAvatar ? (
          <img src={userAvatar} alt={userName} className='h-full w-full object-cover' />
        ) : (
          <User size={20} className='text-muted' />
        )}
      </button>

      <PopoverCalculator
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        triggerRef={buttonRef}
        className='w-64 rounded-xl border border-border bg-surface shadow-xl z-100 animate-in fade-in zoom-in-95'
      >
        <UserProfile userName={userName} userEmail={userEmail} />
        <div className='py-1'>
          <UserSettings />
        </div>
        <LogoutButton onLogout={onLogout} />
      </PopoverCalculator>
    </>
  )
}
