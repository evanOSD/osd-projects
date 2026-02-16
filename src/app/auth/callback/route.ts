// Next Imports
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Third-party Imports
import { createServerClient } from '@supabase/ssr'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // Jika berhasil, arahkan ke Dashboard (/)
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()

    // ESLint meminta jarak satu baris (enter) di atas statement ini
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
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch (error) {
              // Abaikan jika error saat render server
            }
          }
        }
      }
    )

    // Proses menukarkan "Kode Resi" menjadi "Cookie Sesi Login"
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Jika sukses, lempar user ke Dashboard
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Jika kode kadaluarsa atau error, kembalikan ke login
  return NextResponse.redirect(`${origin}/login?error=auth-failed`)
}
