// src/app/(dashboard)/database/books/page.tsx

"use client"

import { DataTable } from "@/components/ui/DataTable"
import { TableLoading } from "@/components/ui/TableLoading"
import { TableDeleteConfirmModal } from "@/components/ui/tablecomponents/TableDeleteConfirmModal"
import { BOOK_TABLE_CONFIG } from "./config/constants"
import { useBooksPageLogic } from "./hooks/useBooksPageLogic"
import { Loader2 } from "lucide-react"

export default function BooksPage() {
  const { isLoading, isFetching, tableProps, deleteModalProps } = useBooksPageLogic()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-foreground">{BOOK_TABLE_CONFIG.title}</h2>
        
        {isFetching && !isLoading && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full animate-pulse">
            <Loader2 size={12} className="animate-spin" />
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
