// middleware.ts

import { NextResponse, type NextRequest } from 'next/server'

import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // Setup respons standar Next.js
  let supabaseResponse = NextResponse.next({
    request,
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
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 2. Cek Kartu Identitas (Apakah user sudah login?)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 3. Daftarkan halaman-halaman yang BOLEH diakses tanpa login (Halaman Publik)
  const isAuthPage = 
    request.nextUrl.pathname.startsWith('/login') ||
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // request.nextUrl.pathname.startsWith('/register') ||
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // request.nextUrl.pathname.startsWith('/forgot-password') ||
    request.nextUrl.pathname.startsWith('/auth')

  // ATURAN A: Jika belum login, dan mencoba masuk ke halaman rahasia -> Tendang ke /login
  if (!user && !isAuthPage) {
    const url = request.nextUrl.clone()

    url.pathname = '/login'
    
return NextResponse.redirect(url)
  }

  // ATURAN B: Jika SUDAH login, tapi malah mencoba buka halaman /login -> Arahkan ke / (Dashboard)
  if (user && isAuthPage) {
    const url = request.nextUrl.clone()

    url.pathname = '/'
    
return NextResponse.redirect(url)
  }

  return supabaseResponse
}

// 4. Tentukan area patroli Satpam (Jangan patroli di file gambar, logo, css, dll)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
