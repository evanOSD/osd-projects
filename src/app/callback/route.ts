// src/app/auth/callback/route.ts

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // PERBAIKAN: Jika tidak ada url 'next' yang spesifik, maka otomatis arahkan ke /home
  // Di kode Anda sebelumnya, ini mengarah ke '/'
  const next = searchParams.get('next') ?? '/home'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch (error) {
              // Abaikan error jika dipanggil dari Server Component
            }
          }
        }
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Jika berhasil login, akan diredirect ke localhost:3000/home
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Jika gagal, kembalikan ke login dengan pesan error
  return NextResponse.redirect(`${origin}/login?error=Terjadi_kesalahan`)
}
