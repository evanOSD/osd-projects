// src/components/table/SupabaseTableRenderer.tsx

'use client'

import CircularProgress from '@mui/material/CircularProgress'

import CustomTable from '@/components/table/Table'

import { type AllowedTableName, getRequiredColumnsForTable } from './tableConfig'
import { useSupabaseTable } from './useSupabaseTable'

import { useTableMetadata } from './hooks/useTableMetadata'

type Props = {
  tableName: AllowedTableName | string
  defaultSort?: { column: string; ascending: boolean }
  defaultColumns?: string[] // ✅ Tambahkan tipe props
}

const SupabaseTableRenderer = ({ tableName, defaultSort, defaultColumns }: Props) => {
  // Lempar defaultSort ke dalam custom hook
  const {
    tableData,
    tableColumns,
    isLoading,
    sortConfig,
    filters,
    handleSaveBatch,
    handleDeleteBatch,
    handleSortChange,
    handleFilterChange
  } = useSupabaseTable(tableName, defaultSort)

  const columnTypes = useTableMetadata(tableName)

  const requiredColumns = getRequiredColumnsForTable(tableName)

  if (isLoading && tableData.length === 0) {
    return (
      <div className='flex justify-center p-10'>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className='relative'>
      {isLoading && tableData.length > 0 && (
        <div className='absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-black/50'>
          <CircularProgress size={40} />
        </div>
      )}
      <CustomTable
        tableName={tableName}
        columns={tableColumns}
        data={tableData}
        columnTypes={columnTypes}
        requiredColumns={requiredColumns}
        defaultColumns={defaultColumns}
        onSaveBatch={handleSaveBatch}
        onDeleteBatch={handleDeleteBatch}
        sortConfig={sortConfig}
        onSortChange={handleSortChange}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </div>
  )
}

export default SupabaseTableRenderer
