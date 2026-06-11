// src/app/unauthorized/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ShieldAlert, LogOut, MessageCircle } from 'lucide-react'

export default function UnauthorizedPage() {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-background p-6 text-center'>
      <div className='w-full max-w-md p-8 space-y-6 bg-surface rounded-2xl border border-border shadow-xl animate-in fade-in zoom-in duration-500'>
        {/* Ikon Peringatan */}
        <div className='flex justify-center'>
          <div className='p-4 bg-warning/10 rounded-full'>
            <ShieldAlert className='w-12 h-12 text-warning' />
          </div>
        </div>

        {/* Judul & Deskripsi */}
        <div className='space-y-2'>
          <h1 className='text-2xl font-extrabold tracking-tight text-foreground'>Akses Tertahan</h1>
          <p className='text-muted text-sm leading-relaxed'>
            Halo! Akun Anda berhasil terdaftar di sistem OSD, namun saat ini Anda berada dalam status{' '}
            <span className='font-mono bg-muted px-1 rounded text-warning'>Unknown</span>.
          </p>
        </div>

        {/* Kotak Informasi */}
        <div className='p-4 bg-warning/50 rounded-lg border border-border text-left space-y-3'>
          <p className='text-xs text-fooreground leading-relaxed'>
            Demi keamanan data organisasi, setiap pengguna baru memerlukan verifikasi peran (Role) oleh Administrator
            sebelum dapat mengakses fitur Dashboard.
          </p>
        </div>

        {/* Aksi */}
        <div className='flex flex-col gap-3'>
          <a
            href='https://wa.me/628123456789' // Ganti dengan nomor Admin OSD asli
            target='_blank'
            className='flex cursor-pointer items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all'
          >
            <MessageCircle className='w-4 h-4' />
            Hubungi Admin OSD
          </a>

          <button
            onClick={handleLogout}
            className='flex cursor-pointer items-center justify-center gap-2 w-full py-3 px-4 bg-surface border border-border text-foreground font-medium rounded-xl hover:bg-danger hover:text-primary-foreground transition-all'
          >
            <LogOut className='w-4 h-4' />
            Keluar (Logout)
          </button>
        </div>

        <p className='text-[11px] text-muted-foreground uppercase tracking-widest pt-4'>
          OSD Projects Security
        </p>
      </div>
    </div>
  )
}
