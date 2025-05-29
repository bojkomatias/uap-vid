/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { flexRender, type Header } from '@tanstack/react-table'
import { useUpdateQuery } from '@utils/query-helper/updateQuery'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { ArrowDown, ArrowsSort, ArrowUp } from 'tabler-icons-react'

export default function HeaderSorter({
  header,
}: {
  header: Header<any, unknown>
}) {
  const searchParams = useSearchParams()
  const update = useUpdateQuery()
  const [sortState, setSortState] = useState<'asc' | 'desc' | ''>('')

  useEffect(() => {
    const currentSort = searchParams?.get('sort')
    const currentOrder = searchParams?.get('order') as 'asc' | 'desc' | null

    if (currentSort === header.id && currentOrder) {
      setSortState(currentOrder)
    } else {
      setSortState('')
    }
  }, [searchParams, header.id])

  const handleSort = () => {
    if (header.column.getCanSort()) {
      let newState: 'asc' | 'desc' | '' = 'asc'
      if (sortState === 'asc') newState = 'desc'
      else if (sortState === 'desc') newState = ''

      setSortState(newState)
      update({
        sort: newState ? header.id : '',
        order: newState,
      })
    }
  }

  const getSortIcon = () => {
    if (sortState === 'asc')
      return <ArrowUp className="ml-1.5 h-4 w-4 text-primary" />
    if (sortState === 'desc')
      return <ArrowDown className="ml-1.5 h-4 w-4 text-primary" />
    return (
      header.column.getCanSort() && (
        <ArrowsSort className="ml-1.5 h-3 w-3 text-gray-400 group-hover:text-gray-600" />
      )
    )
  }

  return header.isPlaceholder ? null : (
      <div
        className={
          header.column.getCanSort() ?
            'group flex cursor-pointer select-none items-center hover:text-gray-700 dark:hover:text-gray-500'
          : ''
        }
        onClick={handleSort}
      >
        {flexRender(header.column.columnDef.header, header.getContext())}
        {getSortIcon()}
      </div>
    )
}
