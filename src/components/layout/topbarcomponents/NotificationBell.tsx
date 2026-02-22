// src/components/layout/NotificationBell.tsx

"use client"

import { Bell } from 'lucide-react'

export default function NotificationBell() {
  return (
    <button className="relative cursor-pointer rounded-full p-2 text-muted hover:bg-accent hover:text-foreground transition-all">
      <Bell size={20} />
      {/* Titik Merah Indikator Notifikasi Aktif */}
      {/* Menggunakan bg-danger dan border dari warna surface untuk menyatu dengan background */}
      <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-danger shadow-[0_0_0_2px_hsl(var(--surface))]"></span>
    </button>
  )
}
