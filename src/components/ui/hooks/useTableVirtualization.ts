// src/components/ui/hooks/useTableVirtualization.ts

import { useEffect } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Row } from '@tanstack/react-table'

interface UseTableVirtualizationProps<TData> {
  containerRef: React.RefObject<HTMLDivElement | null>
  rows: Row<TData>[]
  hasMore?: boolean
  isFetchingNextPage?: boolean
  fetchNextPage?: () => void
}

export function useTableVirtualization<TData>({
  containerRef,
  rows,
  hasMore,
  isFetchingNextPage,
  fetchNextPage
}: UseTableVirtualizationProps<TData>) {
  
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 40,
    overscan: 10
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()
  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0
  const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0) : 0

  // Efek Infinite Scroll
  useEffect(() => {
    const lastItem = virtualRows[virtualRows.length - 1]
    if (!lastItem) return
    if (lastItem.index >= rows.length - 5 && hasMore && !isFetchingNextPage && fetchNextPage) {
      fetchNextPage()
    }
  }, [virtualRows, rows.length, hasMore, isFetchingNextPage, fetchNextPage])

  return {
    virtualRows,
    paddingTop,
    paddingBottom,
    measureElement: rowVirtualizer.measureElement
  }
}
