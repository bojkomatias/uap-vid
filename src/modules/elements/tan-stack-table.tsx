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

export default function TanStackTable({
    data,
    columns,
    totalRecords,
    initialVisibility,
    filterableByKey,
    searchBarPlaceholder,
}: {
    data: unknown[]
    columns: ColumnDef<any, unknown>[]
    totalRecords: number
    initialVisibility: VisibilityState
    filterableByKey?: { filter: string; values: any[][] }
    searchBarPlaceholder: string
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
            <div className="mx-auto mt-6 flex items-center justify-between gap-4">
                <SearchBar placeholderMessage={searchBarPlaceholder} />

                <ColumnVisibilityDropdown columns={table.getAllLeafColumns()} />
            </div>
            {filterableByKey && (
                <EnumFilterOptions
                    filter={filterableByKey.filter}
                    values={filterableByKey.values}
                />
            )}

            {data.length >= 1 ? (
                <div className="w-full overflow-x-auto">
                    <table className="fade-in -mx-4 mt-6 min-w-full divide-y divide-gray-300 sm:-mx-0">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="py-2 pr-4 text-left text-sm font-medium uppercase text-gray-600 last:text-right"
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
                                            className="whitespace-nowrap py-3.5 pr-4 text-sm text-gray-900 last:flex last:justify-end last:pr-2 last:text-right sm:w-auto"
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
            ) : (
                <div className="fade-in mx-auto mt-8 flex min-h-[400px] flex-col items-center justify-center  gap-4 text-gray-500">
                    <h1 className="font-semibold">
                        No se encontraron registros con los criterios de
                        búsqueda especificados
                    </h1>
                    <p className="text-xs">
                        Pruebe nuevamente con otros criterios de filtrado
                    </p>
                </div>
            )}
            <Pagination totalRecords={totalRecords} />
        </>
    )
}
