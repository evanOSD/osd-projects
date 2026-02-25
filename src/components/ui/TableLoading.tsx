// src/components/ui/TableLoading.tsx

'use client'

// 1. Buat daftar "lebar acak" statis di luar komponen
const SKELETON_WIDTHS = ['45%', '70%', '50%', '85%', '40%', '60%', '75%', '55%', '80%', '65%']

export function TableLoading() {
  const skeletonRows = Array.from({ length: 10 })

  return (
    <div className='rounded-xl border border-border bg-surface shadow-sm flex flex-col overflow-hidden w-full'>
      {/* 1. SKELETON TOOLBAR */}
      <div className='flex flex-wrap items-center justify-between p-4 border-b border-border bg-surface/50 gap-4'>
        <div className='h-9 w-full max-w-sm bg-muted animate-pulse rounded-md' />

        <div className='flex items-center gap-2'>
          <div className='h-9 w-28 bg-muted animate-pulse rounded-md' />
          <div className='w-px h-6 bg-border mx-1' />
          <div className='h-9 w-24 bg-muted animate-pulse rounded-md' />
        </div>
      </div>

      {/* 2. SKELETON TABLE */}
      <div className='w-full overflow-hidden'>
        <table className='w-full text-sm text-left border-collapse'>
          {/* Header */}
          <thead className='bg-surface shadow-sm outline-1 outline-border'>
            <tr>
              {Array.from({ length: 5 }).map((_, i) => (
                <th key={`th-${i}`} className='px-4 py-3 border-r border-border/50 last:border-r-0'>
                  <div className='h-4 w-20 bg-muted animate-pulse rounded' />
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {skeletonRows.map((_, rowIndex) => (
              <tr
                key={`tr-${rowIndex}`}
                className='border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'
              >
                {Array.from({ length: 5 }).map((_, colIndex) => {
                  // 2. Ambil lebar dari array secara konsisten menggunakan rumus index
                  const widthIndex = (rowIndex * 5 + colIndex) % SKELETON_WIDTHS.length
                  const width = SKELETON_WIDTHS[widthIndex]

                  return (
                    <td key={`td-${rowIndex}-${colIndex}`} className='p-4 align-middle'>
                      <div
                        className='h-4 bg-muted/60 animate-pulse rounded'
                        style={{ width }} // <--- Panggil di sini, aman dari Hydration Error!
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
