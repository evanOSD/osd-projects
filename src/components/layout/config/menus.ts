// src/components/layout/config/menus.ts

import { House, Database, Users, HelpCircle, LucideIcon } from 'lucide-react'

// Tipe data untuk mendefinisikan struktur setiap menu
export type AppMenu = {
  id: string // ID unik untuk disimpan di database (JSONB/Array)
  name: string // Label yang muncul di UI
  path: string // URL tujuan
  icon: LucideIcon // Ikon Lucide
  isMandatory: boolean // Jika true, menu ini TIDAK BISA disembunyikan oleh user (selalu tampil)
  minRole: string[] // Array role yang diizinkan melihat menu ini secara default
}

// SINGLE SOURCE OF TRUTH untuk seluruh menu aplikasi
export const APP_MENUS: AppMenu[] = [
  {
    id: 'dashboard',
    name: 'Home',
    path: '/home',
    icon: House,
    isMandatory: true,
    minRole: ['Staff', 'Consultant', 'Facilitator', 'MTT', 'Guest']
  },
  {
    id: 'database',
    name: 'Database',
    path: '/database/books',
    icon: Database,
    isMandatory: false,
    minRole: ['Staff']
  },
  {
    id: 'users',
    name: 'Users',
    path: '/users/list',
    icon: Users,
    isMandatory: false,
    minRole: ['Staff']
  }
]

// Kita juga bisa menyimpan menu footer di sini jika ingin diatur via database ke depannya
export const FOOTER_MENU: AppMenu = {
  id: 'help',
  name: 'Bantuan',
  path: '/help',
  icon: HelpCircle,
  isMandatory: true,
  minRole: ['Staff', 'Consultant', 'Facilitator', 'MTT', 'Guest']
}
