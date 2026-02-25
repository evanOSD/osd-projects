// src/proxy.ts

import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// UBAH: Nama fungsi dari 'middleware' menjadi 'proxy'
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request
  })

  // 1. Buat "Pipa Supabase" versi Server
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        }
      }
    }
  )

  // 2. Cek Kartu Identitas (Apakah user sudah login?)
  const {
    data: { user }
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // 3. Daftarkan halaman-halaman yang BOLEH diakses tanpa login (Halaman Publik)
  const isPublicPage = pathname.startsWith('/login') || pathname.startsWith('/callback')

  // ATURAN A: Jika belum login, dan mencoba masuk ke halaman rahasia -> Tendang ke /login
  if (!user && !isPublicPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // ATURAN B: Jika SUDAH login, tapi malah mencoba buka halaman /login -> Arahkan ke /home
  if (user && pathname.startsWith('/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/home'
    return NextResponse.redirect(url)
  }

  // ATURAN C: Jika membuka halaman utama kosong (/) -> Langsung arahkan ke /home (atau /login)
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = user ? '/home' : '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

// 4. Tentukan area patroli Satpam (Abaikan aset statis)
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
}
