// src/app/(dashboard)/table/page.tsx

'use client'

import React, { useState } from 'react'
import {
  Undo,
  Redo,
  Printer,
  Paintbrush,
  Bold,
  Italic,
  Type,
  Palette,
  Grid3X3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  Play,
  HelpCircle,
  FileSpreadsheet,
  Settings
} from 'lucide-react'

// Import generic Table component
import { Table, ColumnDef } from '../dummy/Table'

// Import components from dummy folder
import { Button } from '../dummy/Buttons'
import { Input } from '../dummy/Forms'
import { Select } from '../dummy/Select'
import { MultiSelect } from '../dummy/MultiSelect'
import { DatePicker } from '../dummy/DatePicker'
import { TimePicker } from '../dummy/TimePicker'
import { TimestampPicker } from '../dummy/TimestampPicker'
import { MonthPicker } from '../dummy/MonthPicker'
import { Badge } from '../dummy/Badges'
import { Alert } from '../dummy/Alerts'
import { Modal } from '../dummy/Modal'

// Define the structure of row data for the showcase
interface ComponentRow {
  name: string
  variant: string
  cellFocusId: string
  getFormulaInfo: () => string
  renderComponent: () => React.ReactNode
  renderOutput: () => React.ReactNode
}

export default function TableShowcasePage() {
  // States to keep track of component values in the spreadsheet cells
  const [inputValue, setInputValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [singleSelect, setSingleSelect] = useState<string | number>('')
  const [multiSelect, setMultiSelect] = useState<(string | number)[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [selectedTimestamp, setSelectedTimestamp] = useState<Date | undefined>(undefined)
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  // Options for pickers
  const selectOptions = [
    { label: 'Jakarta (JKT)', value: 'jkt' },
    { label: 'Bandung (BDG)', value: 'bdg' },
    { label: 'Surabaya (SUB)', value: 'sub' }
  ]

  const multiSelectOptions = [
    { label: 'React.js', value: 'react' },
    { label: 'Next.js', value: 'next' },
    { label: 'TypeScript', value: 'ts' },
    { label: 'Tailwind CSS', value: 'tailwind' }
  ]

  // Mock Active Cell Formula Bar State
  const [activeCellName, setActiveCellName] = useState('D1')
  const [activeCellValue, setActiveCellValue] = useState('Select a cell to view details')

  // List of data rows that map to the generic Table
  const tableData: ComponentRow[] = [
    {
      name: 'Button',
      variant: 'Primary / Secondary',
      cellFocusId: 'C1',
      getFormulaInfo: () => `Button clicks: ${clickCount}`,
      renderComponent: () => (
        <div className='flex items-center gap-2'>
          <Button variant='primary' size='sm' onClick={() => setClickCount(c => c + 1)}>
            Tombol Utama
          </Button>
          <Button variant='secondary' size='sm' onClick={() => setClickCount(c => c + 1)}>
            Tombol Kedua
          </Button>
        </div>
      ),
      renderOutput: () => (
        <div className='flex items-center gap-2'>
          <Badge variant='primary'>Klik: {clickCount} kali</Badge>
          {clickCount > 0 && (
            <button onClick={() => setClickCount(0)} className='text-[10px] text-danger hover:underline cursor-pointer'>
              Reset
            </button>
          )}
        </div>
      )
    },
    {
      name: 'Input (Text)',
      variant: 'Standard Text Field',
      cellFocusId: 'C2',
      getFormulaInfo: () => `Input value: "${inputValue}"`,
      renderComponent: () => (
        <Input
          placeholder='Ketik teks pengujian...'
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          className='max-w-xs'
        />
      ),
      renderOutput: () => (
        <span className='font-mono text-muted-foreground truncate max-w-[150px] inline-block' title={inputValue}>
          {inputValue ? `"${inputValue}"` : '(kosong)'}
        </span>
      )
    },
    {
      name: 'Input (Password)',
      variant: 'Secure Text Field',
      cellFocusId: 'C3',
      getFormulaInfo: () => `Password length: ${passwordValue.length} chars`,
      renderComponent: () => (
        <Input
          type='password'
          placeholder='••••••••'
          value={passwordValue}
          onChange={e => setPasswordValue(e.target.value)}
          className='max-w-xs'
        />
      ),
      renderOutput: () => (
        <span className='font-mono text-muted-foreground'>
          {passwordValue ? `Karakter: ${passwordValue.length}` : '(kosong)'}
        </span>
      )
    },
    {
      name: 'Select',
      variant: 'Dropdown Single Select',
      cellFocusId: 'C4',
      getFormulaInfo: () => `Selected City code: "${singleSelect}"`,
      renderComponent: () => (
        <Select
          options={selectOptions}
          placeholder='Pilih kota tujuan...'
          value={singleSelect}
          onChange={setSingleSelect}
          isClearable
          className='max-w-xs'
        />
      ),
      renderOutput: () =>
        singleSelect ? (
          <Badge variant='info'>Terpilih: {singleSelect}</Badge>
        ) : (
          <span className='text-muted-foreground italic'>(belum memilih)</span>
        )
    },
    {
      name: 'MultiSelect',
      variant: 'Multiple Checkbox Select',
      cellFocusId: 'C5',
      getFormulaInfo: () => `Selected Tech stack: [${multiSelect.join(', ')}]`,
      renderComponent: () => (
        <MultiSelect
          options={multiSelectOptions}
          placeholder='Pilih tech stack...'
          value={multiSelect}
          onChange={setMultiSelect}
          isClearable
          className='max-w-xs'
        />
      ),
      renderOutput: () => (
        <div className='flex flex-wrap gap-1 max-w-[180px]'>
          {multiSelect.length > 0 ? (
            multiSelect.map(item => (
              <Badge key={item} variant='muted'>
                {item}
              </Badge>
            ))
          ) : (
            <span className='text-muted-foreground italic'>(belum memilih)</span>
          )}
        </div>
      )
    },
    {
      name: 'DatePicker',
      variant: 'Kalender Interaktif',
      cellFocusId: 'C6',
      getFormulaInfo: () => `Selected Date: ${selectedDate ? selectedDate.toLocaleDateString() : 'undefined'}`,
      renderComponent: () => (
        <DatePicker
          id='sheets-datepicker'
          value={selectedDate}
          onChange={setSelectedDate}
          isClearable
          className='max-w-xs'
        />
      ),
      renderOutput: () => (
        <span className='font-mono text-muted-foreground'>
          {selectedDate
            ? selectedDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
            : '(belum di set)'}
        </span>
      )
    },
    {
      name: 'TimePicker',
      variant: 'Jam & Menit (2 Kolom)',
      cellFocusId: 'C7',
      getFormulaInfo: () => `Selected Time: ${selectedTime || 'undefined'}`,
      renderComponent: () => (
        <TimePicker
          id='sheets-timepicker'
          value={selectedTime}
          onChange={setSelectedTime}
          isClearable
          className='max-w-xs'
        />
      ),
      renderOutput: () => (
        <span className='font-mono text-muted-foreground'>
          {selectedTime ? `${selectedTime} WIB` : '(belum di set)'}
        </span>
      )
    },
    {
      name: 'TimestampPicker',
      variant: 'Kalender & Jam Lengkap',
      cellFocusId: 'C8',
      getFormulaInfo: () => `Selected Timestamp: ${selectedTimestamp ? selectedTimestamp.toISOString() : 'undefined'}`,
      renderComponent: () => (
        <TimestampPicker
          id='sheets-timestamppicker'
          value={selectedTimestamp}
          onChange={setSelectedTimestamp}
          isClearable
          className='max-w-xs'
        />
      ),
      renderOutput: () => (
        <span className='font-mono text-muted-foreground text-[10px] break-all max-w-[150px]'>
          {selectedTimestamp ? selectedTimestamp.toLocaleString('id-ID') : '(belum di set)'}
        </span>
      )
    },
    {
      name: 'MonthPicker',
      variant: 'Bulan & Tahun (4x3 Grid)',
      cellFocusId: 'C9',
      getFormulaInfo: () => `Selected Month: ${selectedMonth ? selectedMonth.toISOString() : 'undefined'}`,
      renderComponent: () => (
        <MonthPicker
          id='sheets-monthpicker'
          value={selectedMonth}
          onChange={setSelectedMonth}
          isClearable
          className='max-w-xs'
        />
      ),
      renderOutput: () => (
        <span className='font-mono text-muted-foreground'>
          {selectedMonth
            ? selectedMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
            : '(belum di set)'}
        </span>
      )
    },
    {
      name: 'Badge',
      variant: 'Muted, Success, Danger, Warning',
      cellFocusId: 'C10',
      getFormulaInfo: () => 'Badge color showcase',
      renderComponent: () => (
        <div className='flex items-center gap-1.5 flex-wrap'>
          <Badge variant='muted'>Muted</Badge>
          <Badge variant='success'>Success</Badge>
          <Badge variant='danger'>Danger</Badge>
          <Badge variant='warning'>Warning</Badge>
        </div>
      ),
      renderOutput: () => <span className='text-muted-foreground italic'>Static Chips</span>
    },
    {
      name: 'Modal',
      variant: 'Generic Dialog (Slide Down)',
      cellFocusId: 'C11',
      getFormulaInfo: () => `Modal Open: ${isModalOpen}`,
      renderComponent: () => (
        <Button variant='danger' size='sm' icon={Play} onClick={() => setIsModalOpen(true)}>
          Buka Modal Uji Coba
        </Button>
      ),
      renderOutput: () => (
        <Badge variant={isModalOpen ? 'primary' : 'muted'}>
          {isModalOpen ? 'Modal/Dialog Aktif' : 'Modal/Dialog Tertutup'}
        </Badge>
      )
    }
  ]

  // Columns definition for the generic Table component
  const columns: ColumnDef<ComponentRow>[] = [
    {
      header: 'Nama Komponen',
      headerClassName: 'w-40 font-semibold',
      cell: row => <span className='font-semibold'>{row.name}</span>
    },
    {
      header: 'Varian / Tipe',
      headerClassName: 'w-48 text-muted-foreground',
      cell: row => <span className='text-muted-foreground'>{row.variant}</span>
    },
    {
      header: 'Komponen Uji Coba (Interaktif)',
      headerClassName: 'w-96',
      cell: row => row.renderComponent()
    },
    {
      header: 'Kondisi Nilai / Aksi',
      headerClassName: 'w-60',
      cell: row => row.renderOutput()
    }
  ]

  const handleRowClick = (row: ComponentRow, index: number) => {
    setActiveCellName(`C${index + 1}`)
    setActiveCellValue(row.getFormulaInfo())
  }

  return (
    <div className='min-h-screen bg-[hsl(var(--bg-start))] text-foreground font-sans text-sm flex flex-col'>
      {/* 1. MOCK GOOGLE SHEETS HEADER BAR */}
      <header className='bg-[hsl(var(--surface))] border-b border-[hsl(var(--border))] px-4 py-2 flex flex-col gap-1.5 shadow-sm shrink-0'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-emerald-600 text-white rounded-md flex items-center justify-center shadow-md'>
              <FileSpreadsheet className='w-5 h-5' />
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <input
                  type='text'
                  defaultValue='Uji Coba Komponen - Google Sheets Grid'
                  className='font-semibold text-base text-[hsl(var(--surface-foreground))] bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))] px-1 rounded-sm w-80'
                />
                <Badge variant='success' className='ml-2 text-[10px] scale-90'>
                  Auto-Save
                </Badge>
              </div>
              {/* Menu list */}
              <div className='flex gap-4 text-xs text-muted-foreground mt-0.5 font-medium'>
                <span className='hover:bg-[hsl(var(--muted))] hover:text-foreground px-1.5 py-0.5 rounded cursor-pointer transition-colors'>
                  File
                </span>
                <span className='hover:bg-[hsl(var(--muted))] hover:text-foreground px-1.5 py-0.5 rounded cursor-pointer transition-colors'>
                  Edit
                </span>
                <span className='hover:bg-[hsl(var(--muted))] hover:text-foreground px-1.5 py-0.5 rounded cursor-pointer transition-colors'>
                  Tampilan
                </span>
                <span className='hover:bg-[hsl(var(--muted))] hover:text-foreground px-1.5 py-0.5 rounded cursor-pointer transition-colors'>
                  Sisipkan
                </span>
                <span className='hover:bg-[hsl(var(--muted))] hover:text-foreground px-1.5 py-0.5 rounded cursor-pointer transition-colors'>
                  Format
                </span>
                <span className='hover:bg-[hsl(var(--muted))] hover:text-foreground px-1.5 py-0.5 rounded cursor-pointer transition-colors'>
                  Alat
                </span>
                <span className='hover:bg-[hsl(var(--muted))] hover:text-foreground px-1.5 py-0.5 rounded cursor-pointer transition-colors'>
                  Ekstensi
                </span>
                <span className='hover:bg-[hsl(var(--muted))] hover:text-foreground px-1.5 py-0.5 rounded cursor-pointer transition-colors'>
                  Bantuan
                </span>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <Button variant='outline' size='sm' icon={Settings}>
              Setelan
            </Button>
            <div className='w-8 h-8 rounded-full bg-[hsl(var(--primary-soft))] text-[hsl(var(--primary-soft-foreground))] font-bold flex items-center justify-center border border-[hsl(var(--primary))] shadow-sm'>
              OP
            </div>
          </div>
        </div>

        {/* 2. MOCK FORMATTING TOOLBAR */}
        <div className='flex items-center gap-1.5 bg-[hsl(var(--subtle))] p-1 rounded-[calc(var(--radius)-2px)] border border-[hsl(var(--border))] overflow-x-auto custom-scrollbar text-xs shrink-0'>
          <button
            className='p-1.5 hover:bg-[hsl(var(--muted))] rounded text-muted-foreground hover:text-foreground transition-colors'
            title='Undo'
          >
            <Undo className='w-3.5 h-3.5' />
          </button>
          <button
            className='p-1.5 hover:bg-[hsl(var(--muted))] rounded text-muted-foreground hover:text-foreground transition-colors'
            title='Redo'
          >
            <Redo className='w-3.5 h-3.5' />
          </button>
          <button
            className='p-1.5 hover:bg-[hsl(var(--muted))] rounded text-muted-foreground hover:text-foreground transition-colors'
            title='Print'
          >
            <Printer className='w-3.5 h-3.5' />
          </button>
          <button
            className='p-1.5 hover:bg-[hsl(var(--muted))] rounded text-muted-foreground hover:text-foreground transition-colors'
            title='Paint Format'
          >
            <Paintbrush className='w-3.5 h-3.5' />
          </button>

          <div className='w-px h-5 bg-[hsl(var(--border))] mx-1 shrink-0' />

          {/* Zoom Level */}
          <div className='flex items-center gap-1 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] px-2 py-1 rounded shrink-0 cursor-pointer hover:bg-[hsl(var(--muted))] transition-colors'>
            <span>100%</span>
            <ChevronDown className='w-3 h-3 text-muted-foreground' />
          </div>

          <div className='w-px h-5 bg-[hsl(var(--border))] mx-1 shrink-0' />

          <button
            className='p-1.5 hover:bg-[hsl(var(--muted))] rounded text-muted-foreground hover:text-foreground font-bold transition-colors'
            title='Bold'
          >
            <Bold className='w-3.5 h-3.5' />
          </button>
          <button
            className='p-1.5 hover:bg-[hsl(var(--muted))] rounded text-muted-foreground hover:text-foreground italic transition-colors'
            title='Italic'
          >
            <Italic className='w-3.5 h-3.5' />
          </button>
          <button
            className='p-1.5 hover:bg-[hsl(var(--muted))] rounded text-muted-foreground hover:text-foreground transition-colors'
            title='Text Color'
          >
            <Type className='w-3.5 h-3.5' />
          </button>
          <button
            className='p-1.5 hover:bg-[hsl(var(--muted))] rounded text-muted-foreground hover:text-foreground transition-colors'
            title='Fill Color'
          >
            <Palette className='w-3.5 h-3.5' />
          </button>
          <button
            className='p-1.5 hover:bg-[hsl(var(--muted))] rounded text-muted-foreground hover:text-foreground transition-colors'
            title='Borders'
          >
            <Grid3X3 className='w-3.5 h-3.5' />
          </button>

          <div className='w-px h-5 bg-[hsl(var(--border))] mx-1 shrink-0' />

          <button
            className='p-1.5 hover:bg-[hsl(var(--muted))] rounded text-muted-foreground hover:text-foreground transition-colors'
            title='Align Left'
          >
            <AlignLeft className='w-3.5 h-3.5' />
          </button>
          <button
            className='p-1.5 hover:bg-[hsl(var(--muted))] rounded text-muted-foreground hover:text-foreground transition-colors'
            title='Align Center'
          >
            <AlignCenter className='w-3.5 h-3.5' />
          </button>
          <button
            className='p-1.5 hover:bg-[hsl(var(--muted))] rounded text-muted-foreground hover:text-foreground transition-colors'
            title='Align Right'
          >
            <AlignRight className='w-3.5 h-3.5' />
          </button>

          <div className='w-px h-5 bg-[hsl(var(--border))] mx-1 shrink-0' />

          <Badge variant='primary' className='text-[10px] py-0.5 px-2 shrink-0'>
            Mode Evaluasi
          </Badge>
        </div>

        {/* 3. MOCK FORMULA BAR */}
        <div className='flex items-center gap-2 bg-[hsl(var(--surface))] rounded border border-[hsl(var(--border))] px-3 py-1 text-xs shrink-0'>
          <div className='font-semibold text-emerald-600 bg-[hsl(var(--muted))] px-2 py-0.5 rounded border border-[hsl(var(--border))] shadow-inner w-12 text-center select-none'>
            {activeCellName}
          </div>
          <div className='w-px h-4 bg-[hsl(var(--border))] shrink-0' />
          <div className='text-muted-foreground font-mono select-none shrink-0'>fx</div>
          <input
            type='text'
            value={activeCellValue}
            onChange={e => setActiveCellValue(e.target.value)}
            className='w-full font-mono bg-transparent border-0 focus:outline-none focus:ring-0 px-1 text-foreground'
            placeholder='Formula / Data Sel Aktif...'
          />
        </div>
      </header>

      {/* 4. SPREADSHEET MAIN CONTAINER */}
      <main className='flex-1 overflow-auto p-4 md:p-6 flex flex-col gap-4 max-w-6xl mx-auto w-full'>
        {/* Short intro box styled like a Help Banner */}
        <div className='bg-[hsl(var(--surface))] p-4 rounded-(--radius) border border-[hsl(var(--border))] flex items-start gap-3 shadow-sm'>
          <HelpCircle className='w-6 h-6 text-[hsl(var(--info))] shrink-0 mt-0.5' />
          <div>
            <h4 className='font-semibold text-[hsl(var(--surface-foreground))]'>
              Uji Integrasi Komponen Komponen di Tabel Custom Generic
            </h4>
            <p className='text-xs text-muted-foreground mt-0.5 leading-relaxed'>
              Tabel di bawah ini merupakan proses instan dari komponen custom <code>{'<Table />'}</code> generic di{' '}
              <code>src/app/(dashboard)/Table.tsx</code>. Pencantuman komponen picker custom interaktif di dalam sel-sel
              baris tetap presisi dan mendukung baris indeks gray-numbers ala Google Sheets secara terstruktur.
            </p>
          </div>
        </div>

        {/* REUSABLE GENERIC TABLE INSTANCE */}
        <Table<ComponentRow>
          columns={columns}
          data={tableData}
          showRowNumbers={true}
          onRowClick={handleRowClick}
          tableClassName='min-w-[800px]'
        />

        {/* 5. SIDE ALERTS - INTEGRATION STATUS */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 shrink-0'>
          <Alert type='success' title='Komponen Generic Selesai'>
            Komponen tabel generic <code>Table.tsx</code> telah dibuat dan berhasil diuji coba. Komponen ini sekarang
            dapat digunakan kembali di rute dashboard mana pun.
          </Alert>
          <Alert type='info' title='Uji Perilaku Baris'>
            Klik baris tabel di atas untuk memfokuskan sel dan melihat nilai dinamis dari masing-masing input pada{' '}
            <b>Formula Bar (fx)</b>.
          </Alert>
        </div>
      </main>

      {/* 6. MOCK MODAL PREVIEW */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title='Uji Coba Komponen Modal'
        footer={
          <>
            <Button variant='ghost' onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant='primary' onClick={() => setIsModalOpen(false)}>
              Selesai Uji
            </Button>
          </>
        }
      >
        <div className='space-y-3'>
          <p className='text-sm text-muted-foreground leading-relaxed'>
            Modal ini menggunakan efek transisi bawaan terbaru <strong>fade-in + slide-down (custom)</strong> yang
            terdaftar di <code>globals.css</code>.
          </p>
          <div className='bg-[hsl(var(--subtle))] p-3 rounded-md border border-[hsl(var(--border))] font-mono text-[11px] text-muted-foreground'>
            Tipe Animasi: .animate-modal-slide-down-in
          </div>
        </div>
      </Modal>
    </div>
  )
}
