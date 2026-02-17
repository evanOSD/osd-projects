// src/components/table/SupabaseTableRenderer.tsx

'use client'

import CircularProgress from '@mui/material/CircularProgress'

import CustomTable from '@/components/table/Table'

import { type AllowedTableName, getRequiredColumnsForTable } from './tableConfig'
import { useSupabaseTable } from './useSupabaseTable'

type Props = {
  tableName: AllowedTableName | string
  
  // Tambahkan prop opsional untuk default sort
  defaultSort?: { column: string; ascending: boolean }
}

const SupabaseTableRenderer = ({ tableName, defaultSort }: Props) => {
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
  } = useSupabaseTable(tableName, defaultSort) // <--- Di sini

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
        requiredColumns={requiredColumns}
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
