// src/app/(dashboard)/database/books/page.tsx
export default function BooksPage() {
  return (
    <div className="space-y-6">
      {/* Hapus text-gray-900 dark:text-gray-100 */}
      <h1 className="text-3xl font-bold">Database: Books</h1>
      
      {/* Biarkan background card-nya, tapi hapus text-color di tag <p> */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950/50">
        <p>
          Ini adalah area konten utama. Coba klik tombol "Dark Mode" di kanan atas, 
          lalu coba *collapse* (tutup) sidebar di kiri. Setelah itu coba <b>refresh (F5) browser Anda</b>. 
          <br /><br />
          Perhatikan bahwa Sidebar tidak akan berkedip atau "jeglek", karena Next.js sudah mengingat ukurannya dari Server!
        </p>
      </div>
    </div>
  )
}
