// src/app/(dashboard)/home/page.tsx

import type { Metadata } from 'next' // Tambahkan import ini
import { PageTabs } from '@/components/ui/Tabs'
import { P } from '@/components/ui/Typography'
import { Card } from '@/components/ui/Card'

// Tambahkan deklarasi judul halaman
export const metadata: Metadata = {
  title: 'Home'
}

export default function HomePage() {
  return (
    <>
      {/* Tab Tunggal untuk Home (Path diubah ke /home) */}
      <PageTabs tabs={[{ name: 'Overview', path: '/home' }]} />

      <div className='p-6 space-y-6'>
        <Card className='p-6'>
          <P>
            Selamat datang di <strong>OSD Projects</strong>!
          </P>
          <P>
            Halaman beranda (Home) ini masih dalam tahap konstruksi. Nantinya grafik, chart, dan ringkasan data akan
            diletakkan di sini. Silakan beralih ke menu <strong>Database</strong> di Sidebar untuk melihat sistem
            navigasi Tab yang baru.
          </P>
        </Card>
      </div>
    </>
  )
}
