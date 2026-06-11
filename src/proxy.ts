// src/proxy.ts

import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { hasAccess } from '@/config/routePermissions'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

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
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        }
      }
    }
  )

  const {
    data: { user }
  } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname
  const isPublicPage = pathname.startsWith('/login') || pathname.startsWith('/callback')

  if (!user && !isPublicPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    // Ambil Role DAN status Aktif dari tabel public.users
    const { data: userData } = await supabase.from('users').select('role, is_active').eq('id', user.id).single()

    const role = userData?.role || 'Unknown'
    const isActive = userData?.is_active ?? false

    // LAPIS 1: Cek Saklar Utama (Mati) atau Role (Unknown)
    if (!isActive || role === 'Unknown') {
      if (pathname !== '/unauthorized') {
        const url = request.nextUrl.clone()
        url.pathname = '/unauthorized'
        return NextResponse.redirect(url)
      }
    }
    // LAPIS 2: User Aktif dan Punya Role Jelas
    else {
      if (pathname.startsWith('/login') || pathname === '/' || pathname === '/unauthorized') {
        const url = request.nextUrl.clone()
        url.pathname = '/home'
        return NextResponse.redirect(url)
      }

      // LAPIS 3: Cek Kamus Rute (Apakah Guest boleh ke /users ?)
      if (!hasAccess(role, pathname)) {
        const url = request.nextUrl.clone()
        url.pathname = '/home'

        // Buat Surat Tilang di URL
        url.searchParams.set('error', 'access_denied')
        url.searchParams.set('path', pathname)

        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
}
