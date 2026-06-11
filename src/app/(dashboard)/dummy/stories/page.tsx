// src/app/(dashboard)/dummy/stories/page.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { BookOpen, AlertCircle, Info, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

// Import generic Table
import { Table, ColumnDef } from '../Table'

// Import database API & Row types
import { storiesApi, StoryRow } from '@/api/database/stories'

// Import dummy UI components
import { Button } from '../Buttons'
import { Badge } from '../Badges'
import { Modal } from '../Modal'
import { Alert } from '../Alerts'
import { Input } from '../Forms'
import { toast } from 'react-hot-toast'

export default function StoriesDummyPage() {
  const [storiesData, setStoriesData] = useState<StoryRow[]>([])
  const [selectedStory, setSelectedStory] = useState<StoryRow | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Edit states for local testing
  const [editTitle, setEditTitle] = useState('')
  const [editJudul, setEditJudul] = useState('')
  const [editReference, setEditReference] = useState('')
  const [editPerikop, setEditPerikop] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editOrder, setEditOrder] = useState<number>(0)

  // Sync edited fields with selected story
  useEffect(() => {
    if (selectedStory) {
      setEditTitle(selectedStory.story_title || '')
      setEditJudul(selectedStory.judul_cerita || '')
      setEditReference(selectedStory.book_reference || '')
      setEditPerikop(selectedStory.dasar_perikop || '')
      setEditCategory(selectedStory.story_category || '')
      setEditOrder(selectedStory.global_order || 0)
    }
  }, [selectedStory])

  // Save changes locally to state (without calling Supabase database update)
  const handleSaveLocal = () => {
    if (!selectedStory) return

    const updated = storiesData.map(story => {
      if (story.id === selectedStory.id) {
        return {
          ...story,
          story_title: editTitle,
          judul_cerita: editJudul,
          book_reference: editReference,
          dasar_perikop: editPerikop,
          story_category: editCategory,
          global_order: Number(editOrder)
        }
      }
      return story
    })

    setStoriesData(updated)
    setIsDetailOpen(false)
    toast.success('Perubahan disimpan secara lokal!')
  }

  // Fetch real stories data from Supabase on mount
  useEffect(() => {
    async function fetchStories() {
      try {
        setIsLoading(true)
        // Ambil data halaman pertama dengan ukuran maksimal 1000 baris
        const data = await storiesApi.getStories({ pageIndex: 0, pageSize: 1000 })
        setStoriesData(data)
        setError(null)
      } catch (err: any) {
        console.error('Error fetching stories:', err)
        setError(err.message || 'Gagal memuat data cerita dari Supabase.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStories()
  }, [])

  // Columns definition using the generic ColumnDef mapping to StoryRow
  const columns: ColumnDef<StoryRow>[] = [
    {
      header: 'Aksi',
      headerClassName:
        'w-24 text-center sticky left-0 bg-[hsl(var(--subtle))] z-10 border-r border-[hsl(var(--border))]',
      className: 'text-center sticky left-0 bg-[hsl(var(--surface))] z-10 border-r border-[hsl(var(--border))]',
      cell: row => (
        <Button
          variant='outline'
          size='sm'
          onClick={e => {
            e.stopPropagation()
            setSelectedStory(row)
            setIsDetailOpen(true)
          }}
        >
          Detail
        </Button>
      )
    },
    {
      header: 'Urutan Global',
      headerClassName: 'w-32 text-center font-semibold',
      className: 'text-center font-mono font-semibold',
      accessorKey: 'global_order'
    },
    {
      header: 'Judul Cerita (ENG)',
      headerClassName: 'w-64 font-semibold text-foreground',
      cell: row => (
        <div className='flex items-center gap-2.5'>
          <BookOpen className='w-4 h-4 text-emerald-600 shrink-0' />
          <span className='font-semibold text-foreground'>{row.story_title || '-'}</span>
        </div>
      )
    },
    {
      header: 'Judul Cerita (IDN)',
      headerClassName: 'w-64 font-semibold text-foreground',
      cell: row => (
        <div className='flex items-center gap-2.5'>
          <BookOpen className='w-4 h-4 text-teal-600 shrink-0' />
          <span className='font-semibold text-foreground'>{row.judul_cerita || '-'}</span>
        </div>
      )
    },
    {
      header: 'Referensi Buku (ENG)',
      headerClassName: 'w-52 text-muted-foreground',
      cell: row => <span className='font-mono'>{row.book_reference || '-'}</span>
    },
    {
      header: 'Dasar Perikop (IDN)',
      headerClassName: 'w-52 text-muted-foreground',
      cell: row => <span className='font-mono'>{row.dasar_perikop || '-'}</span>
    },
    {
      header: 'Kategori Cerita',
      headerClassName: 'w-48 text-muted-foreground',
      cell: row => <span>{row.story_category || '-'}</span>
    },
    {
      header: 'Scripture Ref ID',
      headerClassName: 'w-44 text-muted-foreground font-mono',
      className: 'font-mono text-xs text-muted-foreground/75',
      accessorKey: 'scripture_ref_id'
    },
    {
      header: 'Verse Mapping (JSON)',
      headerClassName: 'w-60 text-muted-foreground font-mono',
      className: 'font-mono text-xs text-muted-foreground/70 truncate max-w-[200px]',
      cell: row => (
        <span title={row.verse_mapping ? JSON.stringify(row.verse_mapping) : ''}>
          {row.verse_mapping ? JSON.stringify(row.verse_mapping) : '-'}
        </span>
      )
    },
    {
      header: 'Created At',
      headerClassName: 'w-52 text-muted-foreground',
      cell: row => <span>{row.created_at ? new Date(row.created_at).toLocaleString('id-ID') : '-'}</span>
    },
    {
      header: 'Last Updated At',
      headerClassName: 'w-52 text-muted-foreground',
      cell: row => <span>{row.last_updated_at ? new Date(row.last_updated_at).toLocaleString('id-ID') : '-'}</span>
    },
    {
      header: 'Last Updated By',
      headerClassName: 'w-44 text-muted-foreground font-mono',
      className: 'font-mono text-xs text-muted-foreground/85',
      accessorKey: 'last_updated_by'
    },
    {
      header: 'ID Database (UUID)',
      headerClassName: 'w-48 text-muted-foreground font-mono',
      className: 'font-mono text-xs text-muted-foreground/80',
      accessorKey: 'id'
    }
  ]

  const handleRowClick = (row: StoryRow) => {
    setSelectedStory(row)
    setIsDetailOpen(true)
  }

  return (
    <div className='min-h-screen bg-[hsl(var(--bg-start))] text-foreground font-sans p-6 md:p-10 flex flex-col gap-6'>
      {/* HEADER PAGE */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[hsl(var(--border))]'>
        <div>
          <div className='flex items-center gap-2 text-xs text-muted-foreground mb-1 hover:text-foreground transition-colors'>
            <ArrowLeft className='w-3 h-3' />
            <Link href='/table'>Kembali ke Spreadsheet Grid</Link>
          </div>
          <h1 className='text-2xl font-bold tracking-tight text-[hsl(var(--surface-foreground))]'>
            Daftar Cerita Real dari Supabase (Stories)
          </h1>
          <p className='text-xs text-muted-foreground mt-0.5'>
            Menguji integrasi komponen <code>{'<Table />'}</code> generic dengan memuat data langsung dari tabel
            database <code>stories</code>.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Badge variant='success'>Status Koneksi: Supabase Live</Badge>
        </div>
      </div>

      {/* ERROR HANDLER */}
      {error && (
        <Alert type='error' title='Gagal Memuat Data'>
          {error}
        </Alert>
      )}

      {/* METRIC CARDS */}
      <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
        <div className='bg-[hsl(var(--surface))] p-4 rounded-(--radius) border border-[hsl(var(--border))] shadow-sm'>
          <div className='text-xs text-muted-foreground font-medium'>Total Cerita di Database</div>
          <div className='text-2xl font-bold mt-1 text-[hsl(var(--surface-foreground))]'>
            {isLoading ? '...' : storiesData.length}
          </div>
        </div>
        <div className='bg-[hsl(var(--surface))] p-4 rounded-(--radius) border border-[hsl(var(--border))] shadow-sm'>
          <div className='text-xs text-muted-foreground font-medium'>Tipe Sumber Data</div>
          <div className='text-2xl font-bold mt-1 text-emerald-600'>PostgreSQL Table</div>
        </div>
        <div className='bg-[hsl(var(--surface))] p-4 rounded-(--radius) border border-[hsl(var(--border))] shadow-sm'>
          <div className='text-xs text-muted-foreground font-medium'>Status Integrasi Table</div>
          <div className='text-2xl font-bold mt-1 text-blue-600'>Aktif / Generic</div>
        </div>
      </div>

      {/* LOADING STATE OR THE TABLE */}
      {isLoading ? (
        <div className='flex flex-col items-center justify-center p-20 bg-[hsl(var(--surface))] rounded-(--radius) border border-[hsl(var(--border))] shadow-sm gap-3'>
          <Loader2 className='w-8 h-8 text-[hsl(var(--primary))] animate-spin' />
          <span className='text-xs text-muted-foreground'>Memuat data dari database Supabase...</span>
        </div>
      ) : (
        <div className='bg-[hsl(var(--surface))] rounded-(--radius) border border-[hsl(var(--border))] shadow-md overflow-hidden'>
          <Table<StoryRow> columns={columns} data={storiesData} showRowNumbers={true} />
        </div>
      )}

      {/* INFO ALERT */}
      {!isLoading && !error && (
        <Alert type='info' title='Uji Perilaku Baris'>
          Silakan klik tombol "Detail" di kolom Aksi untuk melihat atau mengubah metadata cerita dari database.
        </Alert>
      )}

      {/* DETAIL MODAL PREVIEW & LOCAL EDIT */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={
          selectedStory
            ? `Edit / Detail Cerita: ${selectedStory.story_title || selectedStory.judul_cerita || 'Tanpa Judul'}`
            : 'Detail Cerita'
        }
        footer={
          <>
            <Button variant='ghost' onClick={() => setIsDetailOpen(false)}>
              Batal
            </Button>
            <Button variant='primary' onClick={handleSaveLocal}>
              Simpan Perubahan (Lokal)
            </Button>
          </>
        }
      >
        {selectedStory && (
          <div className='space-y-4 text-xs'>
            {/* ID Cerita (UUID) - Readonly */}
            <div className='bg-[hsl(var(--subtle))] p-2.5 rounded border border-[hsl(var(--border))]'>
              <span className='block text-muted-foreground font-medium mb-1'>ID Cerita (UUID - Readonly)</span>
              <span className='font-mono font-semibold block text-foreground break-all select-all'>
                {selectedStory.id}
              </span>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <Input label='Judul Cerita (ENG)' value={editTitle} onChange={e => setEditTitle(e.target.value)} />
              <Input label='Judul Cerita (IDN)' value={editJudul} onChange={e => setEditJudul(e.target.value)} />
              <Input
                label='Referensi Alkitab (ENG)'
                value={editReference}
                onChange={e => setEditReference(e.target.value)}
              />
              <Input label='Dasar Perikop (IDN)' value={editPerikop} onChange={e => setEditPerikop(e.target.value)} />
              <Input label='Kategori Cerita' value={editCategory} onChange={e => setEditCategory(e.target.value)} />
              <Input
                label='Urutan Global'
                type='number'
                value={editOrder}
                onChange={e => setEditOrder(Number(e.target.value))}
              />
            </div>

            <div className='bg-[hsl(var(--warning-soft))] border border-[hsl(var(--warning))/0.2] p-3 rounded text-[11px] text-[hsl(var(--warning-foreground))] flex items-start gap-2'>
              <AlertCircle className='w-4.5 h-4.5 text-[hsl(var(--warning))] shrink-0 mt-0.5' />
              <span>
                <strong>Mode Uji Coba:</strong> Tombol 'Simpan Perubahan' hanya akan memperbarui data di dalam{' '}
                <strong>state lokal (memori browser)</strong> secara instan agar tabel berubah. Data di database
                Supabase Anda <strong>tidak akan terganggu</strong>.
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
