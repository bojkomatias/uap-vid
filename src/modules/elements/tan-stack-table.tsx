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
import { scroll } from '@utils/helpers'

export default function TanStackTable({
    data,
    columns,
    totalRecords,
    initialVisibility,
    searchOptions,
}: {
    data: any[]
    columns: ColumnDef<any, any>[]
    totalRecords: number
    initialVisibility: VisibilityState
    searchOptions?: string[]
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
    return (
        <>
            <div className="mx-auto mt-8 flex justify-between gap-4">
                <SearchBar placeholderMessage="Buscar usuario por nombre, rol o email" />
                <ColumnVisibilityDropdown columns={table.getAllLeafColumns()} />
            </div>
            <div
                onMouseOver={() => {
                    scroll('scrollableTable')
                }}
                id="scrollableTable"
                className="w-full overflow-x-auto scroll-smooth"
            >
                <table className="-mx-4 mt-8 divide-y divide-gray-300 sm:-mx-0">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-2 py-1 text-xs font-light uppercase text-gray-700 last:text-right"
                                        colSpan={header.colSpan}
                                    >
                                        <HeaderSorter header={header} />
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
                                        className="whitespace-nowrap px-2 py-3 text-sm font-medium text-gray-900 last:text-right"
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
                </table>
            </div>

            <Pagination totalRecords={totalRecords} />
        </>
    )
}
