// src/@core/utils/supabaseClient.ts

import { createBrowserClient } from '@supabase/ssr'

import type { Database } from '@/types/supabase' // Memanggil tipe data canggih Anda

// Menyimpan instance di luar fungsi agar menjadi Singleton (Tunggal)
let supabase: ReturnType<typeof createBrowserClient<Database>> | undefined

export function createClient() {
  if (supabase) {
    return supabase
  }

  supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return supabase
}
