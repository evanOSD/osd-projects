// src/app/(dashboard)/dummy/page.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { ChevronRight, Search, Bell, Moon, Sun, AlertTriangle } from 'lucide-react'

// Import komponen-komponen yang sudah di pisah
import { Button } from './Buttons'
import { Input } from './Forms'
import { Select } from './Select'
import { MultiSelect } from './MultiSelect'
import { DatePicker } from './DatePicker'
import { TimePicker } from './TimePicker'
import { TimestampPicker } from './TimestampPicker'
import { MonthPicker } from './MonthPicker'
import { Badge } from './Badges'
import { Alert } from './Alerts'
import { Modal } from './Modal'

// ==========================================
// KOMPONEN CARD / KARTU (Sisa yang belum di pisah)
// ==========================================
export interface CardProps {
  children: React.ReactNode
  className?: string
}

const Card = ({ children, className = '' }: CardProps) => (
  <div
    className={`bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-[calc(var(--radius)*1.5)] border border-[hsl(var(--border))] shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </div>
)

// ==========================================
// APLIKASI UTAMA (SHOWCASE KOMPONEN)
// ==========================================
export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // State untuk form
  const [selectedRole, setSelectedRole] = useState<string | number | ''>('')
  const [selectedTags, setSelectedTags] = useState<(string | number)[]>([])

  // State untuk komponen Date/Time custom
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [selectedTimestamp, setSelectedTimestamp] = useState<Date | undefined>(undefined)
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(undefined)

  // Toggle kelas 'dark' di elemen induk
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'dark' : ''}`}>
      {/* Wrapper meniru gaya `body` di CSS Anda */}
      <div className='min-h-screen bg-linear-to-br from-[hsl(var(--bg-start))] to-[hsl(var(--bg-end))] text-foreground p-6 md:p-12 transition-colors duration-300'>
        <div className='max-w-4xl mx-auto space-y-12'>
          {/* Header & Theme Toggle */}
          <div className='pb-8 border-b border-[hsl(var(--border))] flex justify-between items-center'>
            <div>
              <h1 className='text-3xl font-bold tracking-tight text-foreground'>PedalMonk UI</h1>
              <p className='mt-2 text-muted-foreground text-lg'>
                Komponen UI yang diadaptasi dengan design tokens khusus Anda.
              </p>
            </div>
            <Button variant='outline' onClick={() => setIsDarkMode(!isDarkMode)} icon={isDarkMode ? Sun : Moon}>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>

          {/* Section: Tombol */}
          <section className='space-y-6'>
            <div className='space-y-1'>
              <h2 className='text-xl font-semibold flex items-center text-foreground'>
                <ChevronRight className='w-5 h-5 text-muted-foreground mr-1' /> 1. Tombol (Buttons)
              </h2>
              <p className='text-muted-foreground text-sm ml-6'>
                Berbagai variasi tombol dengan warna primary dan secondary baru.
              </p>
            </div>
            <Card className='p-6'>
              <div className='flex flex-wrap gap-4 items-center mb-6'>
                <Button variant='primary'>Primary</Button>
                <Button variant='secondary'>Secondary</Button>
                <Button variant='outline'>Outline</Button>
                <Button variant='danger'>Danger</Button>
                <Button variant='ghost'>Ghost</Button>
                <Button variant='primary' disabled>
                  Disabled
                </Button>
              </div>
              <div className='flex flex-wrap gap-4 items-center'>
                <Button variant='primary' icon={Search}>
                  Cari Data
                </Button>
                <Button variant='outline' size='sm'>
                  Ukuran Kecil
                </Button>
                <Button variant='secondary' size='lg'>
                  Ukuran Besar
                </Button>
              </div>
            </Card>
          </section>

          {/* Section: Input */}
          <section className='space-y-6'>
            <div className='space-y-1'>
              <h2 className='text-xl font-semibold flex items-center text-foreground'>
                <ChevronRight className='w-5 h-5 text-muted-foreground mr-1' /> 2. Formulir (Inputs & Selects)
              </h2>
              <p className='text-muted-foreground text-sm ml-6'>
                Elemen form yang mendukung focus ring dan state error sesuai tema.
              </p>
            </div>

            <Card className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Input
                  id='email'
                  label='Alamat Email'
                  placeholder='nama@email.com'
                  type='email'
                  helperText='Kami tidak akan membagikan email Anda.'
                />
                <Input
                  id='password'
                  label='Kata Sandi'
                  placeholder='••••••••'
                  type='password'
                  error='Kata sandi minimal harus 8 karakter.'
                />
                <Input id='disabled-input' label='Username (Tidak dapat diubah)' value='pengguna_aktif' disabled />

                <Select
                  id='role'
                  label='Peran Pengguna'
                  placeholder='Pilih peran'
                  value={selectedRole}
                  onChange={setSelectedRole}
                  isClearable
                  helperText={
                    selectedRole ? `Peran yang dipilih saat ini: ${selectedRole}` : 'Silakan pilih satu peran.'
                  }
                  options={[
                    { label: 'Administrator', value: 'admin' },
                    { label: 'Editor', value: 'editor' },
                    { label: 'Viewer', value: 'viewer' }
                  ]}
                />

                <MultiSelect
                  id='tags'
                  label='Tag Keterampilan (Multi Select)'
                  placeholder='Pilih satu atau lebih...'
                  value={selectedTags}
                  onChange={setSelectedTags}
                  isClearable
                  options={[
                    { label: 'React', value: 'react' },
                    { label: 'Next.js', value: 'nextjs' },
                    { label: 'Tailwind CSS', value: 'tailwind' },
                    { label: 'TypeScript', value: 'typescript' },
                    { label: 'Node.js', value: 'nodejs' }
                  ]}
                  helperText={
                    selectedTags.length > 0
                      ? `${selectedTags.length} keterampilan dipilih.`
                      : 'Pilih keterampilan yang relevan.'
                  }
                />
              </div>
            </Card>

            {/* CARD BARU: Date & Time Pickers (3 Kolom Perbandingan) */}
            <Card className='p-6'>
              <div className='mb-6'>
                <h3 className='text-lg font-medium text-foreground'>Perbandingan Date & Time Pickers</h3>
                <p className='text-sm text-muted-foreground'>
                  Membandingkan komponen custom (berbasis Portal & Lucide Icons) dengan elemen input bawaan browser
                  (Native).
                </p>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-6'>
                {/* Kolom 1: Date Pickers */}
                <div className='flex flex-col space-y-5 border-l-4 border-[hsl(var(--primary))] pl-4 py-1'>
                  <div>
                    <DatePicker
                      id='custom-date'
                      label='Tanggal (Custom)'
                      value={selectedDate}
                      onChange={setSelectedDate}
                      isClearable
                      helperText='Komponen DatePicker interaktif custom.'
                    />
                  </div>
                  <div>
                    <Input
                      id='date-picker-native'
                      label='Tanggal (Native)'
                      type='date'
                      helperText='Input type="date" bawaan browser.'
                    />
                  </div>
                </div>

                {/* Kolom 2: Time Pickers */}
                <div className='flex flex-col space-y-5 border-l-4 border-[hsl(var(--secondary))] pl-4 py-1'>
                  <div>
                    <TimePicker
                      id='custom-time'
                      label='Waktu (Custom)'
                      value={selectedTime}
                      onChange={setSelectedTime}
                      isClearable
                      helperText='Komponen TimePicker custom 2 kolom.'
                    />
                  </div>
                  <div>
                    <Input
                      id='time-picker-native'
                      label='Waktu (Native)'
                      type='time'
                      helperText='Input type="time" bawaan browser.'
                    />
                  </div>
                </div>

                {/* Kolom 3: Timestamp Pickers */}
                <div className='flex flex-col space-y-5 border-l-4 border-[hsl(var(--warning))] pl-4 py-1'>
                  <div>
                    <TimestampPicker
                      id='custom-timestamp'
                      label='Timestamp (Custom)'
                      value={selectedTimestamp}
                      onChange={setSelectedTimestamp}
                      isClearable
                      helperText='Kombinasi kalender dan waktu custom.'
                    />
                  </div>
                  <div>
                    <Input
                      id='timestamp-picker-native'
                      label='Timestamp (Native)'
                      type='datetime-local'
                      helperText='Input type="datetime-local" bawaan browser.'
                    />
                  </div>
                </div>

                {/* Kolom 4: Month Pickers */}
                <div className='flex flex-col space-y-5 border-l-4 border-[hsl(var(--success))] pl-4 py-1'>
                  <div>
                    <MonthPicker
                      id='custom-month'
                      label='Bulan (Custom)'
                      value={selectedMonth}
                      onChange={setSelectedMonth}
                      isClearable
                      helperText='Komponen MonthPicker interaktif custom.'
                    />
                  </div>
                  <div>
                    <Input
                      id='month-picker-native'
                      label='Bulan (Native)'
                      type='month'
                      helperText='Input type="month" bawaan browser.'
                    />
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Section: Alert & Badge */}
          <section className='space-y-6'>
            <div className='space-y-1'>
              <h2 className='text-xl font-semibold flex items-center text-foreground'>
                <ChevronRight className='w-5 h-5 text-muted-foreground mr-1' /> 3. Feedback (Alerts & Badges)
              </h2>
              <p className='text-muted-foreground text-sm ml-6'>
                Warna success, warning, danger, dan info yang diatur melalui CSS variables.
              </p>
            </div>
            <Card className='p-6 space-y-6'>
              <div className='space-y-4'>
                <Alert type='info' title='Pembaruan Tersedia'>
                  Versi terbaru dari aplikasi telah dirilis. Silakan muat ulang halaman.
                </Alert>
                <Alert type='success' title='Berhasil!'>
                  Data profil Anda telah berhasil disimpan ke dalam sistem.
                </Alert>
                <Alert type='warning' title='Perhatian'>
                  Sisa kuota penyimpanan Anda tinggal 10%.
                </Alert>
                <Alert type='error' title='Gagal Menyimpan'>
                  Terjadi kesalahan pada server saat mencoba memproses permintaan Anda.
                </Alert>
              </div>

              <div className='pt-4 border-t border-[hsl(var(--border))] flex flex-wrap gap-3'>
                <Badge variant='muted'>Draft</Badge>
                <Badge variant='primary'>Primary Badge</Badge>
                <Badge variant='secondary'>Secondary Badge</Badge>
                <Badge variant='info'>Sedang Diproses</Badge>
                <Badge variant='success'>Selesai</Badge>
                <Badge variant='warning'>Menunggu Pembayaran</Badge>
                <Badge variant='danger'>Dibatalkan</Badge>
              </div>
            </Card>
          </section>

          {/* Section: Modal */}
          <section className='space-y-6'>
            <div className='space-y-1'>
              <h2 className='text-xl font-semibold flex items-center text-foreground'>
                <ChevronRight className='w-5 h-5 text-muted-foreground mr-1' /> 4. Modal (Dialog)
              </h2>
              <p className='text-muted-foreground text-sm ml-6'>
                Modal generic yang bisa diisi dengan kombinasi tombol (footer) dan konten apa pun.
              </p>
            </div>
            <Card className='p-6 text-center border-dashed border-2 border-[hsl(var(--border))] bg-[hsl(var(--subtle))]'>
              <Bell className='w-12 h-12 text-muted-foreground mx-auto mb-4' />
              <h3 className='text-lg font-medium text-foreground mb-2'>Uji Coba Komponen Modal</h3>
              <p className='text-muted-foreground mb-6 max-w-md mx-auto'>
                Klik tombol di bawah ini untuk melihat contoh fleksibilitas modal generic.
              </p>

              <div className='flex flex-wrap justify-center gap-4'>
                <Button onClick={() => setIsModalOpen(true)} variant='danger' icon={AlertTriangle}>
                  Modal Konfirmasi (2 Tombol)
                </Button>
                <Button onClick={() => setIsInfoModalOpen(true)} variant='primary' icon={Search}>
                  Modal Info (1 Tombol)
                </Button>
              </div>
            </Card>
          </section>
        </div>

        {/* ==============================================
            CONTOH 1: Modal dengan 2 Tombol (Batal & Ya)
            ============================================== */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title='Konfirmasi Penghapusan'
          footer={
            <>
              <Button variant='ghost' onClick={() => setIsModalOpen(false)}>
                Batal
              </Button>
              <Button
                variant='danger'
                onClick={() => {
                  alert('Aksi konfirmasi dijalankan!')
                  setIsModalOpen(false)
                }}
              >
                Ya, Hapus Data
              </Button>
            </>
          }
        >
          <p className='text-muted-foreground leading-relaxed'>
            Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan dan semua data yang terkait
            akan hilang secara permanen.
          </p>
        </Modal>

        {/* ==============================================
            CONTOH 2: Modal dengan 1 Tombol Saja
            ============================================== */}
        <Modal
          isOpen={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
          title='Informasi Sistem'
          footer={
            <Button variant='primary' onClick={() => setIsInfoModalOpen(false)}>
              Saya Mengerti
            </Button>
          }
        >
          <div className='space-y-4'>
            <p className='text-muted-foreground leading-relaxed'>
              Ini adalah contoh penggunaan <strong>Modal Generic</strong>. Anda tidak perlu membuat komponen modal baru
              untuk setiap kebutuhan.
            </p>
            <Alert type='success'>
              Cukup panggil komponen <code>{'<Modal>'}</code> dan sesuaikan isi properti <code>footer</code>-nya
              menggunakan komponen <code>{'<Button>'}</code>!
            </Alert>
          </div>
        </Modal>
      </div>
    </div>
  )
}
