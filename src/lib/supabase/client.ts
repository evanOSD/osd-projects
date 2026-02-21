// src/lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Ini akan otomatis mengambil URL dan KEY dari file .env Anda
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
