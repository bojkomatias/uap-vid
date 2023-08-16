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

export default function TanStackTable({
    data,
    columns,
    totalRecords,
    initialVisibility,
}: {
    data: any[]
    columns: ColumnDef<any, any>[]
    totalRecords: number
    initialVisibility: VisibilityState
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
            <SearchBar placeholderMessage="Buscar usuario por nombre, rol o email" />
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
                </table>
            </div>
            <Pagination count={totalRecords} />
        </>
    )
}
