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
import FilterOptions from './filter-options'

export default function TanStackTable({
    data,
    columns,
    totalRecords,
    initialVisibility,
    searchOptions,
    searchOptionsTitle,
}: {
    data: any[]
    columns: ColumnDef<any, any>[]
    totalRecords: number
    initialVisibility: VisibilityState
    searchOptions?: string[]
    searchOptionsTitle?: string
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
            <div className="mx-auto mt-8 flex items-center justify-between gap-4">
                <SearchBar placeholderMessage="Buscar usuario por nombre, rol o email" />
                {searchOptions && searchOptionsTitle && (
                    <FilterOptions options={searchOptions} />
                )}
                <ColumnVisibilityDropdown columns={table.getAllLeafColumns()} />
            </div>

            {data.length >= 1 ? (
                <table className="fade-in -mx-4 mt-8 min-w-full divide-y divide-gray-300 sm:-mx-0">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="py-3.5 text-left text-sm text-gray-900 last:text-right sm:pl-0"
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
                                        className="py-3.5 text-sm font-medium text-gray-900 last:text-right sm:w-auto sm:pl-0"
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
