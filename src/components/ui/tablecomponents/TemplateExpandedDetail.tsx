// src/components/ui/tablecomponents/TemplateExpandedDetail.tsx

import { Row, Table } from '@tanstack/react-table'

interface TemplateExpandedDetailProps<TData> {
  row: Row<TData>
  table: Table<TData>
  expandColumns?: string[]
}

export function TemplateExpandedDetail<TData>({ row, table, expandColumns }: TemplateExpandedDetailProps<TData>) {
  // Ambil data asli dari baris ini
  const data = row.original as Record<string, any>

  // Fungsi pintar untuk mencari nama Label (Header) berdasarkan ID/Key kolom
  const getLabel = (key: string) => {
    const column = table.getAllLeafColumns().find(c => c.id === key)
    // Jika header berupa string, gunakan itu. Jika tidak, format key-nya jadi rapi.
    if (column && typeof column.columnDef.header === 'string') {
      return column.columnDef.header
    }
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')
  }

  // Jika expandColumns tidak diisi, tampilkan semua data kecuali id
  const columnsToShow =
    expandColumns && expandColumns.length > 0 ? expandColumns : Object.keys(data).filter(k => k !== 'id')

  return (
    <div className='p-4 bg-surface border border-border rounded-lg shadow-sm w-full animate-in fade-in slide-in-from-top-2'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm text-foreground'>
        {columnsToShow.map(key => (
          <div key={key} className='flex flex-col gap-1.5 border-b border-border/50 pb-2 sm:border-0 sm:pb-0'>
            <span className='text-xs font-semibold text-muted uppercase tracking-wider'>{getLabel(key)}</span>
            <span className='font-medium text-foreground'>
              {/* Cek apakah data kosong/null */}
              {data[key] !== null && data[key] !== undefined && data[key] !== '' ? (
                String(data[key])
              ) : (
                <span className='text-muted-foreground/50 italic'>Kosong</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
