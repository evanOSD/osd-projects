// src/components/table/types.ts

// Tipe data dinamis yang mewajibkan adanya properti 'id'
export type TableDataItem = {
  id: string | number
  [key: string]: any 
}

export type TableProps = {
  tableName: string
  columns: string[]
  data: any[]
  requiredColumns?: string[]
  defaultColumns?: string[]
  columnOptions?: Record<string, { label: string; value: string }[]>
  onSaveBatch: (drafts: Record<string, any>) => void
  onDeleteBatch: (ids: string[]) => void
  sortConfig?: { column: string; ascending: boolean } | null
  onSortChange?: (column: string, ascending: boolean) => void
  filters?: Record<string, string | string[]> 
  onFilterChange?: (column: string, value: string | string[]) => void
}
