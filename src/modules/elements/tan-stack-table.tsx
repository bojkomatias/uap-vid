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
import { useSearchParams } from 'next/navigation'
import DownloadCSVButton from './download-csv-button'

export default function TanStackTable({
    data,
    columns,
    totalRecords,
    initialVisibility,
    filterableByKey,
    searchBarPlaceholder,
    customFilterSlot,
}: {
    data: unknown[]
    columns: ColumnDef<any, unknown>[]
    totalRecords: number
    initialVisibility: VisibilityState
    filterableByKey?: { filter: string; values: any[][] }
    searchBarPlaceholder: string
    customFilterSlot?: React.ReactNode
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
            <div className="mx-auto mt-6 flex flex-wrap items-center justify-between gap-4">
                <SearchBar placeholderMessage={searchBarPlaceholder} />
                <div className="flex flex-wrap gap-2">
                    <ColumnVisibilityDropdown
                        columns={table.getAllLeafColumns()}
                    />

                    <DownloadCSVButton
                        totalRecordsCheck={totalRecordsCheck}
                        data={data}
                        columns={columns}
                    />
                </div>
            </div>

            {customFilterSlot}

            {filterableByKey && (
                <EnumFilterOptions
                    filter={filterableByKey.filter}
                    values={filterableByKey.values}
                />
            )}

            {data?.length >= 1 ? (
                <div className="w-full overflow-x-auto">
                    <table className="fade-in -mx-4 mt-6 table-fixed divide-y-2 sm:-mx-0 sm:min-w-full">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="py-2 pr-4 text-left text-sm font-medium uppercase text-gray-600 last:pr-2 last:text-right"
                                        >
                                            <HeaderSorter header={header} />
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y bg-white">
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="whitespace-nowrap py-3.5 pr-4 text-sm text-gray-800 last:w-16 last:px-2"
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
                <div className="fade-in mx-auto mt-8 flex flex-col items-center justify-center gap-4  text-gray-500 sm:min-h-[400px]">
                    <h1 className="font-semibold">
                        No se encontraron registros con los criterios de
                        búsqueda especificados
                    </h1>
                    <p className="text-xs">
                        Pruebe nuevamente con otros criterios de filtrado
                    </p>
                </div>
            )}
            <div className="mb-6 mt-6 hidden items-center justify-end text-xs font-light text-gray-400 md:flex">
                <kbd className="mx-1 rounded-sm bg-gray-50 px-1.5 py-0.5 text-[0.6rem] ring-1">
                    Shift
                </kbd>
                +
                <Mouse className="mx-0.5 h-5 text-gray-400" />
                para navegar lateralmente.
            </div>
            <Pagination totalRecords={totalRecords} />
        </>
    )
}
