// src/components/layout/topbarcomponents/LogoutButton.tsx

'use client'

import { LogOut } from 'lucide-react'

export default function LogoutButton({ onLogout }: { onLogout?: () => void }) {
  return (
    <div className='border-t border-border py-1'>
      <button
        onClick={onLogout}
        className='flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/20 outline-none'
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </div>
  )
}
