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
import dataToCsv from '@utils/dataToCsv'
import { CSVLink } from 'react-csv'
import { Button } from './button'
import { useSearchParams } from 'next/navigation'

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
        Number(useSearchParams().get('records')) == totalRecords
    )

    // dataToCsv(columns, data)

    return (
        <>
            <div className="mx-auto mt-6 flex items-center justify-between gap-4">
                <SearchBar placeholderMessage={searchBarPlaceholder} />

                <div className="flex gap-2">
                    <ColumnVisibilityDropdown
                        columns={table.getAllLeafColumns()}
                    />

                    <div className="group relative z-50">
                        {/*Tried using Tooltip component but couldn't make it work as intended, so I copied the styles from the tooltip to mantain the style */}
                        {totalRecordsCheck && (
                            <div className="pointer-events-none absolute left-0 top-10   bg-white  text-xs text-gray-500 opacity-0 transition delay-300 group-hover:pointer-events-auto group-hover:opacity-100">
                                <div className="prose prose-zinc inset-auto mt-2  cursor-default  rounded  border p-3 px-3 py-2 text-xs shadow-md ring-1 ring-inset prose-p:pl-2 ">
                                    Para descargar la hoja de datos, seleccione{' '}
                                    <br />
                                    <span
                                        className="font-bold transition hover:text-gray-700"
                                        onMouseEnter={() => {
                                            document
                                                .getElementById(
                                                    'records-selector'
                                                )
                                                ?.classList.add('animate-ping')
                                            setTimeout(() => {
                                                document
                                                    .getElementById(
                                                        'records-selector'
                                                    )
                                                    ?.classList.remove(
                                                        'animate-ping'
                                                    )
                                            }, 1800)
                                        }}
                                        onClick={() => {
                                            document
                                                .getElementById(
                                                    'records-selector'
                                                )
                                                ?.click()
                                        }}
                                    >
                                        Cantidad de registros: Todos los
                                        registros
                                    </span>
                                </div>
                            </div>
                        )}
                        <Button
                            className="group z-10"
                            disabled={totalRecordsCheck}
                            intent="outline"
                        >
                            <CSVLink
                                filename="data.csv"
                                data={dataToCsv(columns, data)}
                            >
                                Descargar hoja de datos
                            </CSVLink>
                        </Button>
                    </div>
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
                    <table className="fade-in -mx-4 mt-6 min-w-full table-fixed divide-y-2 sm:-mx-0">
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
            <div className="-mb-16 mt-6 flex items-center justify-end text-xs font-light text-gray-400">
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
