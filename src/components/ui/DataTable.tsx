// src/components/ui/DataTable.tsx

'use client'

import { useRef } from 'react'
import { useDataTable } from './hooks/useDataTable'
import { useTableVirtualization } from './hooks/useTableVirtualization'
import { TableToolbar } from './tablecomponents/TableToolbar'
import { DataTableProps } from './tablecomponents/DataTable.types'
import { DataTableHead } from './tablecomponents/DataTableHead'
import { DataTableBody } from './tablecomponents/DataTableBody'
import { TemplateExpandedDetail } from './tablecomponents/TemplateExpandedDetail'

const DUMMY_EXPAND_FN = () => <></>

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  const tableLogic = useDataTable({
    ...props,
    renderSubComponent: props.renderSubComponent || (props.enableExpanding ? DUMMY_EXPAND_FN : undefined)
  })

  const tableContainerRef = useRef<HTMLDivElement>(null)

  const virtualizer = useTableVirtualization({
    containerRef: tableContainerRef,
    rows: tableLogic.table.getRowModel().rows,
    hasMore: props.hasMore,
    isFetchingNextPage: props.isFetchingNextPage,
    fetchNextPage: props.fetchNextPage
  })

  const finalRenderSubComponent = props.renderSubComponent
    ? props.renderSubComponent
    : props.enableExpanding
      ? ({ row }: { row: any }) => (
          <TemplateExpandedDetail row={row} table={tableLogic.table} expandColumns={props.expandColumns} />
        )
      : undefined

  return (
    <div className='rounded-xl border border-border bg-surface shadow-sm flex flex-col overflow-hidden'>
      <TableToolbar
        table={tableLogic.table}
        globalFilter={tableLogic.globalFilter}
        setGlobalFilter={tableLogic.setGlobalFilter}
        onResetColumns={tableLogic.resetOrder}
        onAddRow={props.onAddRow}
        onSave={props.onSave}
        onDeleteRows={props.onDeleteRows}
        onCancel={props.onCancel}
        unsavedCount={props.unsavedCount}
        isSaving={props.isSaving}
        onImportData={props.onImportData}
        // TAMBAHKAN INI: Lempar props template kolom ke toolbar
        selectedRowDisplayColumns={props.selectedRowDisplayColumns}
      />

      <div
        ref={tableContainerRef}
        className='max-h-[calc(100vh-280px)] overflow-auto relative w-full 
          [&::-webkit-scrollbar]:w-2.5 
          [&::-webkit-scrollbar]:h-2.5 
          [&::-webkit-scrollbar-thumb]:bg-border 
          [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/80 
          [&::-webkit-scrollbar-thumb:active]:bg-muted-foreground/80 
          [&::-webkit-scrollbar-thumb]:rounded-full'
      >
        <table
          className='text-sm text-left border-collapse table-fixed bg-surface'
          style={{ width: tableLogic.table.getTotalSize(), minWidth: '100%' }}
        >
          <DataTableHead table={tableLogic.table} columnOrder={tableLogic.columnOrder} />

          <DataTableBody
            table={tableLogic.table}
            columns={props.columns}
            virtualRows={virtualizer.virtualRows}
            paddingTop={virtualizer.paddingTop}
            paddingBottom={virtualizer.paddingBottom}
            measureElement={virtualizer.measureElement}
            isFetchingNextPage={props.isFetchingNextPage}
            renderSubComponent={finalRenderSubComponent}
          />
        </table>
      </div>
    </div>
  )
}
