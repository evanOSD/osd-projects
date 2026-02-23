// src/components/layout/topbarcomponents/UserSettings.tsx

"use client"

import { Settings } from "lucide-react"

export default function UserSettings() {
  return (
    <button className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm text-foreground transition-colors hover:bg-primary/20">
      <Settings size={16} /><span>Settings</span>
    </button>
  )
}
