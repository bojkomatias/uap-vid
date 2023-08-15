'use client'
import type {
    ColumnDef,
    SortingState,
    VisibilityState,
} from '@tanstack/react-table'
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import ColumnVisibilityDropdown from './column-visibility-dropdown'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function TanStackTable({
    data,
    columns,
}: {
    data: any[]
    columns: ColumnDef<any, any>[]
}) {
    const router = useRouter()
    const path = usePathname()
    const searchParams = useSearchParams()
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    )

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
        },
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })
    return (
        <>
            <ColumnVisibilityDropdown columns={table.getAllLeafColumns()} />
            <div className="mx-auto max-w-7xl">
                <table className="-mx-4 mt-8 min-w-full divide-y divide-gray-300 sm:-mx-0">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="py-3.5 pl-4 pr-3 text-left text-sm text-gray-900 sm:pl-0"
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                {...{
                                                    className:
                                                        header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : '',
                                                    onClick: () =>
                                                        router.push(
                                                            `${path}?page=1${
                                                                !searchParams.get(
                                                                    'sort'
                                                                )
                                                                    ? `&order=${header.id}&sort=asc`
                                                                    : searchParams.get(
                                                                          'sort'
                                                                      ) ===
                                                                      'asc'
                                                                    ? `&order=${header.id}&sort=desc`
                                                                    : ''
                                                            }${
                                                                searchParams.get(
                                                                    'search'
                                                                )
                                                                    ? `&search=${searchParams.get(
                                                                          'search'
                                                                      )}`
                                                                    : ''
                                                            }`
                                                        ),
                                                }}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                                {{
                                                    asc: ' 🔼',
                                                    desc: ' 🔽',
                                                }[
                                                    header.column.getIsSorted() as string
                                                ] ?? null}
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        {table.getFooterGroups().map((footerGroup) => (
                            <tr key={footerGroup.id}>
                                {footerGroup.headers.map((header) => (
                                    <th key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .footer,
                                                  header.getContext()
                                              )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </tfoot>
                </table>
            </div>
        </>
    )
}
