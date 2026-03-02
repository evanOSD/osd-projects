// src/components/ui/StandardTable.tsx

'use client'

import { DataTable } from '@/components/ui/DataTable'
import { TableLoading } from '@/components/ui/TableLoading'
import { TableDeleteConfirmModal } from '@/components/ui/tablecomponents/TableDeleteConfirmModal'
import { Loader2 } from 'lucide-react'

interface StandardTableProps {
  title: string
  logicData: {
    isLoading: boolean
    isFetching: boolean
    tableProps: any
    deleteModalProps: any
  }
}

export function StandardTable({ title, logicData }: StandardTableProps) {
  const { isLoading, isFetching, tableProps, deleteModalProps } = logicData

  return (
    <div className='space-y-4 animate-in fade-in duration-300'>
      <div className='flex items-center gap-3'>
        <h2 className='text-xl font-bold text-foreground'>{title}</h2>

        {isFetching && !isLoading && (
          <span className='flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full animate-pulse'>
            <Loader2 size={12} className='animate-spin' />
            Menyaring...
          </span>
        )}
      </div>

      {isLoading ? (
        <TableLoading />
      ) : (
        <>
          <DataTable {...tableProps} />
          <TableDeleteConfirmModal {...deleteModalProps} />
        </>
      )}
    </div>
  )
}
