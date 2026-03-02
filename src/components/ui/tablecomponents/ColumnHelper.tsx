// src/components/ui/tablecomponents/ColumnHelper.tsx

import { ColumnDef } from '@tanstack/react-table'
import { EditableCell } from './EditableCell'
import { EditableCellDropdown } from './EditableCellDropdown'
import { EditableCellMultiSelect } from './EditableCellMultiSelect' // <--- IMPORT KOMPONEN BARU
import { TableCheckbox } from './TableCheckbox'
import { Badge } from '@/components/ui/Badge'
import { formatDateTime } from '@/lib/formatters'

// 1. TAMBAHKAN 'text-array' KE DAFTAR TIPE
export type SupabaseDataType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'time'
  | 'datetime'
  | 'uuid'
  | 'json'
  | 'jsonb'
  | 'text-array'

export interface SupabaseColumnConfig<TRow> {
  id: Extract<keyof TRow, string>
  header: string
  dataType: SupabaseDataType
  isReadOnly?: boolean
  isNullable?: boolean
  isUnique?: boolean
  size?: number
  isCopyable?: boolean
  isPinned?: boolean | 'left' | 'right'
  dropdownOptions?: string[]
  fetchFilterOptions?: () => Promise<string[]>
}

export function createStandardColumn<TRow>(config: SupabaseColumnConfig<TRow>): ColumnDef<TRow, any> {
  const {
    id,
    header,
    dataType,
    isReadOnly = false,
    size = 200,
    isCopyable = false,
    isPinned = false,
    dropdownOptions,
    fetchFilterOptions
  } = config

  return {
    accessorKey: id,
    header: header,
    size: size,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true
      const cellValue = row.getValue(columnId)

      // PERBAIKAN FILTER: Tangani array (overlaps) dan text biasa (includes)
      if (Array.isArray(cellValue)) {
        return filterValue.some((f: string) => cellValue.includes(f))
      }
      return filterValue.includes(String(cellValue))
    },
    meta: {
      filterOptions: fetchFilterOptions ? { fetcher: fetchFilterOptions } : undefined,
      isPinned: isPinned
    },
    cell: ({ getValue, row, column, table }) => {
      const val = getValue()

      // TIPE JSON / JSONB
      if (dataType === 'json' || dataType === 'jsonb') {
        return (
          <div className='flex items-center group w-full'>
            <Badge
              variant='outline'
              className='font-mono text-[12px] text-muted-foreground break-all whitespace-normal'
            >
              {val ? '{...}' : 'null'}
            </Badge>
          </div>
        )
      }

      // JIKA READ-ONLY
      if (isReadOnly) {
        if (dataType === 'datetime' && val)
          return (
            <span className='text-muted-foreground whitespace-normal wrap-break-word'>{formatDateTime(val as string)}</span>
          )
        if (dataType === 'boolean') return <TableCheckbox checked={!!val} disabled />

        // Mode baca text-array: Render badge statis
        if (dataType === 'text-array' && Array.isArray(val)) {
          return (
            <div className='flex flex-wrap gap-1 w-full'>
              {val.map((item, i) => (
                <Badge key={i} variant='outline' className='text-[12px] px-1.5 py-0 h-5 font-normal'>
                  {item}
                </Badge>
              ))}
            </div>
          )
        }

        return (
          <div className='flex items-center group w-full'>
            <span className='whitespace-normal wrap-break-word text-muted-foreground'>
              {val !== null && val !== undefined ? String(val) : '-'}
            </span>
          </div>
        )
      }

      // 3. JIKA DROPDOWN / ENUM (SINGLE SELECT)
      if (dropdownOptions && dataType !== 'text-array') {
        return (
          <EditableCellDropdown getValue={getValue} row={row} column={column} table={table} options={dropdownOptions} />
        )
      }

      // 4. JIKA TEXT-ARRAY (MULTI SELECT) <--- LOGIKA BARU DI SINI
      if (dataType === 'text-array' && dropdownOptions) {
        return (
          <EditableCellMultiSelect
            getValue={getValue}
            row={row}
            column={column}
            table={table}
            options={dropdownOptions}
          />
        )
      }

      // 5. JIKA BOOLEAN
      if (dataType === 'boolean') {
        return (
          <div className='flex items-center h-full px-2'>
            <TableCheckbox
              checked={!!val}
              onChange={e => {
                ;(table.options.meta as any)?.updateData(row.index, column.id, e.currentTarget.checked)
              }}
            />
          </div>
        )
      }

      // 6. SISANYA: NUMBER, TEXT, DATE, TIME
      let inputType: 'text' | 'number' | 'date' | 'time' | 'datetime-local' = 'text'
      if (dataType === 'number') inputType = 'number'
      if (dataType === 'date') inputType = 'date'
      if (dataType === 'time') inputType = 'time'
      if (dataType === 'datetime') inputType = 'datetime-local'

      return (
        <EditableCell
          getValue={getValue}
          row={row}
          column={column}
          table={table}
          type={inputType}
          isCopyable={isCopyable}
        />
      )
    }
  }
}
