import Button from '@/components/ui/Button'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
          Dashboard <span className="text-blue-600">Utama</span>
        </h1>
        <p className="text-lg text-gray-600">
          Selamat datang di Home OSD. Jika Anda melihat halaman ini, berarti Anda sudah melewati Middleware!
        </p>
        <Button className="px-8 py-3 mt-4">Lihat Proyek</Button>
      </div>
    </div>
  )
}
