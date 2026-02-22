// src/components/layout/UserProfile.tsx

"use client"

import { User } from "lucide-react"

interface UserProfileProps {
  userName: string
  userEmail: string
}

export default function UserProfile({ userName, userEmail }: UserProfileProps) {
  return (
    <>
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-semibold text-foreground truncate">
          {userName}
        </p>
        <p className="text-xs text-muted truncate mt-0.5">
          {userEmail}
        </p>
      </div>
      
      {/* UBAH: hover:bg-accent menjadi hover:bg-primary/20 */}
      <button className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm text-foreground transition-colors hover:bg-primary/20 mt-1">
        <User size={16} /><span>Profile</span>
      </button>
    </>
  )
}
