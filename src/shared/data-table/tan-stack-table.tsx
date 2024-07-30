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
import Pagination from './pagination'
import HeaderSorter from './header-sorter'
import { ArticleOff, EyeOff, Mouse, SearchOff } from 'tabler-icons-react'
import { useSearchParams } from 'next/navigation'
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
import { TableFilterRemover } from './table-filter-remover'

import { Heading } from '@components/heading'

export default function TanStackTable({
  data,
  columns,
  totalRecords,
  initialVisibility,
  rowAsLinkPath,
  children,
}: {
  data: unknown[]
  columns: ColumnDef<any, unknown>[]
  totalRecords: number
  initialVisibility: VisibilityState
  rowAsLinkPath?: string
  children?: React.ReactNode
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
      <div className="mt-2 flex items-center gap-1">
        {children}
        <span className="grow" />
        <ColumnVisibilityDropdown columns={table.getAllLeafColumns()} />
      </div>
      <TableFilterRemover />
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
      : <div className="fade-in mt-8 flex w-fit flex-col gap-4 rounded-lg bg-gray-200 p-5 dark:bg-gray-800">
          <div className="flex items-center gap-4">
            <div>
              <Heading className="font-semibold">
                No se encontraron registros con los criterios de búsqueda
                especificados
              </Heading>
              <Text className="text-xs">
                Vuelva a intentar con nuevos filtros o recargando la página
              </Text>
            </div>
            <ArticleOff size={35} className="mx-4 dark:text-gray-200" />
          </div>
        </div>
      }

      {data?.length >= 1 && (
        <Text className="mt-3 !text-xs/6">
          Tip: Puede navegar lateralmente con shift y la rueda del cursor.
        </Text>
      )}

      <div className="mt-3 flex flex-col items-start justify-between sm:flex-row">
        <span className="w-20" />
        {data?.length >= 1 && (
          <>
            <Pagination totalRecords={totalRecords} />{' '}
            <DownloadCSVButton
              totalRecordsCheck={totalRecordsCheck}
              data={data}
              columns={columns}
            />{' '}
          </>
        )}
      </div>
    </>
  )
}
