/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */
'use client'
import type { ColumnDef, VisibilityState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import ColumnVisibilityDropdown from './column-visibility-dropdown'
import SearchBar from './search-bar'
import Pagination from './pagination'
import HeaderSorter from './header-sorter'
import EnumFilterOptions from './enum-filter-options'
import { Mouse } from 'tabler-icons-react'
import { usePathname, useSearchParams } from 'next/navigation'
import DownloadCSVButton from './download-csv-button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/table'
import { Text } from '@components/text'

export default function TanStackTable({
  data,
  columns,
  totalRecords,
  initialVisibility,
  filterableByKey,
  searchBarPlaceholder,
  customFilterSlot,
  customFilterSlot2,
  rowAsLinkPath,
}: {
  data: unknown[]
  columns: ColumnDef<any, unknown>[]
  totalRecords: number
  initialVisibility: VisibilityState
  filterableByKey?: { filter: string; values: any[][] | any[] }
  searchBarPlaceholder: string
  customFilterSlot?: React.ReactNode
  customFilterSlot2?: React.ReactNode
  rowAsLinkPath?: string
}) {
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(initialVisibility)

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  })

  const totalRecordsCheck = !(
    Number(useSearchParams()?.get('records')) == totalRecords
  )

  return (
    <>
      <div className=" mx-auto mt-6 flex flex-wrap items-center justify-between gap-4">
        <SearchBar placeholderMessage={searchBarPlaceholder} />
        <div className="flex flex-wrap gap-2">
          {customFilterSlot2}
          <ColumnVisibilityDropdown columns={table.getAllLeafColumns()} />
        </div>
      </div>

      {customFilterSlot}

      {filterableByKey && (
        <EnumFilterOptions
          filter={filterableByKey.filter}
          values={filterableByKey.values}
        />
      )}

      {data?.length >= 1 ?
        <Table
          bleed
          className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]"
        >
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHeader key={header.id}>
                    <HeaderSorter header={header} />
                  </TableHeader>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                {...(rowAsLinkPath ?
                  { href: rowAsLinkPath + row.original.id }
                : {})}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      : <div className="fade-in mx-auto mt-8 flex min-h-[400px] flex-col items-center justify-center gap-4 text-gray-500">
          <h1 className="font-semibold">
            No se encontraron registros con los criterios de búsqueda
            especificados
          </h1>
          <p className="text-xs">
            Pruebe nuevamente con otros criterios de filtrado
          </p>
        </div>
      }
      <Text className="mt-3 hidden items-center justify-end !text-xs opacity-80 sm:flex">
        <kbd className="mx-1 rounded-sm bg-gray-50 px-1.5 py-0.5 text-[0.6rem] ring-1">
          Shift
        </kbd>
        +
        <Mouse className="mx-0.5 h-4 text-gray-400" />
        para navegar lateralmente.
      </Text>
      <div className="mt-3 flex flex-col items-start justify-between sm:flex-row">
        <span className="w-20" />
        <Pagination totalRecords={totalRecords} />
        <DownloadCSVButton
          totalRecordsCheck={totalRecordsCheck}
          data={data}
          columns={columns}
        />
      </div>
    </>
  )
}
